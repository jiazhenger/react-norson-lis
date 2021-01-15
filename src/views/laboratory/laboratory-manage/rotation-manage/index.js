import React from 'react'
import coms from '@/private/js/common.js'
// ===================================================================== antd
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// ===================================================================== global template
const Text = $async(()=>import('@tp/text'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
const Table = $async(()=>import('#cpt/table'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const SearchForm = $async(()=>import('#cpt/search-form'))
// ===================================================================== 页面常量
const enabledOptions = [
    { name: "待开启", value: "0" },
    { name: "已开启", value: "1" },
    { name: "禁用", value: "-1" }
]
// ===================================================================== component
export default class extends React.Component{
	state = {
        data:[],
        pag: {},
        selectedKeys:[],
        submit: [
            { label: '规则名称',    name: 'rotate_name',    full: true,     width: '100%',  required: true},
            { label: '规则描述',    name: 'rotate_desc',    full: true,     width: '100%',  required: true,      type: 'textarea'},
        ],
        uuid: ''
    }
    forms = [
		{ label:'状态',			name:'enabled',			type:'select',		data:[]},
		{ label:'名称',			name:'rotate_name'},
	]
    model = {}
	componentDidMount(){
        this.forms[0].data = enabledOptions
		this.fetch(this.model)
    }
    // paging
    fetch = param => $fn.fetch.call(this,'rt-rotate-conf/index', param)
    // table
	cols = [
		{ type:'checkbox' },
		{ title: '编号',    field: 'rotate_code',   width: 100 },
		{ title: '名称',    field: 'rotate_name',   width: 240},
		{ title: '状态',    field: 'enabled',       width: 130,   render: ({ rows }) => {
            const d = enabledOptions.filter(i => i.value === rows.enabled)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
        { title: '描述',    field: 'rotate_desc',   width: 500,   tdCss: 'wpn'},
		{ title: '操作', align:'tc',   width: 200, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button className='mr10' label='编辑' ghost onClick={e=>{
						this.refs.modal.open()
						const { submit } = this.state
						$http.submit(null,'rt-rotate-conf/info',{ param:{uuid: rows.uuid} }).then(data=>{
                            this.rows = data
                            this.isEdit = true
                            $fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
                        })
					}}  />
                    <Button className='mr10' label='绑定' ghost onClick={e=>{
						$fn.push(this, $fn.getRoot().root + 'laboratory-manage/rotation-rule/bind?id=' + rows.uuid)
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
			{ label:'开启', disabled:this.state.selectedKeys.length===0, onClick:()=>{
				const param = {uuids: this.state.selectedKeys.map(v=>v.uuid)} 
				coms.interfaceConfirm('rt-rotate-conf/open', '开启', param, () => {
                    this.fetch(this.model)
                    this.setState({selectedKeys: []})
                })
            } },
            { label:'禁用', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				const param = {uuids: this.state.selectedKeys.map(v=>v.uuid)} 
				coms.interfaceConfirm('rt-rotate-conf/del', '禁用', param, () => {
                    this.fetch(this.model)
                    this.setState({selectedKeys: []})
                })
			} },
		]
	}
	render(){
        const { submit, pullLoading, data, pag } = this.state
		return (
			<Page title='轮转规则列表' ButtonGroup={this.ButtonGroup()}>
                {/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onAdd		= { this.onAdd } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
				/>
                <Table
                    className		= 'xplr'
                    cols			= { this.cols }
                    data 			= { data }
                    loading 		= { pullLoading }
                    onRow			= { (v) => this.setState({selectedKeys: v})}
                    pag				= { pag }
                    onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
                    onSort			= { v => $fn.onSort.call(this, v) }
                />
                <Modal ref='modal' title={this.isEdit ? '编辑' : '添加'} width={648} noFooter>
                    <SubmitForm
                        modal
                        data = { submit }
                        onSubmit = { v => {
                            if (this.isEdit) {
                                const param = { ...v, uuid: this.rows.uuid}
                                $http.submit(null,'rt-rotate-conf/edit',{ param }).then(data=>{
                                    message.then(f=>f.default.success('编辑成功'))
                                    this.refs.modal.close()
                                    this.fetch(this.model)
                                })
                            } else {
                                const param = { ...v }
                                $http.submit(null, 'rt-rotate-conf/add', { param }).then(data => {
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