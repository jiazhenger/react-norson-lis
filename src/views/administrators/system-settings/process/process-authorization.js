import React from 'react'
import Modal from '@antd/modal'
import coms from '@/private/js/common.js'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// ===================================================================== global template
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
        selectedKeys:[],
        submit: [
            { label: '授权类型',    name:'auth_type',   required: true,     type: 'select', data: [], onChange: (v) => {
                this.getAuthSelect(v)
            }},
            { label: '选择节点',    name:'node_id',     required: true,     type: 'select', data: []},
            { label: '被授权者',    name:'auth_id',     required: true,     type: 'select', data: []},
        ],
        forms: [
            { label: '授权者名称',  name:'auth_name'},
            { label: '授权类型',    name:'auth_type',   type: 'select', data: []},
            { label: '流程名称',    name:'process_id',  type: 'select', data: []},
            { label: '节点名称',    name:'node_id',     type: 'select', data: []},
        ]
	}
    id = $fn.query('id') || ''
    model = {node_id: this.id}
    // 被授权者
    getAuthSelect(v) {
        const { submit } = this.state
        const node_id = submit[1].value
        $http.submit(null, 'fl-process-auth/select', {param: {auth_type: v}}).then(data => {
            submit[2].data = data.items
            submit[1].value = node_id
            submit[0].value = v
            this.setState({submit})
        })
    }
	componentDidMount(){
        const { submit, forms } = this.state
        // 授权类型
        $fn.getDisItem({
			code: 43000,
			callback: (data) => {
                submit[0].data = data
                forms[1].data = data
				this.setState({submit, forms})
			}
		})
        cacheApi.then(f => {
            const d = f.default
            // 流程名称
			$fn.getCache({
				cache: d.flProSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        forms[2].data = data
                        this.setState({forms})
                    } else {
                        $http.submit(null, 'fl-process/select').then(data => {
                            forms[2].data = data
                            this.setState({forms})
                            $fn.setCache()
                        })
                    }
				}
            })
            // 节点名称
			$fn.getCache({
				cache: d.flProNodeSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        submit[1].data = data
                        forms[3].data = data
                        this.setState({forms, submit})
                    } else {
                        $http.submit(null, 'fl-process-node/select').then(data => {
                            submit[1].data = data.items
                            forms[3].data = data.items
                            this.setState({forms, submit})
                            $fn.setCache()
                        })
                    }
				}
            })
		})
		this.fetch(this.model)
    }
	// paging
	fetch = param => $fn.fetch.call(this,'fl-process-auth/index', param)
	// table
	cols = [
        { type: 'checkbox',     width: 50 },
		{ title: '授权者名称',  field: 'auth_name',         width: 120 },
		{ title: '授权类型',	field: 'auth_type_name',	width: 120 },
        { title: '创建时间',	field: 'created_at',		width: 160 },
		{ title: '所属流程',	field: 'process_name',		width: 120 },
		{ title: '所属节点',	field: 'node_name',			width: 120 },
		{ title: '操作',        align:'tc',                 width: 200, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button className='mr10' label='编辑' ghost onClick={e=>{
						this.refs.modal.open()
                        const { submit } = this.state
						$http.submit(null,'fl-process-auth/info',{ param:{uuid: rows.uuid} }).then(data=>{
                            this.rows = data
                            this.isEdit = true
                            $fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
                        })
					}}  />
                    <Button className='mr10' label='权限关联' ghost onClick={e=>{
                        $fn.push(this, $fn.getRoot().root + 'system-settings/process-authorization/associated?id=' + rows.uuid + '&type=process')
					}}  />
				</div>
			)
		}},
	]
	ButtonGroup = () => {
        const arr = [
            { label:'添加 F2', code:'F2', onClick:()=>{
				this.refs.modal.open()
                const { submit } = this.state
				submit.map(item => {
                    item.value = ''
                    if (this.id && item.name === 'node_id') {
                        item.value = this.id
                    }
				})
				this.isEdit = false
				this.setState({ submit })
			} },
			{ label:'删除', disabled:this.state.selectedKeys.length===0, onClick:()=>{
				const param = {uuid: this.state.selectedKeys.map(v=>v.uuid)} 
				coms.interfaceConfirm('fl-process-auth/del', '删除', param, () => {
                    this.fetch(this.model)
                    this.setState({selectedKeys: []})
                })
            } },
        ]
        if (this.id) {
            arr.push({ label:'返回', onClick:()=>{ $fn.back(this) } },)
        }
        return arr
	}
	render(){
		const { data, pullLoading, pag, submit, forms } = this.state
		return (
			<Page title='流程授权列表' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onAdd		= { this.onAdd } 
					onReset		= { $fn.onReset.bind(this,forms) }
                    loading		= { pullLoading }
                    init        = { form => form.setFieldsValue({node_id: this.model.node_id}) }
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
                                const param = { ...this.rows, ...v, sort: v.sort || ''}
                                $http.submit(null,'fl-process-auth/edit',{ param }).then(data=>{
                                    message.then(f=>f.default.success('编辑成功'))
                                    this.refs.modal.close()
                                    this.fetch(this.model)
                                })
                            } else {
                                const param = { ...v, sort: v.sort || '' }
                                console.log(param)
                                $http.submit(null, 'fl-process-auth/add', { param }).then(data => {
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