// ===================================================================== 薛玉梅 | 2020-10-19 | 新增文件
import React from 'react'
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window 
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
// ===================================================================== private component
const Table = $async(()=>import('#cpt/table'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const message = import('@antd/message')
// ===================================================================== component
const BillDetailsTable = $async(()=>import('./bill-details-table'))
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		// selectedKeys:[], 
		rowId: '',
		submit: [
			{ label: '作废原因',	name: 'remark',	type: 'textarea', width: 400 },
		]
	}
	
	forms = []
	model = {}
	statusList = []
	options = [
		{ label: "正常", value: "1" },
		{ label: "冲抵", value: "2" }
	]
	async getDataAsync() {
		await $fn.getDisItem({
			code: 45300,
			callback: (data) => {
				this.statusList = data
			}
		}) // 账单状态
	}
	componentDidMount(){ 
		this.getDataAsync()
	}
	componentWillReceiveProps(props) {
		if (props.rowdata.length > 0) { 
			var len = props.rowdata.length-1
            this.model.hosp_id = props.rowdata[len].hosp_id
			this.model.bill_phase_id = props.rowdata[len].bill_phase_id
			this.model.status = props.rowdata[len].status
            this.model.summary_sn = props.model.summary_sn
			this.fetch(this.model)
		}
	}

	fetch = param => $http.paging(this,'bill/speclists',{ param:{...param, pageSize:this.pageSize, ...this.model}, loading:false } )

	cols = [
		{ title: '账单编号', 	field: 'order_sn',      width:120 },
		{ title: '账期', 		field: 'phase_str', 	width:120 },
		{ title: '账单类型', 	field: 'pay_type', 		width:80, 
			render: ({rows}) => {
				return window.$fn.filterSelect(this.options, rows.pay_type, 'label', 'value') 
			}  },
		{ title: '自然项目', 	field: 'parent_kind_name',	width:120 },
        { title: '医院名称', 	field: 'hosp_name', 	width:120 },
        { title: '项目名称', 	field: 'kind_name', 	width:120 },
		{ title: '标准价格', 	field: 'sprice', 	    width:80 },
        { title: '折扣率', 		field: 'percent', 		width:80 },
		{ title: '实际价格', 	field: 'price', 	    width:80 },
		{ title: '创建时间',    field: 'created_at', 	width:120 },
		{ title: '账单状态', 	field: 'status', 	    width:80, 
            render: ({rows}) => {
                return window.$fn.filterSelect(this.statusList, rows.status, 'name', 'value') 
            } },
        { title: '业务员',      field: 'salesman_user', width: 100 },
        { title: '业务员状态',  field: 'status_salesman_name', width: 100 },
		{ title: '备注', 		field: 'remark', 	    width:120 },
		{ title: '操作', 		field: 'custom', 	    width:180, render:({rows})=>{
			return (
				<div className='plr5'>
                    <Button label='作废' ghost className='ml15' onClick={() => {
						this.refs.modal.open()
						const { submit } = this.state
						this.setState({rowId:rows.uuid})
						submit[0].value = ''
						this.setState({submit})
					}} />
					<Button label='操作详情' ghost className='ml15' onClick={() => {
						this.refs.modal1.open()
						this.setState({rowId:rows.uuid})
                    }} />
				</div>
			)
		} }
	] 
	render(){
		const { data, pullLoading, pag, submit, rowId } = this.state
		return (
			<div>
				<Modal ref='modal' title='作废' width={648} noFooter>
					<SubmitForm
						modal
                        data = { submit }
                        onChange    = {(v, press, { name, data }) => {} } 
						onSubmit = { v => {
							console.log(v)
							// const param = { ...v,uuid: rowId }
                            $http.submit(null, 'bill/del', { param: { uuid: rowId,...v} }).then(data => {
                                message.then(f => f.default.success('成功'))
                                this.refs.modal.close()
                                this.fetch(this.model)
                            })
						}}
                        onClose = { ()=>this.refs.modal.close() }
                        init    = { form => this.formSubmit = form }
					 />
				</Modal>
				<Modal ref='modal1' title='操作详情' width={900} noFooter>
					<BillDetailsTable className='fv rel ex xplr' bill_id = { rowId } />
				</Modal>
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					// onRow			= { v => { this.setState({ selectedKeys: v }) } }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
				/>
			</div>
		)
	}
}