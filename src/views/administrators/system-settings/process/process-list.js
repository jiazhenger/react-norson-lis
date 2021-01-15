import React from 'react'
import Modal from '@antd/modal'
import coms from '@/private/js/common.js'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// ===================================================================== global template
const Text = $async(()=>import('@tp/text'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== 页面常量
const statusOption = [
    { name: '启用', value: '1' },
    { name: '禁用', value: '0' },
]
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
        selectedKeys:[],
        submit: [
            { label: '流程名称',	name: 'process_name',	required: true},
            { label: '排序',    	name: 'sort',			required: true},
            { label: '流程描述',	name: 'description',	full: true,		width: '100%',	type: 'textarea'},
        ]
	}
	forms = [
		{ label:'流程名称', name:'process_name'},
		{ label:'流程编号', name:'process_num'},
	]
	model = {}
	componentDidMount(){
		this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'fl-process/index', param)
	// table
	cols = [
        { type: 'checkbox',		width: 50 },
		{ title: '流程编号',	field: 'process_num',		width: 120 },
		{ title: '流程名称',	field: 'process_name',		width: 120 },
		{ title: '状态',		field: 'enabled',			width: 80,		render: ({rows}) => {
            let d = statusOption.filter(i => i.value === rows.enabled)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
        { title: '创建时间',	field: 'created_at',		width: 160 },
		{ title: '操作',    align:'tc',   width: 200, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button className='mr10' label='编辑' ghost onClick={e=>{
						this.refs.modal.open()
                        const { submit } = this.state
						$http.submit(null,'fl-process/info',{ param:{uuid: rows.uuid} }).then(data=>{
							this.rows = data
                            this.isEdit = true
                            $fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
                        })
					}}  />
                    <Button className='mr10' label='查看节点' ghost onClick={e=>{
						$fn.push(this, $fn.getRoot().root + 'system-settings/node-list?id=' + rows.uuid)
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
				this.isEdit = false
				this.setState({ submit })
			} },
			{ label:'删除', disabled:this.state.selectedKeys.length===0, onClick:()=>{
				const param = {uuid: this.state.selectedKeys.map(v=>v.uuid)} 
				coms.interfaceConfirm('fl-process/del', '删除', param, () => {
                    this.fetch(this.model)
                    this.setState({selectedKeys: []})
                })
            } },
            { label:'启用', disabled:this.state.selectedKeys.length===0, onClick:()=>{
				const param = {uuid: this.state.selectedKeys.map(v=>v.uuid), enable: '1'} 
				coms.interfaceConfirm('fl-process/openDis', '启用', param, () => {
                    this.fetch(this.model)
                    this.setState({selectedKeys: []})
                })
            } },
            { label:'禁用', disabled:this.state.selectedKeys.length===0, onClick:()=>{
				const param = {uuid: this.state.selectedKeys.map(v=>v.uuid), enable: '0'} 
				coms.interfaceConfirm('fl-process/openDis', '禁用', param, () => {
                    this.fetch(this.model)
                    this.setState({selectedKeys: []})
                })
            } },
		]
	}
	render(){
		const { data, pullLoading, pag, submit } = this.state
		return (
			<Page title='流程名称列表' ButtonGroup={this.ButtonGroup()}>
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
                                const param = { ...this.rows, ...v}
                                $http.submit(null,'fl-process/edit',{ param }).then(data=>{
                                    message.then(f=>f.default.success('编辑成功'))
                                    this.refs.modal.close()
                                    this.fetch(this.model)
                                })
                            } else {
                                const param = { ...v }
                                $http.submit(null, 'fl-process/add', { param }).then(data => {
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