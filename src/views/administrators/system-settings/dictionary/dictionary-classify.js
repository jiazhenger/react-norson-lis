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
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
        selectedKeys:[],
        submit: [
            { label: '分类编码',	name: 'dis_code',	    required: true},
            { label: '分类名称',    name: 'dis_name',		required: true},
            { label: '描述',        name: 'dis_desc',       full: true,		width: '100%',	type: 'textarea'},
        ]
	}
	forms = [
		{ label:'分类编码', name:'dis_code'},
		{ label:'分类名称', name:'dis_name'},
	]
	model = {}
	componentDidMount(){
		this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'dictionary/index', param)
	// table
	cols = [
		{ title: '序号',        field: 'id',		width: 80 },
		{ title: '分类编码',	field: 'dis_code',	width: 120 },
		{ title: '分类名称',	field: 'dis_name',	width: 150},
        { title: '分类描述',	field: 'dis_desc',	width: 500 },
		{ title: '操作',        align:'tc',         width: 200, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button className='mr10' label='编辑' ghost onClick={e=>{
						this.refs.modal.open()
                        const { submit } = this.state
						$http.submit(null,'dictionary/info',{ param:{id: rows.id} }).then(data=>{
							this.rows = data
                            this.isEdit = true
                            $fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
                        })
					}}  />
                    <Button className='mr10' label='字典内容' ghost onClick={e=>{
						$fn.push(this, $fn.getRoot().root + 'system-settings/dictionary-data?id=' + rows.dis_code)
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
			{ label:'文件导入', onClick:()=>{
				
            } },
		]
	}
	render(){
		const { data, pullLoading, pag, submit } = this.state
		return (
			<Page title='字典分类' ButtonGroup={this.ButtonGroup()}>
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
                                $http.submit(null,'dictionary/edit',{ param }).then(data=>{
                                    message.then(f=>f.default.success('编辑成功'))
									this.refs.modal.close()
									$fn.setCache()
                                    this.fetch(this.model)
                                })
                            } else {
                                const param = { ...v }
                                $http.submit(null, 'dictionary/add', { param }).then(data => {
                                    message.then(f => f.default.success('添加成功'))
									this.refs.modal.close()
									$fn.setCache()
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