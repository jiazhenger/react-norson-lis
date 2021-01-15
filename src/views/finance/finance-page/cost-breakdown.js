import React from 'react'
import Time from '@utils/time'
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
const confirm = import('@antd/confirm')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
const BillInfo = $async(()=>import('./finance-list/bill-info'))

export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		specCode: '',
	}
	billStatusOption = [
        { label: "财务待审核", 	value: "45301" },
        { label: "财务待结算", 	value: "45302" },
        { label: "财务已结算", 	value: "45303" },
        { label: "已作废", 	   	value: "45304" },
        { label: "业务员待审核",value: "45305" }
	]
	payTypeOptions = [
        { label: "全部", value: "" },
        { label: "正常", value: "1" },
        { label: "冲抵", value: "2" }
    ]
	forms = [
		{ label:'接收标本时间', name: 'date',				names:['start_at','end_at'],type:'date-range' },
		{ label:'条码号', 	    name:'spec_code' },
		{ label:'客户名称', 	name:'hosp_id',      		type:'select', 	data:[] },
		{ label:'实验科室', 	name:'project_parent_id', 	type:'select', 	data:[] },
        { label:'区域', 		name:'region_id', 			type:'select', 	data:[] },
        { label:'业务员', 		name:'salesman_id', 		type:'select', 	data:[] },
        { label:'姓名', 	    name:'patient_name' },
		{ label:'项目名称', 	name:'item_name' },
        { label:'状态', 		name:'status', 				type:'select', 	data: this.billStatusOption, nameStr:'label', idStr:'value' },
		{ label:'账单类型', 	name:'pay_type', 			type:'select', 	data: this.payTypeOptions,   nameStr:'label', idStr:'value' },
    ]
	model = {
		start_at: Time.customDate(2, "date"),
		end_at: Time.customDate("current-date"),
	}
	componentDidMount(){
		$fn.dataSave('bs-hospital-select-data').then(local => { // 客户名称
			if($fn.hasArray(local)){
				this.forms[2].data = local
			}else{
				$http.pull(null,'bs-hospital/select', {dataName:null}).then(data=>{
					this.forms[2].data = data.items
					$fn.dataSave('bs-hospital-select-data', data)
				})
			}
		})
		$fn.dataSave('project-team-selectMenu-data').then(project => { // 实验科室
			if($fn.hasArray(project)){
				this.forms[3].data = project
			}else{
				$http.pull(null,'project-team/selectMenu', {dataName:null}).then(data=>{
					this.forms[3].data = data
					$fn.dataSave('project-team-selectMenu-data', data)
				})
			}
		})
		$fn.dataSave('bs-area-select-data').then(bsArea => { // 区域
			if($fn.hasArray(bsArea)){
				this.forms[4].data = bsArea
			}else{
				$http.pull(null,'bs-area/select', {dataName:null}).then(data=>{
					this.forms[4].data = data.items
					$fn.dataSave('bs-area-select-data', data)
				})
			}
		})
		$fn.dataSave('bs-salesman-select-data').then(bsSalesman => {// 业务员
			if($fn.hasArray(bsSalesman)){
				this.forms[5].data = bsSalesman
			}else{
				$http.pull(null,'bs-salesman/select', {dataName:null}).then(data=>{
					this.forms[5].data = data.items
					$fn.dataSave('bs-salesman-select-data', data)
				})
			}
		})
		this.fetch()
	}

	fetch = param => $fn.fetch.call(this,'bill-st/detailindex', param)
	cols = [
		{ title: '岗位',		    field: 'project_name', 	width:130 },
		{ title: '接收时间',		field: 'check_time',    width:160 },
		{ title: '客户名称',		field: 'hosp_name', 	width:160 },
		{ title: '条码号',			field: 'old_spec_code', width:100,render: ({text,rows})=> <span onDoubleClick={()=>{
			this.setState({specCode: text})
			this.refs.modal.open()
		}}>{text}</span>  },
		{ title: '自然项目', 		field: 'parent_kind_name',  width:170 },
		{ title: '项目名称', 		field: 'kind_name', 	width:170 },
		{ title: '标准价格', 		field: 'sprice', 		width:100 },
		{ title: '实际价格', 		field: 'price', 		width:100 },
		{ title: '姓名', 		    field: 'patient_name',  width:80 },
		{ title: '性别', 	        field: 'sex_name',      width:80 },
		{ title: '年龄',            field: 'age',           width:80 },
		{ title: '送检科室', 		field: 'department_name',width:100 },
		{ title: '医生',		    field: 'doctor', 	    width:100 },
		{ title: '备注', 			field: 'remark', 		width:100 },
		{ title: '账单属性',		field: 'attribute_name',width:100 },
		{ title: '实验科室',		 field: 'project_parent_name', width:100 },
		{ title: '开票单位（NC）',	 field: 'organization_name',   width:100 },
		{ title: '开票单位编码（NC）',field: 'organization_code',   width:160 },
		{ title: '业务员',		    field: 'salesman_user',	width:100 },
		{ title: '业务员编码',		field: 'salesman_code',	width:100 },
		{ title: '区域',		    field: 'region_name',	width:100 },
		{ title: '区域编码',		field: 'region_num',		 width:100 },
	]
	ButtonGroup = () => {
		return [
			{ label:'明细导出F1', code:'F1', onClick:()=>{
				confirm.then(f=>{
					f.default({
						msg:'是否导出明细?',
						onOk: close => {
							let list = {
								export: 1,
								start_at: this.model.start_at,
								end_at: this.model.end_at
							}
							$http.submit(null,'bill-st/detailindex', { param: list } ).then(data=>{
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
		const { data, pullLoading, pag, specCode } = this.state
		return (
			<Page title='收入成本明细' ButtonGroup={this.ButtonGroup()}>
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
					init    	= { form => { form.setFieldsValue({date:[Time.customDate(2, "date"), Time.customDate("current-date")]}) }}
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
				<Modal ref='modal' title='账单信息' width={1000} noFooter>
					<BillInfo className='fv rel ex xplr' specCode = { specCode || '' } />
				</Modal>
			</Page>
		)
	}
}