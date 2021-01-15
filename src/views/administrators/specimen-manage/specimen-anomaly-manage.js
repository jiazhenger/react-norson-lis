// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		submit: [
			{ label: '描述', name:'explanation', type: 'textarea', full:true, width:'100%'}
		]
	}
	statusSelect = [
		{ name: "待处理", value: "0" },
        { name: "已处理", value: "1" },
        { name: "已完成", value: "2" }
	]
	forms = [
		{ label:'标本条码',		name:'spec_code',		type:'input' },
		{ label:'项目代码',		name:'kind_code',		type:'input' }, 
		{ label:'状态',			name:'status',			type:'select', data: this.statusSelect, nameStr:'name', idStr:'value' }
	]
	model = {}
	componentDidMount(){
		this.fetch()
	}
	// paging
	fetch = param => $fn.fetch.call(this,'sp-abnormal-spec/index', param)
	cols = [ 
		{ title: '标本条码',		field: 'spec_code',			width:130 },
		{ title: '项目名称',		field: 'kind_name',			width:220 },
		{ title: '项目代码',		field: 'kind_code',			width:100 },
		{ title: '医院名称',		field: 'hosp_name',			width:260 },
		{ title: '病人姓名',		field: 'patient_name',		width:100 },
		{ title: '性别',			field: 'sex_name',			width:80 },
		{ title: '年龄',			field: 'age',				width:100 },
		{ title: '发起人',			field: 'create_user',		width:100 },
		{ title: '状态',			field: 'status',			width:100, render: ({rows}) => {
			return window.$fn.filterSelect(this.statusSelect, rows.status, 'name', 'value') 
		}},
		{ title: '异常时间',		field: 'abnormal_time',		width:160 },
		{ title: '异常原因',		field: 'reason',			width:240 },
		{ title: '异常说明',		field: 'explanation',		width:100 },
		{ title: '操作', 			align:'tc', 				width:100, render:({rows})=>{
			return (
				<div className='plr5'>
					{rows.status === "0" ? <Button label='审核' ghost onClick={e => {
						this.refs.modal.open() 
						this.rows = rows 
					}}/> : 
					rows.status === "1" ? <Button label='编辑' ghost onClick={e => {
						this.refs.modal.open() 
						this.rows = rows 
					}}/> : ''}
				</div>
			)
		}}
	]
	ButtonGroup = () => {
		return []
	}
	render(){
		const { data, pullLoading, pag, submit } = this.state
		return (
			<Page title='标本异常管理' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
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
				/>  
				<Modal ref='modal' title='编辑' width={648} noFooter>
					<SubmitForm
						modal
						data = { submit }
						onSubmit = { v => {
							const param = { ...v, uuid: this.rows.uuid}
							const api = this.rows.status === "0" ? 'sp-abnormal-spec/audit' : this.rows.status === "1" ? 'sp-abnormal-spec/complete' : ''
							$http.submit(null,api,{ param }).then(data=>{
								message.then(f=>f.default.success('编辑成功'))
								this.refs.modal.close()
								this.fetch(this.model)
							})
						}}
						onClose = { ()=>this.refs.modal.close() }
					 />
				</Modal>
			</Page>
		)
	}
}