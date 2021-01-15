// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
// ===================================================================== 图片
import is_pic_s from '@img/is_pic_s.png'
// ===================================================================== common
import coms from '@/private/js/common.js'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const message = import('@antd/message')
// =====================================================================
const Image = $async(()=>import('@tp/image'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== related component
const InvalidProject = $async(()=>import('./tp/invalid-project'))
// ===================================================================== 缓存
const cacheApi = import('@/private/api/cacheApi') 
// ===================================================================== component
export default class extends React.Component{
	audit_status_select = [
		{ label: '审核失败', value: -1 },
		{ label: '待审核', value: 0 },
		{ label: '审核成功', value: 1 },
		{ label: '待录入', value: -2 }
	]
	audit_status_select1 = [
		{ label: '全部', value: 99 },
		{ label: '待审核', value: 0 },
		{ label: '审核通过', value: 1 },
		{ label: '待录入', value: -2 } 
	]
	additional_kind_select = [
		{ label: '是', value: 1 },
		{ label: '否', value: 0 },
	]
	additional_kind_select1 = [
		{ label: '是', value: 1 },
		{ label: '所有', value: 0 }
	] 
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		selectedRow: {},
		keys: 0,
		key:0,
		hosp_name: '',
		box_num: '',
		hosp_data: [],
		box_data: [],
		submit: [
			{ label:'条码号', 			name:'spec_code',	type: 'input',			required:true,		disabled:true},
			{ label:'用户名',			name:'account',		type: 'input',			required:true},
			{ label:'密码', 			name:'password', 	type: 'password',		required:true}, 
			{ label:'作废原因', 		name:'reason',		type: 'textarea',		required:true,		full: true,		width: '100%'},
		],
		submit2: [
			{ label:'当前条码号', 		name:'old_spec_code',		type: 'input',			required:true,		disabled:true},
			{ label:'第三方条码', 		name:'third_spec_code',		type: 'input',			required:true},
			{ label:'第三方来源', 		name:'third_source_type',	type: 'select',			data: [], nameStr:'name', idStr:'value',required:true} 
		],
		submit3: [
			{ label:'条码号', 			name:'spec_code',	type: 'input',			required:true},
			{ label:'医院名称', 		name:'hosp_id',		type: 'select',			data: [], nameStr:'name', idStr:'value',required:true},
			{ label:'用户名',			name:'account',		type: 'input',			required:true},
			{ label:'密码', 			name:'password', 	type: 'password',		required:true} 
		],
		forms: [
			{ label:'加做项目',		name:'additional_kind',		type:'select',	data: this.additional_kind_select1,  nameStr:'label', idStr:'value' },
			{ label:'状态',			name:'audit_status',		type:'select',	data: this.audit_status_select1, 	nameStr:'label', idStr:'value' },
			{ label:'标本箱号', 	name:'box_num_id',			type:'select',	data: [], 	nameStr:'name', idStr:'value' }, // 下拉带搜索分页 | 未完成分页
			{ label:'条码号', 		name:'spec_code', 			type:'input' }, // 回车清空无效
			{ label:'医院名称', 	name:'hosp_id',				type:'select',	data: [], 	nameStr:'name', idStr:'value' },  
			{ label:'录入时间', 	name:'date', 				names:['start_at','end_at'], type:'date-range' },
			{ label:'仅显示有图',	name:'view_pic',			type:'checkbox'}
		]
	} 
	model = {start_at: coms.intervalTime(10, '00:00:00'), end_at: coms.intervalTime(null, '23:59:59')} 
	componentDidMount(){  
		let {submit2, forms, submit3} = this.state
		cacheApi.then(f => {
			// 医院
			$fn.getCache({
				cache: f.default.BsHospitalSelect, name: 'name', id: 'value', callback: (data) => {
					if ($fn.hasArray(data)) {
						forms[4].data = data
						submit3[1].data = data
						this.setState({'hosp_data': data, forms: forms, submit3: submit3})
                    } else {
                        $http.submit(null, 'bs-hospital/select').then(data => {
                            forms[4].data = data
							submit3[1].data = data
							$fn.setCache()
							this.setState({'hosp_data': data, forms: forms, submit3: submit3})
						})
                    }
				}
			})
		}) 
		// 标本箱号
		$fn.dataSave('box-select3-data').then(local => {
			if($fn.hasArray(local)){
			  forms[2].data = local
			  this.setState({'box_data': local, forms: forms})
			}else{
				$http.pull(null,'box/select3').then(data=>{
					forms[2].data = data.items 
					$fn.dataSave('box-select3-data', data.items)
			  		this.setState({'box_data': data.items, forms: forms})
				})
			}
		}) 
		// 第三方来源
		$fn.dataSave('dis-item-69000-data').then(local => {
			if($fn.hasArray(local)){  
			submit2[2].data = local
			this.setState({submit2})
			}else{
			  $http.submit(null,'dis-item/item', { param:{dis_code:69000}, loading:false}).then(data=>{
				submit2[2].data = data
				this.setState({submit2})
				$fn.dataSave('dis-item-69000-data', data)
			  }) 
			}
		}) 
		this.fetch()
	}
	fetch = param => $fn.fetch.call(this,'specimen/itemlists', {...param, hosp_name: this.state.hosp_name, box_num: this.state.box_num, ...this.model})
	cols = [
		{ type:'checkbox' },
		{ title: '标本箱编号', 		field: 'box_num', 			width:90 },
		{ title: '医院名称', 		field: 'hosp_name', 		width:140, 		tdCss: 'wpn',	innerCss: 'p5' },
		{ title: '条码号', 			field: 'spec_code', 		width:140, render: ({rows}) => {
			let d = ''
			if ($fn.hasArray(rows.tags)) { 
				d = rows.tags.map((item, index) => {
					return (<div style={{border: '1px solid #afdbf0', color: '#37a6da', borderRadius: '8px', padding: '0 4px', margin: '0 2px', lineHeight: '14px' }} key={index}>{item.item_name}</div>)
				})   
			} 
			let img = ''
			if (!$fn.isEmpty(rows.pic_path)) {
				img = <Image style={{margin: '0 2px 0 6px'}} src={ is_pic_s } height='12px' width='16px'/>
			}
			return <div className='fxw xm'>{rows.spec_code} {img} {d}</div>  
		}, 		tdCss: 'wpn',	innerCss: 'p5' },
		{ title: '采样时间', 		field: 'coll_time', 		width:140,		sort: true },
		{ title: '项目状态', 		field: 'audit_status', 		width:120, 	render: ({rows}) => {
			return window.$fn.filterSelect(this.audit_status_select, rows.audit_status, 'label', 'value') 
		} }, 
		{ title: '加做项目', 		field: 'additional_kind', 	width:90, 	render: ({rows}) => {
			return window.$fn.filterSelect(this.audit_status_select, rows.additional_kind, 'label', 'value') 
		} },  
		{ title: '项目列表', 		field: 'kind_str', 			width:240, 		tdCss: 'wpn',	innerCss: 'p5'  },
		{ title: '录入时间', 		field: 'created_at', 		width:140,		sort: true },
		{ title: '第三方来源', 		field: 'third_source_type_name', 			width:140 },
		{ title: '第三方条码', 		field: 'third_spec_code', 					width:140 },
	]
	ButtonGroup = () => {
		const { selectedKeys, selectedRow } = this.state
		return [
			{ label:'录入项目F1', code:'F1', onClick:()=>{  
				$fn.push(this, $fn.getRoot(2).root + 'project-list/index/info-project') 
			}}, 
			{ label:'审核项目F2', code:'F2', disabled: !$fn.hasObject(selectedRow), ghost:true, onClick:()=>{ 
				$fn.push(this, $fn.getRoot(2).root 
				+ `project-list/index/info-project?isAudit=true&spec_code=${selectedRow.spec_code}&additional_kind=${selectedRow.additional_kind}&view_pic=${this.model.view_pic ? 1 : 0}`) 
			}}, 
			{ label:'批量审核F3', code:'F3', ghost:true, disabled: !$fn.hasArray(selectedKeys), onClick:()=>{
				const param = {spec_ids: selectedKeys.map(v=>v.uuid)}
				coms.interfaceConfirm('specimen/batchaudit', '批量审核', param, () => { this.fetch(this.model) })
			}}, 
			{ label:'客户变更F7', code:'F7', ghost:true, onClick:()=>{
				this.refs.modal3.open()  
			}}, 
			{ label:'条码作废', ghost:true, disabled: !$fn.hasObject(selectedRow), onClick:()=> {
				this.refs.modal.open() 
				const { submit } = this.state
				submit[0].value = selectedRow.spec_code.substr(0, 12)
				this.setState({ submit })
			} }, 
			{ label:'项目作废', ghost:true, disabled: !$fn.hasObject(selectedRow), onClick:()=>{
				this.refs.modal1.open() 
				this.InvalidProjectRef.changeList(selectedRow) 
			}}, 
			{ label:'绑定第三方条码', ghost:true, disabled: !$fn.hasObject(selectedRow), onClick:()=>{ 
				this.refs.modal2.open() 
				const { submit2 } = this.state
				submit2[0].value = selectedRow.spec_code.substr(0, 12)
				this.setState({ submit2 })
			}}
		]
	}
	render(){
		const { data, pullLoading, pag, keys, hosp_data, box_data, submit, submit2, submit3, forms, key } = this.state
		return (
			<Page title='项目清单' ButtonGroup={this.ButtonGroup()} key={keys}>
				{/* 搜索 */}
				<SearchForm
					data		= { forms }  
					key = { key }
					onChange	= { (v,press)=> {
						if (Object.keys(v)[0] === 'hosp_id') {
							const hosp_name = v['hosp_id'] ? window.$fn.filterSelect(hosp_data, v['hosp_id'], 'name', 'value') : ''
							this.setState({'hosp_name': hosp_name})
							$fn.onChange.call(this,v,press,null,true)
						} else if (Object.keys(v)[0] === 'box_num_id') { 
							const box_num = v['box_num_id'] ? window.$fn.filterSelect(box_data, v['box_num_id'], 'name', 'value') : ''
							this.setState({'box_num': box_num})
							$fn.onChange.call(this,v,press,null,true)
						} else if (Object.keys(v)[0] === 'view_pic') { 
							$fn.onChange.call(this,{view_pic: v.view_pic ? 1 : 0},press,null,true)
						} else {
							$fn.onChange.call(this,v,press,null,true)
						}  
					} } 
					// onSubmit	= { () => { 
					// 	forms[3].value = ''
					// 	this.state.key++
					// 	this.setState({key, forms})
					// 	// j+2 
					// } } 
					onSubmit    = { $fn.onSubmit.bind(this) }
					onReset		= { $fn.onReset.bind(this,forms) }
					loading		= { pullLoading }
					init        = { form => {
						this.form = form
						form.setFieldsValue({date:[coms.intervalTime(10, '00:00:00'), coms.intervalTime(null, '23:59:59')]})
					}}
				/>
				{/* 表格 */}
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { (select, rows) => {
						this.setState({ selectedKeys: select, selectedRow: rows }) 
					} }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
					onSort			= { v => $fn.onSort.call(this, v) }
				/>
				<Modal ref='modal' title='条码作废' width={700} noFooter>
					<SubmitForm
						modal
						data = { submit }
						onSubmit = { v => {    
							$http.submit(null, 'specimen/invalid', {param: v}).then(data=>{
								message.then(f=>f.default.success('条码作废成功'))
								this.refs.modal.close()
								this.fetch(this.model)
							})  
						}}
						onClose = { ()=>this.refs.modal.close() }
					 />
				</Modal> 
				<Modal ref='modal1' title='项目作废' width={1000} noFooter>  
					 <InvalidProject onRef={ref => this.InvalidProjectRef = ref} onchanged={() => this.fetch(this.model)} />
				</Modal> 
				<Modal ref='modal2' title='绑定第三方条码' width={700} noFooter>
					<SubmitForm
						modal
						data = { submit2 }
						onSubmit = { v => {  
							$http.submit(null, 'specimen/bindThirdSpec', { param: v }).then(data=>{
								message.then(f=>f.default.success('绑定成功'))
								this.refs.modal2.close()
								this.fetch(this.model)
							})  
						}}
						onClose = { ()=>this.refs.modal2.close() }
						init	= { form => {
							this.form = form 
						} }
					 />
				</Modal>
				<Modal ref='modal3' title='客户变更' width={700} noFooter>
					<SubmitForm
						modal
						data = { submit3 }
						onSubmit = { v => {  
							$http.submit(null, 'specimen/changehosp', { param: v }).then(data=>{
								message.then(f=>f.default.success('操作成功'))
								this.refs.modal3.close()
								this.fetch(this.model)
							})  
						}}
						onClose = { ()=>this.refs.modal3.close() }
						init	= { form => {
							this.form = form 
						} }
					 />
				</Modal>
			</Page>
		)
	}
}