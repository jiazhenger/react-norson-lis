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
	gp_typeSelect = [
        { value: "1", name: "普通" },
        { value: "2", name: "高级" }
    ]
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		submit: [
			{ label:'分拣组名称',		name:'gp_name',		required:true },
			{ label:'拼音简称', 		name:'pinyin_short' },
			{ label:'类型', 			name:'gp_type',		type: 'select', data: this.gp_typeSelect, required:true },
			{ label:'科室', 			name:'job_id',		type: 'select', data: [], nameStr:'name', idStr:'uuid', required:true },
			{ label: '备注', 			name:'remark',		type: 'textarea', full:true, width:'100%' }
		]
	}
	enabledSelect = [
        { value: 1, name: "启用" },
        { value: 0, name: "待启用" },
        { value: -1, name: "禁用" }
	] 
	
	forms = [  
		{ label:'状态',			name:'gp_status',	type:'select', data: this.enabledSelect, nameStr:'name', idStr:'value' },
		{ label:'名称',			name:'name',		type:'input' },  
		{ label:'科室',			name:'job_id',		type:'select', data: [], nameStr:'name', idStr:'uuid' },
	]
	model = {}
	componentDidMount(){
		$fn.dataSave('project-team-select-data').then(local => {
			if($fn.hasArray(local)){
			    this.forms[2].data = local
			    const { submit } = this.state
				submit[3].data = local
				this.setState({submit})
			}else{
			  $http.pull(null,'project-team/select', {dataName:null}).then(data=>{ 
				this.forms[2].data = data
				const { submit } = this.state
				submit[3].data = data
				this.setState({submit})
				$fn.dataSave('project-team-select-data', data)
			  })
			}
		})
		this.fetch()
	}
	// paging
	fetch = param => $fn.fetch.call(this,'pick-group/index', param)
	cols = [
		{ type:'checkbox' },
		{ title: '分拣组代码',		field: 'gp_code',			width:120 },
		{ title: '分拣组名称',			field: 'gp_name',			width:120 },
		{ title: '科室',		field: 'job_name',			width:120 },
		{ title: '备注',			field: 'remark',			width:150 },
		{ title: '状态',		field: 'gp_status',		width:100 , render: ({rows}) => {
			return window.$fn.filterSelect(this.enabledSelect, rows.gp_status, 'name', 'value') 
		}},
		{ title: '操作', align:'tc', width:100, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='编辑' ghost onClick={e => {
						this.refs.modal.open()
						const { submit } = this.state
						this.rows = rows
						this.isEdit = true
						$http.submit(this, 'pick-group/info', { param: {uuid: rows.uuid}} ).then(data => {
							submit[0].value = data['gp_name']
							submit[1].value = data['pinyin_short']
							submit[2].value = data['gp_type'] 
							submit[3].value = data['job_id'] 
							submit[4].value = data['remark'] 
							this.setState({submit})
						}) 
					}}/> 
				</div>
			)
		}} 
	]
	ButtonGroup = () => {
		return [
			{ label:'添加 F2', code:'F2', onClick:()=>{
				this.refs.modal.open()
				const { submit } = this.state
				submit[0].value = ''
				submit[1].value = ''
				submit[2].value = ''
				submit[3].value = ''
				submit[4].value = ''
				this.isEdit = false
				this.setState({ submit })
			}},
			{ label:'启用', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				const param = {uuid: this.state.selectedKeys.map(v=>v.uuid)} 
				coms.interfaceConfirm('pick-group/on', '启用', param, () => { this.fetch(this.model) })
			}},
			{ label:'禁用', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				const param = {uuid: this.state.selectedKeys.map(v=>v.uuid)} 
				coms.interfaceConfirm('pick-group/off', '禁用', param, () => { this.fetch(this.model) })
			}},
			{ label:'删除', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				const param = {uuid: this.state.selectedKeys.map(v=>v.uuid)} 
				coms.interfaceConfirm('pick-group/del', '删除', param, () => { this.fetch(this.model) })
			}}
		]
	}
	render(){
		const { data, pullLoading, pag, submit } = this.state
		return (
			<Page title='分拣管理' ButtonGroup={this.ButtonGroup()}>
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
				<Modal ref='modal' title={this.isEdit ? '编辑' : '添加'} width={648} noFooter>
					<SubmitForm
						modal
						data = { submit }
						onSubmit = { v => {
							let param = { ...v}
							let api ='pick-group/add' 
							let info = '添加'  
							if (this.isEdit) {
								param = { ...v, uuid: this.rows.uuid}
								api = 'pick-group/edit' 
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