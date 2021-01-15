import React from 'react'
import Modal from '@antd/modal'
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
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
        selectedKeys:[],
        submit: [
            { label: '字典名称',    name:'item_name'},
            { label: '英文名称',    name:'name_en'},
            { label: '所属分类',    name:'dis_code',    type: 'select',     data: []},
            { label: '描述',        name: 'remark',     type: 'textarea',   full: true, width: '100%'},
        ],
        forms: [
            { label: '字典编码', name:'item_code'},
            { label: '字典名称', name:'item_name'},
            { label: '所属分类', name:'dis_code',  type: 'select', data: []},
        ]
	}
    id = $fn.query('id') || ''
	model = {dis_code: this.id}
	componentDidMount(){
        const { submit, forms } = this.state
        cacheApi.then(f => {
            const d = f.default
            // 字典分类
			$fn.getCache({
				cache: d.dictionarySelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        submit[2].data = data
                        forms[2].data = data
                        this.setState({forms, submit})
                    } else {
                        $http.submit(null, 'dictionary/select').then(data => {
                            submit[2].data = data
                            forms[2].data = data
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
	fetch = param => $fn.fetch.call(this,'dis-item/index', param)
	// table
	cols = [
		{ title: '字典编码',    field: 'item_code',     width: 120 },
		{ title: '字典名称',	field: 'item_name',     width: 120 },
		{ title: '英文名称',	field: 'name_en',     width: 120 },
		{ title: '所属分类',	field: 'dis_name',      width: 120 },
		{ title: '操作',        align:'tc',             width: 200, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button className='mr10' label='编辑' ghost onClick={e=>{
						this.refs.modal.open()
                        const { submit } = this.state
						$http.submit(null,'dis-item/info',{ param:{id: rows.id} }).then(data=>{
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
        const arr = [
            { label:'添加 F2', code:'F2', onClick:()=>{
				this.refs.modal.open()
                const { submit } = this.state
				submit.map(item => {
                    item.value = ''
                    if (this.id && item.name === 'dis_code') {
                        item.value = this.id
                    }
				})
				this.isEdit = false
				this.setState({ submit })
			} },
			{ label:'文件导入', onClick:()=>{
				
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
			<Page title='数据字典' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onAdd		= { this.onAdd } 
					onReset		= { $fn.onReset.bind(this,forms) }
                    loading		= { pullLoading }
                    init        = { form => form.setFieldsValue({dis_code: this.model.dis_code}) }
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
                                $http.submit(null,'dis-item/edit',{ param }).then(data=>{
                                    message.then(f=>f.default.success('编辑成功'))
                                    this.refs.modal.close()
                                    this.fetch(this.model)
                                })
                            } else {
                                const param = { ...v, item_code: v.item_code || '' }
                                $http.submit(null, 'dis-item/add', { param }).then(data => {
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