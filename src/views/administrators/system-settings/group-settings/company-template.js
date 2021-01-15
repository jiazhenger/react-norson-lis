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
    { name: '禁用', value: '-1' },
    { name: '待开启', value: '0' }
]
// ===================================================================== component
const TemplateDetail = $async(()=>import('./tp/template-detail'))
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
        selectedKeys:[],
        submit: [
            { label: '中文名称',    	name: 'temp_name',      required: true},
            { label: '英文名称',    	name: 'temp_name_en'},
            { label: '模板编码',    	name: 'temp_code',      required: true,         disabled: true},
            { label: '模板状态',    	name: 'enabled',        required: true,			type: 'select',		data: []},
            { label: '排序',			name: 'sort',           required: true},
            { label: '备注',			name: 'remark',         full: true,				width: '100%',		type: 'textarea'},
        ],
        submit1: [
            { label:'被复制模板编码',   name:'from_temp_code',  required: true},
		    { label:'模板编码',         name:'temp_code',       required: true},
		    { label:'模板名称',         name:'temp_name',       required: true},
		    { label:'英文名称',         name:'temp_name_en',    required: true},
		    { label:'排序',             name:'sort',            required: true},
            { label: '备注',			name: 'remark',         full: true,				width: '100%',		type: 'textarea'},
        ],
        qt_temp_id: ''
	}
	forms = [
		{ label:'状态',		name:'enabled',     type: 'select',     data: []},
		{ label:'模板名称', name:'temp_name'},
		{ label:'模板编码', name:'temp_code'},
    ]
	model = {}
	componentDidMount(){
		const { submit } = this.state
		this.forms[0].data = statusOption
		submit[3].data = statusOption
		this.fetch(this.model)
    }
	// paging
	fetch = param => $fn.fetch.call(this,'qt-comp-template/index', param)
	// table
	cols = [
        { type: 'checkbox' },
		{ title: '模板名称',    field: 'temp_name',				width: 120 },
		{ title: '英文名称',	field: 'temp_name_en',			width: 120 },
		{ title: '模板编码',	field: 'temp_code',				width: 220 },
		{ title: '状态', 	   field: 'enabled',				width: 80,		render: ({rows}) => {
            let d = statusOption.filter(i => i.value === rows.enabled)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
        { title: '备注',	field: 'remark',					width: 220 },
		{ title: '操作',    align:'tc',   width: 200, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button className='mr10' label='编辑' ghost onClick={e=>{
                        this.refs.modal.open()
                        const { submit } = this.state
						$http.submit(null,'qt-comp-template/infotemp',{ param:{uuid: rows.uuid} }).then(data=>{
                            this.rows = data
                            this.isEdit = true
                            $fn.setSubmitValues(submit, data, ()=>{
                                submit[2].disabled = true
                                this.setState({submit})
                            })
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
                this.disabled = false
				submit.map(item => {
                    item.value = ''
                    if (item.name === 'temp_code') {
                        item.disabled = false
                    }
				})
				this.isEdit = false
				this.setState({ submit })
			} },
			{ label:'复制模板', onClick:()=>{
				this.refs.modal1.open()
                const { submit1 } = this.state
				submit1.map(item => {
                    item.value = ''
				})
				this.setState({ submit1 })
            } },
            { label:'禁用', disabled:this.state.selectedKeys.length===0, onClick:()=>{
				const param = {uuid: this.state.selectedKeys.map(v=>v.uuid)} 
				coms.interfaceConfirm('qt-comp-template/del', '禁用', param, () => {
                    this.fetch(this.model)
                    this.setState({selectedKeys: []})
                })
            } },
		]
	}
	render(){
		const { data, pullLoading, pag, submit, submit1 } = this.state
		return (
			<Page title='公司-模板' ButtonGroup={this.ButtonGroup()}>
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
					onRow			= { (v, rows) => this.setState({ selectedKeys: v, qt_temp_id:  rows.uuid}) }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
				/>
                <TemplateDetail qt_temp_id={this.state.qt_temp_id} />
                <Modal ref='modal' title={this.isEdit ? '编辑' : '添加'} width={648} noFooter>
                    <SubmitForm
                        modal
                        data = { submit }
                        onSubmit = { v => {
                            if (this.isEdit) {
                                const param = { ...this.rows, ...v}
                                $http.submit(null,'qt-comp-template/edittemp',{ param }).then(data=>{
                                    message.then(f=>f.default.success('编辑成功'))
                                    this.refs.modal.close()
                                    this.fetch(this.model)
                                })
                            } else {
                                const param = { ...v }
                                $http.submit(null, 'qt-comp-template/addtemp', { param }).then(data => {
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
                <Modal ref='modal1' title='复制模板' width={648} noFooter>
                    <SubmitForm
                        modal
                        data = { submit1 }
                        onSubmit = { v => {
                            const param = { ...v }
                            $http.submit(null, 'qt-comp-template/cptemp', { param }).then(data => {
                                message.then(f => f.default.success('操作成功'))
                                this.refs.modal1.close()
                                this.fetch(this.model)
                            })
                        }}
                        onClose = { ()=>this.refs.modal1.close() }
                        init    = { form => this.form = form }
                    />
                </Modal>
			</Page>
		)
	}
}