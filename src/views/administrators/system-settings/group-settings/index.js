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
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== 页面常量
const statusOption = [
	{ name: "启用", value: "1" },
	{ name: "禁用", value: "-1" }
]
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
        selectedKeys:[],
        submit: [
			{ label: '集团名称',	name: 'group_name',		full: true, width: '100%', required: true},
			{ label: 'logo',		name: 'logo',			full: true, width: '100%',          type: 'upload',     params: {modular: 117}},
            { label: '中文简称',	name: 'short_name'},
            { label: '英文名称',    name: 'en_name'},
            { label: '英文简称',    name: 'short_en_name'},
            { label: '集团编号',    name: 'corp_group_code'},
			{ label: '区域',		name: 'area_id',		type: 'cascader'},
            { label: '地址',		name: 'address'},
            { label: '英文地址',    name: 'en_address'},
            { label: '法人代表',    name: 'legal_person'},
			{ label: '固定电话',    name: 'tel'},
			{ label: '注册日期',	name:'reg_date',		type:'date-time', after:true },
			{ label: '排序',		name: 'sort'},
			{ label: '集团网址',    name: 'website'},
			{ label: '集团简介',    name: 'summary',		type: 'textarea', full: true, width: '100%'},
			{ label: '集团描述',    name: 'description',	type: 'textarea', full: true, width: '100%'},
        ]
	}
	model = {}
	componentDidMount(){
		this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'corp-group/index', param)
	// table
	cols = [
		{ type: 'checkbox' },
		{ title: '集团编码',    field: 'corp_group_code' },
		{ title: '中文名称',	field: 'group_name' },
		{ title: '简称',		field: 'short_name' },
		{ title: '英文名称',	field: 'en_name'},
		{ title: '英文简称',	field: 'short_en_name'},
		{ title: '状态',		field: 'enabled',           render: ({rows}) => {
            let d = statusOption.filter(i => i.value === rows.enabled)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
		{ title: '操作',    align:'tc',   width: 300, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button className='mr10' label='编辑' ghost onClick={e=>{
						this.refs.modal.open()
                        const { submit } = this.state
						$http.submit(null,'corp-group/info',{ param:{id: rows.id} }).then(data=>{
							this.rows = data
                            this.isEdit = true
                            $fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
                        })
					}}  />
					<Button className='mr10' label='查看' ghost onClick={e=>{
						$fn.push(this, $fn.getRoot().root + 'system-settings/company?id=' + rows.uuid)
					}}  />
					<Button className='mr10' label='禁用' ghost onClick={e=>{
						const param = {uuid: rows.uuid} 
						coms.interfaceConfirm('corp-group/del', '禁用', param, () => {
							this.fetch(this.model)
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
				})
				this.isEdit = false
				this.setState({ submit })
			} },
			{ label:'启用', disabled:this.state.selectedKeys.length===0, onClick:()=>{
				const param = {uuid: this.state.selectedKeys.map(v=>v.uuid)} 
				coms.interfaceConfirm('corp-group/open', '启用', param, () => {
                    this.fetch(this.model)
                    this.setState({selectedKeys: []})
                })
            } },
		]
	}
	render(){
		const { data, pullLoading, pag, submit } = this.state
		return (
			<Page title='集团管理' ButtonGroup={this.ButtonGroup()}>
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
                                $http.submit(null,'corp-group/edit',{ param }).then(data=>{
                                    message.then(f=>f.default.success('编辑成功'))
                                    this.refs.modal.close()
                                    this.fetch(this.model)
                                })
                            } else {
                                const param = { ...v }
                                $http.submit(null, 'corp-group/add', { param }).then(data => {
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