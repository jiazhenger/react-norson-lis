// ===================================================================== 薛玉梅 | 2020-10-19 | 新增文件
import React from 'react'
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window 
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const message = import('@antd/message')
// ===================================================================== private component
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
const BillInfo = $async(()=>import('../finance-list/bill-info'))

export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		rowId: '',
		selectedKeys:[], 
		specCode: '',
	}
	forms = []
	model = {}
	componentDidMount(){}
	componentWillReceiveProps(props) {
		if (props.rowdata.hosp_id) {
            this.model.hosp_id 			 = props.rowdata.hosp_id || ""
			this.model.spec_code 		 = props.rowdata.old_spec_code || ""
			this.model.project_parent_id = props.rowdata.project_parent_id || ""
			this.model.salesman_id		 = props.rowdata.salesman_id || ""
			this.model.status			 = props.model.status
			this.model.start_at			 = props.model.start_at
			this.model.end_at			 = props.model.end_at
			this.model.region_id		 = props.model.region_id || ""
			this.fetch(this.model)
		}
	}

	fetch = param => $http.paging(this,'bill-st/detailindex',{ param:{...param, pageSize:this.pageSize, ...this.model}, loading:false } )

	cols = [
		{ title: '岗位',	    field: 'project_name',      width:100 },
		{ title: '接收时间',    field: 'check_time',        width:160 },
		{ title: '客户名称',	field: 'hosp_name',         width:100 },
        { title: '条码号',		field: 'old_spec_code',     width:100,render: ({text,rows})=> <span onDoubleClick={()=>{
			this.setState({specCode: text})
			this.refs.modal.open()
		}}>{text}</span> 
		},
        { title: '自然项目',    field: 'parent_kind_name',  width: 160 },
        { title: '项目名称',    field: 'kind_name',         width: 160 },
        { title: '标准价格',	field: 'sprice',        	width:100 },
        { title: '实际价格',	field: 'price',         	width:100 },
		{ title: '姓名', 		field: 'patient_name',      width:80 },
		{ title: '性别', 	    field: 'sex_name',          width:80 },
		{ title: '年龄',        field: 'age',               width:80 },
		{ title: '送检科室',    field: 'department_name',    width:80 },
		{ title: '医生', 	    field: 'doctor',             width:80 },
		{ title: '备注', 	    field: 'remark',             width:80 },
		{ title: '账单属性', 	field: 'attribute_name',     width:100 },
		{ title: '实验科室', 	field: 'project_parent_name',width:100 },
		{ title: '开票单位',	field: 'organization_name',  width:160 },
		{ title: '开票单位编码',field: 'organization_code',   width:170 },
		{ title: '业务员',	    field: 'salesman_user',      width:100 },
		{ title: '业务员编码',	field: 'salesman_code',      width:100 },
		{ title: '区域',	    field: 'region_name',        width:100 },
		{ title: '区域编码',	field: 'region_num',          width:100 },
	] 
	render(){
		const { data, pullLoading, pag, specCode } = this.state
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