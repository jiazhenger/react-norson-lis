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
const PrinterForm = $async(() => import('#cpt/printer-settings'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
const RelateForm = $async(() => import('./tp/relate'))
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
        selectedKeys:[],
        uuid: '',
		submit: [
			{ label: '打印机名称',	name: 'printer_name',   full: true,     width: '100%',  required: true},
			{ label: '打印机型号',	name: 'printer_model',  full: true,     width: '100%',  required: true},
			{ label: '打印机类型',	name: 'printer_type',   full: true,     width: '100%',  required: true,		type: 'select',	data: [] },
			{ label: '打印机代码',	name: 'printer_code',   full: true,     width: '100%',  required: true},
        ],
	}
	forms = [
		{ label:'打印机名称', name:'keyword'},
	]
	model = {}
	componentDidMount(){
        const { submit } = this.state
        // 打印机类型
		$fn.getDisItem({
            code: 50000,
            callback: data=>{
                submit[2].data = data
            }
        })
        this.fetch()
	}
	// paging
	fetch = param => $fn.fetch.call(this,'printer/index', param)
	// table
	cols = [
		{ type:'checkbox' },
		{ title: '序号',        field: 'id' },
		{ title: '打印机名称',  field: 'printer_name'},
		{ title: '类型',        field: 'printer_type_name'},
		{ title: '打印机型号',  field: 'printer_model'},
		{ title: '模板名称',    field: 'printer_template_name'},
		{ title: '操作',        align:'tc',     width: 300,     render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='编辑' ghost onClick={e=>{
						this.refs.modal.open()
						const { submit } = this.state
                        $http.submit(null,'printer/info',{ param:{uuid: rows.uuid} }).then(data=>{
                            this.rows = data
                            this.isEdit = true
                            $fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
                        })
					}}  />
					<Button className='ml10' label='关联模板' ghost onClick={e=>{
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
                })
				this.isEdit = false
				this.setState({ submit })
            } },
            { label:'打印机设置', onClick:()=>{
				this.refs.modal2.open()
			} },
			{ label:'删除', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				confirm.then(f=>{
					f.default({
						msg:'是否确认删除?',
						onOk: close => {
							const keys = this.state.selectedKeys.map(v=>v.uuid)
							$http.submit(null,'printer/delete',{ param:{uuid: keys} }).then(data=>{
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
			<Page title='打印机管理' ButtonGroup={this.ButtonGroup()}>
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
								$http.submit(null,'printer/edit',{ param }).then(data=>{
									message.then(f=>f.default.success('编辑成功'))
									this.refs.modal.close()
									this.fetch(this.model)
								})
							} else {
								const param = { ...v }
								$http.submit(null, 'printer/add', { param }).then(data => {
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
                <Modal ref = 'modal1' title	= '关联模板' width = {648} noFooter >
					<RelateForm
                        uuid    = { this.state.uuid }
						onClose = { ()=>this.refs.modal1.close() }
					/>
				</Modal>
                <Modal ref = 'modal2' title	= '打印机设置' width = {648} noFooter >
					<PrinterForm
						onClose = { ()=>this.refs.modal2.close() }
					/>
				</Modal>
			</Page>
		)
	}
}