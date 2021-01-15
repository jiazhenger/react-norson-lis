import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
import coms from '@/private/js/common.js'
// ===================================================================== global declare
const { $fn, $async } = window
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))

const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
const AddCompany = $async(()=>import('./tp/add-company'))
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		type: '',
		rows: {},
		submit: [
            { label: '开始时间',        name: 'start_at',    type:'date-time', after:true,   full: true, width: '100%',  required: true},
			{ label: '结束时间',    name: 'end_at',        type:'date-time', after:true,   full: true, width: '100%',  required: true},
        ],
	}
	forms = [
		{ label:'单位名称',		name:'company_name' },
		{ label:'单位编码',		name:'company_code' },
		{ label:'单位简称',		name:'company_short_name' },
		{ label:'主检实验室',	name:'company_laboratory' },
	]
	model = {start_at: coms.sysTime(1, '9'), end_at: coms.sysTime(2, '9')}
	componentDidMount(){
		this.props.onRef(this)
		this.fetchFn()
	}
	fetchFn() {
		this.fetch(this.model)
		this.setState({selectedKeys: []})
	}
	selectedUuids() {
		return this.state.selectedKeys.map(i=>i.uuid)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'lis-outsourcing-company/index', param)
	// table
	cols = [
		{ type:'checkbox' },
		{ title: '单位名称', 	field: 'company_name',   	    width:145 },
		{ title: '单位编码', 	field: 'company_code', 		    width:150 },
		{ title: '单位简称', 	field: 'company_short_name', 	width:130 },
		{ title: '联系人',  	field: 'company_employee', 		width:100 },
		{ title: '联系电话', 	field: 'company_mobile', 		width:120 },
		{ title: '地址',    	field: 'company_address', 		width:300 },
		{ title: '主检实验室', 	field: 'company_laboratory', 	width:150 },
		{ title: '导出模板', 	field: 'model_name', 		    width:150 },
		{ title: '操作', align:'tc', width:150, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='编辑' ghost onClick={()=>{
						this.refs.modal.open()
						this.setState({ type: 'edit', rows: rows })
					}}/>
					<Button label='导出' ghost className='mlr5' onClick={()=>{
						this.refs.modal1.open()
						this.rows = rows
					}} />
				</div>
			)
		}},
	]
	render(){
		const { data, pullLoading, pag, rows, type, submit } = this.state
		return (
			<>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onAdd		= { this.onAdd } 
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
				/>
				{/* 外包单位管理编辑 */}
				<Modal ref='modal' title='编辑' width={648} noFooter>
					<AddCompany
						type	= { type }
						rows	= { rows }
						onClose	= { ()=>this.refs.modal.close() }
						fetch	= { ()=>{this.fetchFn()} }
					/>
                </Modal>
				<Modal ref='modal1' title='导出外包单位数据' width={500} noFooter>
					<SubmitForm
						modal
						data = { submit }
						onSubmit = { v => {
							const param = { ...v, uuid: this.rows.uuid}
							console.log(param)
							coms.exportExcel({
								api: 'lis-outsourcing-company/exportData',
								apiType: 'submit',
								param: {param},
								cb: () => {
									message.then(f => f.default.success('导出成功'))
									this.refs.modal1.close()
									this.fetch(this.model)
								}
							})
						}}
						onClose = { ()=>this.refs.modal1.close() }
						init	= { form => form.setFieldsValue({start_at: this.model.start_at, end_at: this.model.end_at}) }
					/>
                </Modal>
			</>
		)
	}
}