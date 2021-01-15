import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== global template
// ===================================================================== private template
// ===================================================================== template
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== btns
// ===================================================================== component
const BillInfo = $async(()=>import('../finance-list/bill-info'))

export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[], 
		specCode: '',
	}
	model = {}
	componentDidMount(){}
	componentWillReceiveProps(props) {
		console.log(props)
		if (props.rowdata.hosp_id) {
            this.model.hosp_id 			= props.rowdata.hosp_id
			this.model.parent_kind_id 	= props.rowdata.parent_kind_id
			this.model.region_id 		= props.rowdata.region_id
            this.model.salesman_id 		= props.rowdata.salesman_id
            this.model.status 			= props.model.status
            this.model.start_at 		= props.model.start_at
            this.model.end_at 			= props.model.end_at
			this.fetch(this.model)
		}
	}
	fetch = param => $http.paging(this,'bill-st/detailindex',{ param:{...param, pageSize:this.pageSize, ...this.model}, loading:false } )
	
	cols = [
		{ title: '岗位',			field: 'project_name', 		width:150 },
		{ title: '接收时间',		field: 'check_time', 		width:145 },
		{ title: '客户名称',		field: 'hosp_name', 		width:130 },
		{ title: '条码号',		    field: 'old_spec_code', 	width:100, render: ({text,rows})=> <span onDoubleClick={()=>{
			this.setState({specCode: text})
			this.refs.modal.open()
		}}>{text}</span> },
		{ title: '自然项目',		field: 'parent_kind_name', 	width:100 },
		{ title: '项目名称', 		field: 'kind_name', 		width:130 },
		{ title: '标准价格', 		field: 'sprice', 			width:80 },
		{ title: '实际价格', 		field: 'price', 			width:80 },
		{ title: '姓名', 		    field: 'patient_name', 		width:80 },
		{ title: '性别', 		    field: 'sex_name', 		    width:80 },
		{ title: '年龄', 	        field: 'age', 	            width:80 },
		{ title: '送检科室',        field: 'department_name', 	width:100 },
		{ title: '医生', 			field: 'doctor', 			width:100 },
		{ title: '备注',		    field: 'remark', 			width:100 },
		{ title: '账单属性', 		field: 'attribute_name', 	width:100 },
		{ title: '实验科室', 		field: 'project_parent_name',width:100 },
		{ title: '开票单位(NC)', 	field: 'organization_name', width:100 },
		{ title: '开票单位编码(NC)',field: 'organization_code', width:130 },
		{ title: '业务员', 			field: 'salesman_user', 	width:100 },
		{ title: '业务原编码',		field: 'salesman_code', 	width:100 },
		{ title: '区域', 			field: 'region_name', 		width:100 },
		{ title: '区域编码',		field: 'region_num',		width:100 },
	]
	render(){
		const { data, pullLoading, pag, specCode } = this.state
		console.log(data)
		return (
			<div>
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { v => { this.setState({ selectedKeys: v }) } }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
				/>  
				<Modal ref='modal' title='账单信息' width={1000} noFooter>
					<BillInfo className='fv rel ex xplr' specCode = { specCode || '' } />
				</Modal>
			</div>
		)
	}
}