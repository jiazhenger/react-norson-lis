import React from 'react'
// ===================================================================== utils
import Time from '@utils/time'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const message = import('@antd/message')
const confirm = import('@antd/confirm')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
const NaturalProjectsChild = $async(() => import('../tp/natural-projects-child'))
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		data1: {},
		showmodel:'',
	}
    billStatusOption = [
        { label: "财务待审核",      value: "45301" },
        { label: "财务待结算",      value: "45302" },
        { label: "财务已结算",      value: "45303" },
        { label: "已作废",          value: "45304" },
        { label: "业务员待审核",    value: "45305" }
    ]
	payTypeOptions = [
        { label: "全部", value: ""  },
        { label: "正常", value: "1" },
        { label: "冲抵", value: "2" }
    ]
	forms = [
		{ label:'帐单生成时间', name: 'date', 				names:['start_at','end_at'], type:'date-range' },
		{ label:'条码号', 	    name:'spec_code' },
		{ label:'客户名称', 	name:'hosp_id', 			type:'select', data:[] },
		{ label:'实验科室', 	name:'project_parent_id', 	type:'select', data:[] },
        { label:'区域', 		name:'region_id', 			type:'select', data:[] },
        { label:'业务员', 		name:'salesman_id', 		type:'select', data:[] },
        { label:'姓名', 	    name:'patient_name' },
        { label:'自然项目', 	name:'parent_kind_id',      type:'select', data:[] },
		{ label:'状态', 	    name:'status', 	            type:'select', data: this.billStatusOption,   nameStr:'label', idStr:'value' },
		// { label:'账单类型', 	name:'pay_type',      	    type:'select', data: this.payTypeOptions,   nameStr:'label', idStr:'value' },
    ]
	model = {
		start_at: Time.customDate(3, "date"),
		end_at: Time.customDate("current-date"),
		hosp_id: '',
		status: '',
		region_id: '',
		project_parent_id: '',
		salesman_id: '',
	}
	getDataAsync() {
		let T = new Date()
		var y = T.getFullYear();		//年
		var m = T.getMonth() + 1;		//月
		var d = T.getDay();			//日
		if ( m < 10 ) {
			m = '0' + m
		}
		if ( d < 10 ) {
			d = '0' + d
		}
		console.log(T);
		this.model.start_at = y + '-' + m + '-' + d
		this.forms[0].names[0] = this.model.start_at
		console.log(this.forms[0].names)
	}
	componentDidMount(){
		$fn.dataSave('bill-phase-select-data').then(local => { // 账期
			if($fn.hasArray(local)){
				this.forms[0].data = local
			}else{
				$http.pull(null,'bill-phase/select', {dataName:null}).then(data=>{
					this.forms[0].data = data.items
					$fn.dataSave('bill-phase-select-data', data)
				})
			}
		})
		cacheApi.then(f => {
            const d = f.default
            $fn.getCache({ // 客户名称
                cache: d.BsHospitalSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        this.forms[2].data = data
                    } else {
                        $http.submit(null, 'bs-hospital/select').then(data => {
                            this.forms[2].data = data
                            $fn.setCache()
                        })
                    }
                }
            })
            $fn.getCache({ // 实验科室
                cache: d.ProjectTeamSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        this.forms[3].data = data
                    } else {
                        $http.submit(null, 'project-team/select').then(data => {
                            this.forms[3].data = data
                            $fn.setCache()
                        })
                    }
                }
            })
			$fn.getCache({ // 区域
				cache: d.bsareaSelect, callback: (data) => {
					if ($fn.hasArray(data)) {
						this.forms[4].data = data
					} else {
						$http.submit(null, 'bs-area/select').then(data => {
							this.forms[4].data = data
							$fn.setCache()
						})
					}
				}
			})
			$fn.getCache({ // 业务员
				cache: d.bssalesmanSelect, callback: (data) => {
					if ($fn.hasArray(data)) {
						this.forms[5].data = data
					} else {
						$http.submit(null, 'bs-salesman/select').then(data => {
							this.forms[5].data = data
							$fn.setCache()
						})
					}
				}
            })
            $fn.getCache({ // 自然项目
				cache: d.kindItemSelect, callback: (data) => {
					if ($fn.hasArray(data)) {
						this.forms[7].data = data
					} else {
						$http.submit(null, 'kd-market/select').then(data => {
							this.forms[7].data = data
							$fn.setCache()
						})
					}
				}
			})
		})
		this.getDataAsync()
		this.fetch()
	}
	// paging
	fetch = param => $fn.fetch.call(this,'bill-st/parentkind', param)
	cols = [
        { title: '客户名称',	field: 'hosp_name',         width:100 },
		{ title: '接收时间',    field: 'check_time',        width:160 },
        { title: '条码号',		field: 'old_spec_code',     width:100 },
        { title: '自然项目',    field: 'parent_kind_name',  width: 160 },
        { title: '总价',	    field: 'sum_sprice',        width:100 },
        { title: '总实际价格',	field: 'sum_price',         width:100 },
		{ title: '姓名', 		field: 'patient_name',      width:80 },
		{ title: '性别', 	    field: 'sex_name',          width:80 },
		{ title: '年龄',        field: 'age',               width:80 },
		{ title: '送检科室',    field: 'department_name',    width:80 },
		{ title: '医生', 	    field: 'doctor',             width:100 },
		{ title: '实验科室', 	field: 'project_parent_name',width:100 },
		{ title: '开票单位',	field: 'organization_name',  width:160 },
		{ title: '开票单位编码',field: 'organization_code',   width:170 },
		{ title: '业务员',	    field: 'salesman_user',      width:100 },
		{ title: '业务员编码',	field: 'salesman_code',      width:100 },
		{ title: '区域',	    field: 'region_name',        width:100 },
		{ title: '区域编码',	field: 'region_num',          width:100 },
	]
	ButtonGroup = () => {
		return [
			{ label:'导出F1', code:'F1', onClick:()=>{
				confirm.then(f=>{
					f.default({
						msg:'是否导出自然项目?',
						onOk: close => {
							this.model.export= 1
							$http.submit(null,'bill-st/parentkind', { param: this.model } ).then(data=>{
								message.then(f=>f.default.success('导出成功'))
								window.location.href = data.url;
								close()
							})
						}
					})
				})
			} },
		]
	}
	render(){
		const { data, data1, pullLoading, pag, submit, showmodel, selectedKeys } = this.state
		return (
			<Page title='自然项目统计' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange={(v,press)=>$fn.onChange.call(this,v,press)
						// (v, press, { name, data }) => {
						// $fn.onChange.call(this, v, press, () => {
						// 	if (name && name === 'device_id') {
						// 		return { device_name: data.name }
						// 	}
						// })
						// }
					} 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
					init    	= { form => { form.setFieldsValue({date:[Time.customDate(2, "date"), Time.customDate("current-date")]}) }}
				/>
				{/* 表格 */}
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { current => {
						console.log(current)
						this.setState({data1:current})
						this.setState({selectedKeys:current})
					} }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
					// sort
					onSort			= { v => $fn.onSort.call(this, v) }
				/>
				<NaturalProjectsChild className='fv rel ex xplr' model={this.model} rowdata={ data1 || [] } />
			</Page>
		)
	}
}