import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
const confirm = import('@antd/confirm')
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
	}
	outsourStatusOption = [
		{ label: '全部',   value: '' },
		{ label: '待派送', value: 1 },
		{ label: '派送中', value: 2 },
		{ label: '已送达', value: 3 }
	]
	forms = [
		{ label:'物流人员', name:'empl_id',      		type:'select', data:[] },
		{ label:'派送状态', name:'outsourcing_status', 	type:'select', data: this.outsourStatusOption, nameStr:'label', idStr:'value' },
		{ label:'外送时间', name: 'date',				names:['start_at','end_at'],type:'date-range' },
        { label:'条码号',	name:'spec_code' },
    ]
	model = {
		spec_code: '', 
		outsourcing_status: '',
		outsourcing_type: '',
		empl_id: '',
		start_date: '',
		end_date: '',
	}

	componentDidMount(){
		cacheApi.then(f => {
            const d = f.default
			$fn.getCache({ // 区域
				cache: d.employeeSelect, callback: (data) => {
					if ($fn.hasArray(data)) {
						this.forms[0].data = data
					} else {
						$http.submit(null, 'employee/select').then(data => {
							this.forms[0].data = data
							$fn.setCache()
						})
					}
				}
			})
			$fn.getCache({ // 物流人员
				cache: d.employeeSelect, callback: (data) => {
					if ($fn.hasArray(data)) {
						this.forms[0].data = data
					} else {
						$http.submit(null, 'employee/select').then(data => {
							this.forms[0].data = data
							$fn.setCache()
						})
					}
				}
			})
		})
		this.fetch(this.model)
	}
	
	fetch = param => $fn.fetch.call(this,'bill-st/outsourcingList', param)
	cols = [
		{ title: '外送单位',		field: 'outsourcing_company', 	width:130 },
		{ title: '外送时间',		field: 'outsourcing_created_at',width:160 },
		{ title: '派送状态',		field: 'outsourcing_status', 	width:80, render: ({rows}) => {
			return window.$fn.filterSelect(this.outsourStatusOption, rows.outsourcing_status, 'label', 'value') 
		} },
		{ title: '送达时间',		field: 'outsourcing_updated_at',width:160 },
		{ title: '外送人员', 		field: 'outsourcing_empl',		width:100 },
		{ title: '岗位', 			field: 'project_name', 	width:100 },
		{ title: '接收时间', 		field: 'check_time',	width:160 },
		{ title: '客户名称', 		field: 'hosp_name', 	width:100 },
		{ title: '条码号', 		    field: 'old_spec_code',  width:130, render: ({rows})=> {
			let len = rows.old_spec_code
			if (len.length == 14) {
				len = len.slice(0,11) + '-' + len.slice(12)
				return rows.old_spec_code = len
			} else {
				return rows.old_spec_code = len
			}
		} },
		{ title: '自然项目', 	    field: 'parent_kind_name',width:130 },
		{ title: '项目名称',        field: 'kind_name',      width:130 },
		{ title: '送检科室', 		field: 'department_name',width:100 },
		{ title: '标准价格',		field: 'sprice', 	    width:80 },
		{ title: '实际价格',		field: 'price', 	    width:80 },
		{ title: '姓名', 		    field: 'patient_name',  width:80 },
		{ title: '性别', 	        field: 'sex_name',      width:80 },
		{ title: '年龄',            field: 'age',           width:80 },
		{ title: '送检科室', 		field: 'department_name',width:100 },
		{ title: '医生',		    field: 'doctor', 	    width:100 },
		{ title: '备注', 			field: 'remark', 		width:100 },
		{ title: '账单属性',		field: 'attribute_name',width:100 },
		{ title: '实验科室',		field: 'project_parent_name', width:100 },
		{ title: '开票单位（NC）',	 field: 'organization_name',   width:100 },
		{ title: '开票单位编码（NC）',field: 'organization_code',   width:160 },
		{ title: '业务员',		    field: 'salesman_user',	width:100 },
		{ title: '业务员编码',		field: 'salesman_code',	width:100 },
		{ title: '区域',		    field: 'region_name',	width:100 },
		{ title: '区域编码',		field: 'region_num',	 width:100 },
	]
	ButtonGroup = () => {
		return [
			{ label:'导出', onClick:()=>{
				confirm.then(f=>{
					f.default({
						msg:'是否导出数据?',
						onOk: close => {
						$http.submit(null,'bill-st/outsourcingList', { param: {export: 1} } ).then(data=>{
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
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='外包清单管理' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange={(v, press, { name, data }) => {

						$fn.onChange.call(this, v, press, () => {
							if (name && name === 'device_id') {
								return { device_name: data.name }
							}

						})
					} } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
				/>
				{/* 表格 */}
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { v => this.setState({ selectedKeys: v }) }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
					// sort
					onSort			= { v => $fn.onSort.call(this, v) }
				/>
			</Page>
		)
	}
}