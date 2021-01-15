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
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== 页面常量
const menuTypeOption = [
    { name: '顶部菜单', value: '1' },
    { name: '左侧菜单', value: '2' }
]
// ===================================================================== component
const RelateForm = $async(()=>import('./tp/menu-relate'))
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		submit: [
			{ label: '菜单名称',	name: 'menu_name',      required: true},
			{ label: '英文名称',	name: 'menu_en',        required: true},
			{ label: '路径',	    name: 'access_route'},
			{ label: 'web路由',	    name: 'web_route'},
			{ label: '排序',		name: 'sort'},
			{ label: '上级菜单',	name: 'parent_id',      required: true,		type: 'select',	data: [], nameStr: 'menu_name', idStr: 'id' },
			{ label: '菜单类型',	name: 'menu_type',      required: true,		type: 'select',	data: [] },
			{ label: '图标',	    name: 'icon',           required: true,		type: 'select',	data: [] },
			{ label: '所属视图',	name: 'system_view',	type: 'select',     data: [] },
		],
		uuid: ''
	}
	forms = [
		{ label:'菜单名称',         name:'menu_name'},
		{ label:'英文名称',         name:'menu_en'},
        { label:'上级菜单',         name:'parent_id',       type:'select',      data:[],        nameStr: 'menu_name',   idStr: 'id'},
		{ label:'路径',             name:'access_route'},
	]
	model = {}
	componentDidMount(){
        const { submit } = this.state
        // 菜单类型
        submit[6].data = menuTypeOption
        // 所属视图
		$fn.getDisItem({
            code: 400,
            callback: data=>{
                submit[8].data = data
            }
        })
        cacheApi.then(f => {
            const d = f.default
            // 菜单列表
			$fn.getCache({
				cache: d.menuSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        submit[5].data = data
                        this.forms[2].data = data
                        this.setState({submit})
                    } else {
                        $http.submit(null, 'menu/select').then(data => {
                            submit[5].data = data
                            this.forms[2].data = data
                            this.setState({submit})
                            $fn.setCache()
                        })
                    }
				}
            })
		})
        this.fetch()
	}
	// paging
	fetch = param => $fn.fetch.call(this,'menu/index', param)
	// table
	cols = [
		{ type:'checkbox' },
		{ title: '菜单名称',    field: 'menu_name'},
		{ title: '英文名称',    field: 'menu_en'},
		{ title: '上级菜单',    field: 'parent_name'},
		{ title: '图标',        field: 'icon'},
		{ title: '排序',        field: 'sort'},
		{ title: '创建时间',    field: 'created_at', align:'tc' },
		{ title: '操作',        align:'tc',         render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='编辑' ghost onClick={e=>{
						this.refs.modal.open()
						const { submit } = this.state
                        $http.submit(null,'menu/info',{ param:{uuid: rows.uuid} }).then(data=>{
                            this.rows = data
                            this.isEdit = true
                            $fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
                        })
					}}  />
                    <Button className='ml10' label='权限关联' ghost onClick={e=>{
						this.setState({uuid: rows.uuid})
						this.refs.modal1.open()
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
							$http.submit(null,'menu/del',{ param:{uuid: keys} }).then(data=>{
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
		const { data, pullLoading, pag, submit, uuid } = this.state
		return (
			<Page title='菜单列表' ButtonGroup={this.ButtonGroup()}>
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
								$http.submit(null,'menu/edit',{ param }).then(data=>{
									message.then(f=>f.default.success('编辑成功'))
									this.refs.modal.close()
									this.fetch(this.model)
								})
							} else {
								const param = { ...v }
								$http.submit(null, 'menu/add', { param }).then(data => {
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
				<Modal ref='modal1' title='权限关联' width={960} noFooter>
					<RelateForm
						uuid	= { uuid }
						onClose = { ()=>this.refs.modal1.close() }
					/>
				</Modal>
			</Page>
		)
	}
}