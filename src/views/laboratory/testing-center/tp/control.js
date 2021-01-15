import React from 'react' 
// ===================================================================== common
import ts from '@views/laboratory/testing-center/tp/common.js'  
import coms from '@/private/js/common.js'
import ResultingOperationLog from './resulting-operation-log'
import SetResult from './set-result'
// ===================================================================== antd
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== global template
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
const confirm = import('@antd/confirm')
// ===================================================================== private template
const Tabs = $async(()=>import('#tp/tabs'))
const Box = $async(()=>import('#tp/box/box'))
// ===================================================================== template
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form')) 
// ===================================================================== component
export default class extends React.Component{
	state = {  
		forms:[],
		btns:[],
		status: 45001,
		isCompletePro: false, // 是否完整项目
		submit1: [ // 迟发 
			{ label:'预计报告时间',		name:'delay_at',		type:'date-time' },
			{ label:'异常原因类型', 	name:'abnormal_type',	type: 'select', data: [] },
			{ label:'原因', 			name:'reason',			type: 'textarea', full:true, width:'100%' }
		],
		submit2: [ // 退单 & 终止
			{ label:'异常原因类型', 	name:'abnormal_type',	type: 'select', data: [] },
			{ label:'原因', 			name:'reason',			type: 'textarea', full:true, width:'100%' } 
		],
		btns_configs: {},
		submit3: [ // 转外包
			{ label:'外包单位', 		name:'outsourcing_company_code',	type: 'select', data: [], nameStr: 'label', idStr: 'value' }
		],
	}
	model = {} 
	param = this.props.match.params 
	form0 = [ // 公用条件
		{ label:'条码号', 			name:'spec_code' },
		{ label:'第三方条码号', 	name:'third_spec_code' },
		{ label:'实验号', 			name:'experiment_num' }, // 区分 病理号
		{ label:'姓名', 			name:'patient_name' },
		{ label:'项目',	 			name:'kind_id' },
		{ label:'自然项目', 		name:'parent_kind_id' },
		{ label:'医院名称', 		name:'hosp_id' }, 
		{ label:'提交时间', 		name:'date1', 			type:'date-range',	names:['ts_user_start_at','ts_user_end_at'], index:1, noVisible: true }, // 45002 
		{ label:'审核时间', 		name:'date2', 			type:'date-range',	names:['ts_audit_start_at','ts_audit_end_at'], index:2, noVisible: true  }, // 45003 
		{ label:'批准时间', 		name:'date3', 			type:'date-range',	names:['ts_approve_start_at','ts_approve_end_at'], index:3, noVisible: true  }, // 45004
		{ label:'操作时间', 		name:'date4', 			type:'date-range',	names:['start_date','end_date'] },
	]   
	btns = [
		[ // 结果录入 个别模型按钮不一样
			{ label:'上机', many:true, onClick: () => { 
				const param = this.setParams1(); 
				coms.interfaceConfirm('ts-report-card/sendtodevice', '上机', param, () => { this.fetch() })
			} },
			{ label:'保存结果', disabled: false, onClick: () => { 
				const data = this.props.getData() 
				let forms = data.map(i => {
					return {
					uuid: i.uuid, 
					spec_abnormal: "",
					content: "",
					dilution_multiple: i.dilution_multiple,
					result: i.result,
					spec_type: i.spec_type, // 标本类型已单独提交
					result1: i.result1 
					};
				});
				coms.interfaceConfirm('result-unit-item/updateall', '保存结果', { forms: JSON.stringify(forms)}, () => { this.fetch() })
			} },
			{ label:'提交', many:true, onClick: () => { 
				const data = this.props.getData() 
				let forms = data.map(i => {
					return {
					uuid: i.uuid, 
					spec_abnormal: "",
					content: "",
					dilution_multiple: i.dilution_multiple,
					result: i.result,
					spec_type: i.spec_type, // 标本类型已单独提交
					result1: i.result1 
					};
				});
				$http.submit(null, 'result-unit-item/updateall', { param: { forms: JSON.stringify(forms) }, onSuccess: () => {
					const selectedKeys = this.props.getSelectedKeys() 
					const over_linears = []
					const over_clinicals = []
					let uniqArr = []
					selectedKeys.forEach(i => {
						if (i.over_linear == '1') {
							over_linears.push(i.kind_name)
							uniqArr = [...new Set(over_linears)]
						}
						if (i.over_clinical == '1') {
							over_clinicals.push(i.spec_code)
						}
					}) 
					const param = this.setParams1(1);
					if (uniqArr.length || over_clinicals.length) {
						this.overLinearTips(uniqArr, over_clinicals, () => { 
							coms.interfaceConfirm('ts-report-card/uptest', '提交', param)
						})
						return false
					}
					coms.interfaceConfirm('ts-report-card/uptest', '提交', param)
				}}) 
			} },
			{ label:'删除结果', many:true, onClick: () => {
				const param = this.setParams1(1);
				coms.interfaceConfirm('ts-report-card/delresult', '删除结果', param, () => { this.fetch() })
			} },
			{ label:'迟发', many: true, onClick: () => { 
				this.refs.modal1.open() 
			} },
			{ label:'退单', many: true, onClick: () => {
				this.refs.modal2.open()  
				this.setState({btns_configs: {title: '退单', status: '45007'}})
			} },
			{ label:'项目终止', many: true, onClick: () => {
				this.refs.modal2.open() 
				this.setState({btns_configs: {title: '项目终止', status: '45008'}})
			} },
			{ label:'修改资料' },
			{ label:'转外包', many: true, onClick: () => { 
				this.refs.modal3.open() 
			} },
			{ label:'取消外包', many: true, onClick: () => {
				const param = this.setParams3();
				coms.interfaceConfirm('specimen/delOutsourcingData', '取消外包', param, () => { this.fetch() })
			} },
			{ label:'结果操作日志', onClick: () => {
				this.refs.modal4.open() 
				this.ResultingOperationLogRef.changeFetch(this.props.infos.uuid)
			} },
			{ label:'设置结果', onClick: () => {
				this.refs.modal5.open() 
				let param = {
        			experiment_num: this.props.infos.experiment_num,
          			spec_code: this.props.infos.spec_code,
          			kind_id: this.props.infos.kind_id
				}
				this.setResultRef.changeFetch(param)
			} }, // 44014 等
		],
		[
			{ label:'保存结果', many:true },
			{ label:'回退' }, // 病理
			{ label:'删除结果' },
			{ label:'审核', many:true },
			{ label:'不通过', many:true },
			{ label:'迟发' },
			{ label:'退单' },
			{ label:'项目终止' },
			{ label:'修改资料' },
			{ label:'危机值报告' },
		],
		[
			{ label:'保存结果', many:true },
			{ label:'回退' }, // 病理
			{ label:'批量批准', many:true },
			{ label:'手动批准', many:true },
			{ label:'拒绝' },
			{ label:'删除结果' },
			{ label:'迟发' },
			{ label:'退单' },
			{ label:'项目终止' },
			{ label:'修改资料' },
			{ label:'危机值报告' },
			{ label:'预览并批准报告单' },
			{ label:'合并项目' },
			{ label:'合并项目管理' },
		],
		[
			{ label:'报告终止', many:true },
			{ label:'预览报告单' },
		],
		[
			{ label:'保存结果', many:true },
			{ label:'提交', many:true },
			{ label:'预览报告单' },
		],
		[
			{ label:'预览报告单' },
		]
	] 
	componentDidMount(){
		this.props.onRef && this.props.onRef(this) 
		this.setState({ forms: this.form0, btns:this.btns[0] })
		const { submit1, submit2, submit3 } = this.state
		$fn.dataSave('dis-item-62050-data').then(local => { // 异常原因类型
			if($fn.hasArray(local)){ 
			submit1[1].data = local
			submit2[0].data = local
			}else{
			  $http.submit(null,'dis-item/item', { param:{dis_code:62050}, loading:false}).then(data=>{
				submit1[1].data = data
				submit2[0].data = data
				$fn.dataSave('dis-item-62050-data', data)
			  }) 
			}
		})  
		cacheApi.then(f => {
            const d = f.default 
			$fn.getCache({ // 外包单位 
				cache: d.getOutsourcingDepartList, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        submit3[0].data = data 
                        this.setState({submit3})
                    } else {
                        $http.submit(null, 'specimen/getOutsourcingDepartList').then(data => {
                            submit3[0].data = data 
                            this.setState({submit3})
                            $fn.setCache()
                        })
                    }
				}
            })
		})
	}  
	tabs = [
		{ title:'结果录入', status:45001 },
		{ title:'已提交', status:45002 },
		{ title:'已审核', status:45003 },
		{ title:'已批准', status:45004 },
		{ title:'已迟发', status:45006 },
		{ title:'已退单', status:45007 },
		{ title:'已终止', status:45008 },
	]
	fetch = (param) => { 
		this.props.changeFetch({...this.model, ...param})
	} 
    // 多条数据 - 提交传参 
    setParams1(type) {
		const params = { 
		  ids: this.props.list.map(i => i.uuid),
		  project_id: ts.getPath().project_id,
		  result_id: ts.getPath().id,
		  status: this.state.status,
		  type: type ? type : ''
		}; 
		return params;
	}  
    // 单条数据 - 提交传参 
    setParams2(type) {
		const params = { 
		  ids: [this.props.infos.uuid],
		  project_id: ts.getPath().project_id,
		  result_id: ts.getPath().id,
		  status: this.state.status,
		  type: type ? type : ''
		};
		return params;
	}  
    // 线性范围
    overLinearTips(data, data1, cb) {
		const title1 = data.length ? `【项目“${data.join('、')}”的结果已超出线性范围】，` : ''
		const title2 = data1.length ? `【条码“${data1.join('、')}”的结果已超出临床可报告范围】，` : ''
		confirm.then(f=>{
			f.default({
				msg:`${title1}${title2}是否继续提交?`,
				onOk: close => {   
					cb && cb()
				}
			})
		})  
	} 
	// 转外包 & 取消外包-参数
	setParams3(v) {
		let arr = this.props.list.map(item => {
			return {
				spec_code: item.spec_code,
				kind_id: item.kind_id,
				kind_category: item.kind_category,
				parent_kind_category: item.parent_kind_category,
				parent_kind_id: item.parent_kind_id,
				kind_name: item.kind_name,
				parent_kind_name: item.parent_kind_name
			}
		})
		let param = {
			outsourcing_data: arr,
			entry_type: 2, // 1标本 2 检测中心
			outsourcing_type: 2, // 外包类型：1常规2临时 
		}
		if ($fn.hasObject(v)){ param = {...param, ...v}}
		return param;
	}
	btnDisabled (many, disabled) {
		const { list, infos } = this.props
		let d = true 
		if (disabled === false) { return false }
		if (many) {
			d = $fn.hasArray(list) ? false :true
		} else {
			d = $fn.hasObject(infos) ? false :true
		}
		return d
	}
	render(){
		const { pullLoading, forms, btns, submit1, submit2, btns_configs, submit3 } = this.state 
		return (
			<Box>
				<Tabs 
					data={ this.tabs } 
					onTabs = { (data, index) => { 
						forms.forEach((v, i) => {  
							if (v.index) {
								if (String(v.index) === String(index)) {
									v.noVisible = false
								} else {
									v.noVisible = true
									if (v.type === 'date-range') { // 日期
										this.model[v.names[0]] = ''
										this.model[v.names[1]] = ''
									} else {
										this.model[v.name] = ''
									}
								}
							}
						}) 
						this.setState({status: data.status, btns: this.btns[index], forms: forms}, () => {
							this.fetch({status: data.status}) 
						})    
					}}
				/>
				{/* 操作按钮 */}
				{
					$fn.hasArray(btns) && (
						<nav className='xplr mt5'>
							{
								btns.map((v,i)=><Button key={i} className='mr10 mb5' ghost label={v.label} disabled={ this.btnDisabled(v.many, v.disabled) } onClick={() => v.onClick && v.onClick() } title={v.many?'请勾选一条或多条列表数据':'请选择一条列表数据'} />)
							}
						</nav>
					)
				}
				{/* 搜索 */}
				<SearchForm
					className 	= { $fn.hasArray(btns) ? 'pt5 pb5' : 'pt10' }
					data		= { forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
				/>
				<Modal ref='modal1' title='迟发' width={648} noFooter>
					<SubmitForm
						modal
						data = { submit1 }
						onSubmit = { v => {  
							let param = { ...this.setParams1(), ...v, cross_page_submit: this.state.isCompletePro ? 1 : 0 };
							$http.submit(null, 'ts-report-card/updelay', { param: param, onSuccess: () => {
								message.then(f=>f.default.success('操作成功'))
								this.refs.modal1.close()
								this.fetch() 
							} })
						}}
						onClose = { ()=>this.refs.modal1.close() }
					 />
				</Modal>
				<Modal ref='modal2' title={btns_configs.title} width={648} noFooter>
					<SubmitForm
						modal
						data = { submit2 }
						onSubmit = { v => {  
							let param = { ...this.setParams1(), ...v, cross_page_submit: this.state.isCompletePro ? 1 : 0, status_abnormal: btns_configs.status };
							$http.submit(null, 'ts-report-card/upstatusabnormal', { param: param, onSuccess: () => {
								message.then(f=>f.default.success('操作成功'))
								this.refs.modal2.close()
								this.fetch() 
							} }) 
						}}
						onClose = { ()=>this.refs.modal2.close() }
					 />
				</Modal>
				<Modal ref='modal3' title='转外包' width={648} noFooter>
					<SubmitForm
						modal
						data = { submit3 }
						onSubmit = { v => {   
							$http.submit(null, 'specimen/changeSpec2Outsourcing', { param: this.setParams3(v), onSuccess: () => {
								message.then(f=>f.default.success('操作成功'))
								this.refs.modal3.close()
								this.fetch() 
							} }) 
						}}
						onClose = { ()=>this.refs.modal3.close() }
					 />
				</Modal>
				<Modal ref='modal4' title='结果操作日志' width={1000} noFooter>
					<ResultingOperationLog onRef={ ref => this.ResultingOperationLogRef = ref} />
				</Modal>
				<Modal ref='modal5' title='设置结果' width={1000} okText='保存结果' onOk={() => {
					this.setResultRef.submits(() => {
						this.refs.modal5.close()
						this.props.changeFetch()
					}) 
				}}>
					<SetResult onRef={ ref => this.setResultRef = ref} infos={this.props.infos} />
				</Modal>
			</Box>
		)
	}
}