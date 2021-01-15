// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
// ===================================================================== common
import coms from '@/private/js/common.js'
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
			{ label:'办事处名称',		name:'contact_name',		type: 'input',		required:true },
			{ label:'联系电话', 		name:'contact_phone',		type: 'input' },
			{ label:'位置选择', 		name:'areaData',			type: 'select', data: [], nameStr:'name', idStr:'uuid' }, // 省市区联动
			{ label:'具体位置', 		name:'street',				type: 'input' },
		]
	} 
	isEdit = false
	forms = [ 
		{ label:'办事处名称',		name:'contact_name',	type:'input' },  
		{ label:'联系电话',			name:'contact_phone',	type:'input' },  
		{ label:'创建时间',			name:'date',			type:'date-range', names:['created_at_start_date', 'created_at_end_date'] } 
	]
	model = {}
	componentDidMount(){ 
		this.fetch(this.model)
	} 
	fetch = param => $fn.fetch.call(this,'sp-box-address/index', param) 
	cols = [ 
		{ type: 'checkbox' },
		{ title: '省', 		field: 'province', 		width:100 },
		{ title: '市', 		field: 'city', 			width:100 },
		{ title: '区', 		field: 'area', 			width:100 },
		{ title: '街道', 		field: 'street', 			width:120 },
		{ title: '办事处名称', 		field: 'contact_name', 			width:120 },
		{ title: '联系电话', 		field: 'contact_phone', 			width:100 },
		{ title: '状态', 		field: 'enabled', 			width:80, render: ({rows}) => {
			const options =[
				{ label: "启用", value: "1" },
				{ label: "禁用", value: "0" }
			]
			return $fn.filterSelect(options, rows.enabled, 'label', 'value')
		} },
		{ title: '创建时间', 		field: 'created_at', 			width:150 },
		{ title: '操作', 		align:'tc', 				width:90, render:({rows})=>{
			return (
				<div className='plr5 fx'>
					<Button label='编辑' ghost className='mlr5' onClick={()=>{
						this.refs.modal.open()
						const { submit } = this.state
						this.rows = rows
						this.isEdit = true
						$http.submit(null, 'sp-box-address/info', { param: {uuid: rows.uuid}} ).then(data => {
							submit[0].value = data['contact_name']
							submit[1].value = data['contact_phone']
							submit[2].value = data['areaData'] 
							submit[3].value = data['street']  
							this.setState({submit})
						})
					}}/> 
				</div>
			)
		}} 
	]
	ButtonGroup = () => {
		return [
			{ label:'添加 F2',	code:'F2',   onClick:()=>{
				this.refs.modal.open()
				const { submit } = this.state
				submit[0].value = ''
				submit[1].value = ''
				submit[2].value = ''
				submit[3].value = '' 
				this.isEdit = false
				this.setState({ submit })
			} }, 
			{ label:'删除',  	ghost:true, disabled: this.state.selectedKeys.length <= 0,  onClick:()=>{
				const param = {uuid: this.state.selectedKeys.map(i => i.uuid)}
 				coms.interfaceConfirm('sp-box-address/delete', '删除', param, () => { this.fetch(this.model) })
			} },
			{ label:'启用',  	ghost:true, disabled: this.state.selectedKeys.length <= 0,  onClick:()=>{ 
				const param = {uuid: this.state.selectedKeys.map(i => i.uuid)}
 				coms.interfaceConfirm('sp-box-address/on', '启用', param, () => { this.fetch(this.model) })
			} },
			{ label:'禁用',  	ghost:true, disabled: this.state.selectedKeys.length <= 0,  onClick:()=>{ 
				const param = {uuid: this.state.selectedKeys.map(i => i.uuid)}
 				coms.interfaceConfirm('sp-box-address/off', '禁用', param, () => { this.fetch(this.model) })
			} },
			{ label:'文件导入', ghost:true,  onClick:()=>{ } },
		]
	}
	render(){
		const { data, pullLoading, pag, submit } = this.state
		return (
			<Page title='物流办事处' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
					onAdd		= { ()=> $fn.push(this, $fn.getRoot().root + 'specimen-manage/processed-image/upload') }
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
				<Modal ref='modal' title={this.isEdit ? '编辑' : '添加'} width={648} noFooter>
					<SubmitForm
						modal
						data = { submit }
						onSubmit = { v => { 
							let param = { ...v}
							let api ='sp-box-address/add' 
							let info = '添加'  
							if (this.isEdit) {
								param = { ...v, uuid: this.rows.uuid}
								api = 'sp-box-address/edit' 
								info = '编辑'
							} 
							$http.submit(null, api, { param }).then(data=>{
								message.then(f=>f.default.success(`${info}成功`))
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