import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
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
const ViewModel = $async(() => import('./tp/dialog-view-drug'))
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		submit: [
			{ label: '组合名称',	name: 'group_name',		    required: true},
			{ label: '组合编号',	name: 'group_num',			disabled: true},
			{ label: '排序',        name: 'sort' },
			{ label: '描述',		name: 'description',		full: true,         width: '100%',  type: 'textarea'},
		],
		uuid: '',
		type: ''

	}
	forms = [
		{ label:'组合名称',			name:'group_name'},
		{ label:'药敏组合编号',     name:'group_num'},
	]
	model = {}
	componentDidMount(){
        this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'drug-group/index', param)
	// table
	cols = [
		{ type:'checkbox' },
		{ title: '排序',			field: 'sort' },
		{ title: '组合名称',		field: 'group_name'},
		{ title: '药敏组合编号', 	field: 'group_num'},
		{ title: '操作', align:'tc', render:({rows})=>{
			return (
				<div className='plr5'>
					<Button className='mr10' label='编辑' ghost onClick={e=>{
						this.refs.modal.open()
						const { submit } = this.state
						$http.submit(null,'drug-group/info',{ param:{uuid: rows.uuid} }).then(data=>{
							this.rows = data
                            this.isEdit = true
                            $fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
                        })
					}}  />
					<Button className='mr10' label='查看' ghost onClick={e=>{
						this.refs.modal1.open()
						this.setState({uuid: rows.uuid, type: 1})
					}}  />
					<Button label='添加药敏' ghost onClick={e=>{
						this.refs.modal1.open()
						this.setState({uuid: rows.uuid, type: 2})
					}}  />
				</div>
			)
		}},
	]
	ButtonGroup = () => {
		return [
			{ label:'添加 F2', code:'F2', onClick:()=>{
				this.refs.modal.open()
				const { submit } = this.state
				submit.map(item => {
                    item.value = ''
				})
				submit[2].value = `${this.state.data.length + 1}`
				this.isEdit = false
				this.setState({ submit })
			} },
			{ label:'删除', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				const param = {uuid: this.state.selectedKeys.map(v=>v.uuid)} 
				coms.interfaceConfirm('drug-group/del', '删除', param, () => {
					this.fetch(this.model)
					this.setState({selectedKeys: []})
				})
			} },
		]
	}
	render(){
		const { data, pullLoading, pag, submit, uuid, type } = this.state
		return (
			<Page title='药敏组合' ButtonGroup={this.ButtonGroup()}>
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
				<Modal ref='modal' title={this.isEdit ? '编辑' : '添加'} width={648} noFooter>
					<SubmitForm
						modal
						data = { submit }
						onSubmit = { v => {
							if (this.isEdit) {
								const param = { ...v, uuid: this.rows.uuid}
								$http.submit(null,'drug-group/edit',{ param }).then(data=>{
									message.then(f=>f.default.success('编辑成功'))
									this.refs.modal.close()
									this.fetch(this.model)
								})
							} else {
								const param = { ...v }
								$http.submit(null, 'drug-group/add', { param }).then(data => {
									message.then(f => f.default.success('添加成功'))
									this.refs.modal.close()
									this.fetch(this.model)
								})
							}
							
						}}
                        onClose = { ()=>this.refs.modal.close() }
                        init    = { form => this.form = form }
					/>
				</Modal>
				<Modal ref = 'modal1' title	= {type === 1 ? '查看药敏' : '添加药敏'} width = {648} noFooter >
					<ViewModel
						uuid = { uuid }
						type = { type }
						onClose = { ()=>this.refs.modal1.close() }
					/>
				</Modal>
			</Page>
		)
	}
}