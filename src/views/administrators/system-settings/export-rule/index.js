import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
const confirm = import('@antd/confirm')
// ===================================================================== global template
const Text = $async(()=>import('@tp/text'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== 页面常量
const statusOption = [
    { name: "启用", value: "1" },
    { name: "禁用", value: "2" }
]
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
        selectedKeys:[],
        uuid: '',
		submit: [
			{ label: '模板名称',    name: 'model_name',         required: true},
			{ label: '状态',        name: 'status',             type: 'select',     data: []},
			{ label: '复制模板',	name: 'copy_model_code',    disabled: true,     type: 'select',     data: [],       nameStr: 'model_name', idStr: 'uuid' },
			{ label: '描述',        name: 'model_description',  type: 'textarea',   full: true,         width: '100%'},
        ],
        submit1: [

        ]
	}
	forms = [
		{ label:'模板名称', name:'model_name'},
		{ label:'模板编码', name:'model_code'},
		{ label:'状态',     name:'status',      type: 'select',     data: []},
	]
	model = {}
	componentDidMount(){
        const { submit } = this.state
        submit[1].data = statusOption
        this.forms[2].data = statusOption
        cacheApi.then(f => {
            const d = f.default
            // 模板列表
			$fn.getCache({
				cache: d.exportTemplate, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        submit[2].data = data
                        this.setState({submit})
                    } else {
                        $http.submit(null, 'lis-outsourcing-company/getExportModel4Select').then(data => {
                            submit[2].data = data
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
	fetch = param => $fn.fetch.call(this,'settings/getExportModel', param)
	// table
	cols = [
		{ type:'checkbox' },
		{ title: '模板名称',    field: 'model_name' },
		{ title: '模板编码',    field: 'model_code'},
		{ title: '模板描述',    field: 'model_description'},
		{ title: '状态',        field: 'status',                width: 80,      render:({rows}) => {
            let d = statusOption.filter(i => i.value === rows.status)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
		{ title: '创建时间',    field: 'created_at',            width: 160,     align: 'tc'},
		{ title: '操作',        align:'tc',                     width: 300,     render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='编辑' ghost onClick={e=>{
						const { submit } = this.state
                        submit.forEach(item=>{
                            if(item.name === 'copy_model_code'){
                                item.disabled = true
                            }
                            if (item.name === 'copy_model_code') {
                                item.visible = false
                            }
                        })
						this.refs.modal.open()
                        this.rows = rows
                        this.isEdit = true
                        $fn.setSubmitValues(submit, rows, ()=>{this.setState({submit})})
					}}  />
					<Button className='ml10' label='配置模板' ghost onClick={e=>{
                        $fn.push(this, $fn.getRoot().root + 'system-settings/export-rule/template?id=' + rows.model_code)
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
				submit.forEach(item => {
                    item.value = ''
                    if (item.name === 'copy_model_code') {
                        item.disabled = false
                    }
                    if (item.name === 'copy_model_code') {
                        item.visible = true
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
							$http.submit(null,'settings/delExportModel',{ param:{uuids: keys} }).then(data=>{
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
			<Page title='导出规则设置' ButtonGroup={this.ButtonGroup()}>
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
								$http.submit(null,'settings/editExportModel',{ param }).then(data=>{
									message.then(f=>f.default.success('编辑成功'))
									this.refs.modal.close()
									this.fetch(this.model)
								})
							} else {
								const param = { ...v }
								$http.submit(null, 'settings/addExportModel', { param }).then(data => {
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