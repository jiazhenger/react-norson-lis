// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
import { ExclamationCircleTwoTone } from '@ant-design/icons';
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
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
			{ label:'用户名',		name:'account',		type: 'input',		required:true },
			{ label:'密码', 		name:'password',	type: 'password', 	required:true }
		]
	}
	spec_statusSelect = [
		{ name: "待分发", value: 0 },
		{ name: "不可分发", value: -1 },
		{ name: "已分发", value: 1 }
	  ]
	forms = [  
		{ label:'条码号',		name:'spec_code',		type:'input' },  
		{ label:'标本性状',		name:'spec_traits',		type:'select', 		data: [], nameStr:'name', idStr:'value' },
		{ label:'岗位查询',		name:'project_id',		type:'select',		data: [], nameStr:'name', idStr:'value' }, 
		{ label:'接收时间',		name:'date',			type:'date-range', 	names:['start_date', 'end_date'] },
		{ label:'医院',			name:'hosp_id',			type:'select', 		data: [], nameStr:'name', idStr:'value' }, 
	]
	model = {}
	componentDidMount(){
		// 医院 
		$fn.dataSave('bs-hospital-select-data').then(local => {
			if($fn.hasArray(local)){
			  this.forms[4].data = local
			}else{
			  $http.pull(null,'bs-hospital/select', {dataName:null}).then(data=>{
				this.forms[4].data = data.items
				$fn.dataSave('bs-hospital-select-data', data.items)
			  })
			}
		})
		// 岗位 
		$fn.dataSave('project-team-laboratoryselect-data').then(local => {
			if($fn.hasArray(local)){
			  this.forms[2].data = local
			}else{
			  $http.pull(null,'project-team/laboratoryselect', {dataName:null}).then(data=>{
				this.forms[2].data = data
				$fn.dataSave('project-team-laboratoryselect-data', data)
			  })
			}
		})
		// 标本性状 
		$fn.dataSave('dis-item-21000-data').then(local => {
			if($fn.hasArray(local)){
			  this.forms[1].data = local
			}else{
			  $http.pull(this,'dis-item/item', { param: {dis_code: 21000}}).then(data=>{
				this.forms[1].data = data
				$fn.dataSave('dis-item-21000-data', data)
			  })
			}
		})
		this.fetch()
	}
	// paging
	fetch = param => $fn.fetch.call(this,'specimen/index', param)
	cols = [
		{ type:'checkbox' },
		{ title: '条码号',		field: 'spec_code',			width:120 },  
		{ title: '标本性状',	field: 'spec_traits_name',	width:120 },  
		{ title: '岗位组',		field: 'project_name',		width:120 },  
		{ title: '项目代码',	field: 'kind_code',			width:120 },  
		{ title: '状态',		field: 'spec_status', 		width:150, render:({rows})=>{ 
			return window.$fn.filterSelect(this.spec_statusSelect, rows.spec_status, 'name', 'value') 
		}},    
		{ title: '接收时间',	field: 'receive_time',		width:120 },  
		{ title: '医院',		field: 'hosp_name',			width:120 }
	]
	ButtonGroup = () => {
		return [
			{ label:'条码作废 F2', code:'F2', disabled:this.state.selectedKeys.length===0, onClick:()=>{
				this.refs.modal.open()
				const { submit } = this.state
				submit[0].value = ''
				submit[1].value = ''  
				this.setState({ submit })
			}}
		]
	}
	render(){
		const { data, pullLoading, pag, submit, selectedKeys } = this.state
		return (
			<Page title='待分发' ButtonGroup={this.ButtonGroup()}>
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
				<Modal ref='modal' title='条码作废' width={648} noFooter>
					<div className="f12 pb20 tc"><ExclamationCircleTwoTone twoToneColor="#ff4d4f" className="mr5" />请输入用户名与密码进行作废确认</div>
					<SubmitForm
						modal
						data = { submit }
						onSubmit = { v => {
							let param = { ...v, spec_code: selectedKeys.map(v=>v.spec_code) }
							let api ='specimen/invalid' 
							let info = '条码作废'    
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