import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
const confirm = import('@antd/confirm')
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
		deviceStadius:[],
		submit: [
			{ label: '权限名称',	name: 'perm_name',      required: true},
			{ label: '英文名称',	name: 'perm_name_en'},
			{ label: '权限代码',	name: 'perm_code',      required: true},
			{ label: '排序',		name: 'sort'},
			{ label: '权限级别',	name: 'level',          required: true,		type: 'select',	data: [] },
			{ label: '权限类型',	name: 'perm_type',      required: true,		type: 'select',	data: [] },
			{ label: '权限描述',	name: 'perm_desc',		type: 'textarea',   full: true,     width: '100%' },
		],
	}
	forms = [
		{ label:'权限名称', name:'perm_name'},
		{ label:'权限代码', name:'perm_code'},
		{ label:'权限类型', name:'perm_type',   type:'select', data:[]},
		{ label:'权限级别', name:'level',       type:'select', data:[]},
	]
	model = {}
	componentDidMount(){
        const { submit } = this.state
        // 权限类型
		$fn.getDisItem({
            code: 900,
            callback: data=>{
                this.forms[2].data = data
                submit[5].data = data
            }
        })
        // 权限级别
		$fn.getDisItem({
            code: 800,
            callback: data=>{
                this.forms[3].data = data
                submit[4].data = data
            }
        })
        this.fetch()
	}
	// paging
	fetch = param => $fn.fetch.call(this,'permission/index', param)
	// table
	cols = [
		{ type:'checkbox' },
		{ title: 'ID',          field: 'id',            width: 90 },
		{ title: '权限名称',    field: 'perm_name',     width: 300},
		{ title: '权限代码',    field: 'perm_code',     width: 200},
		{ title: '权限类型',    field: 'type',          width: 80},
		{ title: '权限级别',    field: 'level',         width: 120},
		{ title: '权限描述',    field: 'perm_desc',     width: 300},
		{ title: '创建时间',    field: 'created_at',    width: 160, align:'tc' },
		{ title: '操作',        align:'tc',             width: 100, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='编辑' ghost onClick={e=>{
						this.refs.modal.open()
						const { submit } = this.state
                        $http.submit(null,'permission/info',{ param:{uuid: rows.uuid} }).then(data=>{
                            this.rows = data
                            this.isEdit = true
                            $fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
                        })
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
                    if (item.name === 'sort') {
                        item.value = '0'
                    }
                })
				this.isEdit = false
				this.setState({ submit })
			} },
			{ label:'删除', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				confirm.then(f=>{
					f.default({
						msg:'是否确认删除?',
						onOk: close => {
							const keys = this.state.selectedKeys.map(v=>v.uuid)
							$http.submit(null,'permission/delete',{ param:{uuid: keys} }).then(data=>{
								message.then(f=>f.default.success('删除成功'))
								this.fetch(this.model)
								this.setState({selectedKeys: []})
								close()
							})
						}
					})
				})
			} },
		]
	}
	render(){
		const { data, pullLoading, pag, submit } = this.state
		return (
			<Page title='权限库' ButtonGroup={this.ButtonGroup()}>
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
								$http.submit(null,'permission/edit',{ param }).then(data=>{
									message.then(f=>f.default.success('编辑成功'))
									this.refs.modal.close()
									this.fetch(this.model)
								})
							} else {
								const param = { ...v }
								$http.submit(null, 'permission/add', { param }).then(data => {
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
			</Page>
		)
	}
}