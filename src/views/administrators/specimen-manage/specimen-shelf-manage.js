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
			{ label:'容器名称',			name:'sf_name',			required:true },
			{ label:'拼音简称', 		name:'pinyin_short' }, 
			{ label:'容器类型', 		name:'shelf_type',		type: 'select', data: [], required:true },
			{ label:'所属分拣组', 		name:'pick_id',			type: 'select', data: [], required:true, nameStr:'gp_name', idStr:'uuid' }, 
			{ label:'容量', 			name:'total_capacity',	required:true },
			{ label:'备注', 			name:'remark',			type: 'textarea', full:true, width:'100%' }
		]
	}
	
	forms = [ 
		{ label:'状态',			name:'enabled',			type:'select', data: [], nameStr:'name', idStr:'value' },
		{ label:'标本架名称',	name:'sf_name',			type:'input' },  
		{ label:'所属分拣组',	name:'gp_name',			type:'input' },  
		{ label:'科室',			name:'project_name',	type:'input' },  
	]
	model = {}
	componentDidMount(){ 
		$fn.dataSave('dis-item-46100-data').then(local => {
			if($fn.hasArray(local)){
			  this.forms[0].data = local
			}else{
			  $http.submit(this,'dis-item/item', { param: {dis_code: 46100}}).then(data=>{
				this.forms[0].data = data
				$fn.dataSave('dis-item-46100-data', data)
			  })
			}
		})
		$fn.dataSave('dis-item-20-data').then(local => {
			if($fn.hasArray(local)){ 
			  const { submit } = this.state
			  submit[2].data = local
			  this.setState({submit})
			}else{
			  $http.submit(this,'dis-item/item', { param: {dis_code: 20}}).then(data=>{
				const { submit } = this.state
			  	submit[2].data = data
			  	this.setState({submit})
				$fn.dataSave('dis-item-20-data', data)
			})
			}
		})

		$fn.dataSave('pick-group-select-data').then(local => {
			if($fn.hasArray(local)){
				const { submit } = this.state
			  	submit[3].data = local
			  	this.setState({submit})
			}else{
			  $http.pull(null,'pick-group/select', {dataName:null}).then(data=>{ 
				const { submit } = this.state
				submit[3].data = data.items
				this.setState({submit})
				$fn.dataSave('pick-group-select-data', data.items)
			  })
			}
		}) 
		this.fetch()
	}
	// paging
	fetch = param => $fn.fetch.call(this,'shelf/index', param)
	cols = [
		{ type:'checkbox' },
		{ title: '标本架编号',		field: 'sf_number',			width:120 },  
		{ title: '标本架名称',		field: 'sf_name',			width:120 },  
		{ title: '标本架代码',		field: 'sf_code',			width:120 },  
		{ title: '容器类型',		field: 'shelf_type_name',	width:120 },  
		{ title: '所属分拣组',		field: 'gp_name',			width:120 },  
		{ title: '容量',			field: 'total_capacity',	width:120 },  
		{ title: '科室',			field: 'project_name',		width:120 },  
		{ title: '备注',			field: 'remark',			width:120 },  
		{ title: '状态',			field: 'enabled_name',		width:120 },  
		{ title: '操作', align:'tc', width:100, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='编辑' ghost onClick={()=>{
						this.refs.modal.open()
						const { submit } = this.state
						this.rows = rows
						this.isEdit = true
						$http.submit(this, 'shelf/info', { param: {uuid: rows.uuid}} ).then(data => {
							submit[0].value = data['sf_name']
							submit[1].value = data['pinyin_short']
							submit[2].value = data['shelf_type'] 
							submit[3].value = data['pick_id'] 
							submit[4].value = data['total_capacity'] 
							submit[5].value = data['remark'] 
							this.setState({submit})
						}) 
					}}/>
				</div>
			)
		}},
	]
	ButtonGroup = () => {
		return [
			{ label:'新增 F2', code:'F2', onClick:()=>{
				this.refs.modal.open()
				const { submit } = this.state
				submit[0].value = ''
				submit[1].value = ''
				submit[2].value = ''
				submit[3].value = ''
				submit[4].value = ''
				submit[5].value = ''
				this.isEdit = false
				this.setState({ submit })
			}},
			{ label:'启用', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				const param = {uuid: this.state.selectedKeys.map(v=>v.uuid)} 
				coms.interfaceConfirm('shelf/on', '启用', param, () => { this.fetch(this.model) })
			}},
			{ label:'禁用', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				const param = {uuid: this.state.selectedKeys.map(v=>v.uuid)} 
				coms.interfaceConfirm('shelf/del', '禁用', param, () => { this.fetch(this.model) })
			}},
			{ label:'退回', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				const param = {uuid: this.state.selectedKeys.map(v=>v.uuid)} 
				coms.interfaceConfirm('shelf/off', '退回', param, () => { this.fetch(this.model) })
			}},
			{ label:'领用', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				const param = {shelf_id: this.state.selectedKeys.map(v=>v.uuid)} 
				coms.interfaceConfirm('shelf/use', '领用', param, () => { this.fetch(this.model) })
			}},
			{ label:'批量打印', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				// const param = {uuid: this.state.selectedKeys.map(v=>v.uuid)} 
				// coms.interfaceConfirm('pick-group/del', '删除', param, () => { this.fetch(this.model) })
			}}
		]
	}
	render(){
		const { data, pullLoading, pag, submit } = this.state
		return (
			<Page title='标本架管理' ButtonGroup={this.ButtonGroup()}>
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
							let api ='shelf/add' 
							let info = '添加'  
							if (this.isEdit) {
								param = { ...v, uuid: this.rows.uuid}
								api = 'shelf/edit' 
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