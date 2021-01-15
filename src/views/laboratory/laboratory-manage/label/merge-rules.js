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
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== private component
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		submit: [
            { label: '分组名称',	    name: 'merge_name',         required: true },
			{ label: '处理方法',	    name: 'handle_type',        required: true,     type: 'select',     data: []},
            { label: '排序',	    	name: 'sort',               required: true },
            { label: '报告单模板',		name: 'report_tpl_id',      required: true,     type: 'select',     data: [] },
			{ label: '描述',			name: 'description',        type: 'textarea' }
        ],
	}
	componentDidMount(){
        const { submit } = this.state
        // 处理方法
        $fn.getDisItem({
			code: 63050,
			callback: (data) => {
				submit[1].data = data
				this.setState({submit})
            }
        })
        cacheApi.then(f => {
            const d = f.default
            // 报告单模板
            $fn.getCache({
                cache: d.reportTemplate, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        submit[3].data = data
                    } else {
                        $http.submit(null, 'kd-report-from/select').then(data => {
                            submit[3].data = data
                            $fn.setCache()
                        })
                    }
                }
            })
            this.setState({submit})
        })
		this.fetch()
	}
	// paging
	fetch = param => $fn.fetch.call(this,'merge-group/index', param)
	// table
	cols = [
        { type:'checkbox' },
		{ title: '分组编号', 	    field: 'merge_no',		width: 150 },
		{ title: '分组名称', 		field: 'merge_name',		width: 160 },
		{ title: '分组描述', 		field: 'description',		width: 150 },
		{ title: '处理方法',		field: 'handle_type_name',		width: 100 },
		{ title: '操作', align:'tc', width:150, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='编辑' className='ml15' ghost onClick={e=>{
						const { submit } = this.state
						$http.submit(null, 'merge-group/info', {param: {uuid: rows.uuid}}).then(data => {
							this.refs.modal.open()
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
		return [
            { label:'添加 F2', code:'F2', onClick:()=>{
				const { submit } = this.state
				this.refs.modal.open()
				submit[0].value = ''
				submit[1].value = ''
				submit[2].value = ''
				submit[3].value = ''
				submit[4].value = ''
				this.isEdit = false
				this.setState({ submit })
            } },
            { label:'删除', disabled:this.state.selectedKeys.length===0, onClick:()=>{
                const keys = this.state.selectedKeys.map(v=>v.uuid)
				confirm.then(f=>{
					f.default({
						msg:'是否确认删除?',
						onOk: close => {
							$http.submit(null,'merge-group/del',{ param:{uuid: keys, enabled: '-1'} }).then(data=>{
								message.then(f=>f.default.success('删除成功'))
								this.fetch(this.model)
								this.setState({selectedKeys: []})
								close()
							})
						}
					})
				})
			} }
		]
	}
	render(){
		const { data, pullLoading, pag, submit } = this.state
		return (
			<Page title='合并规则' ButtonGroup={this.ButtonGroup()}>
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
				<Modal ref='modal' title={this.isEdit ? '添加' : '编辑'} width={648} noFooter>
					<SubmitForm
						modal
                        data		= { submit }
                        onChange    = {(v, press, { name, data }) => {} }
						onSubmit	= { v => {
                            if (this.isEdit) {
								const param = { ...this.rows, ...v }
								$http.submit(null, 'merge-group/edit', { param }).then(data => {
									message.then(f => f.default.success('修改成功'))
									this.refs.modal.close()
									this.fetch()
								})
							} else {
								const param = { ...v, ...this.form }
								$http.submit(null, 'merge-group/add', { param }).then(data => {
									message.then(f => f.default.success('添加成功'))
									this.refs.modal.close()
									this.fetch()
								})
							}
						}}
                        onClose		= { ()=>this.refs.modal.close() }
					 />
				</Modal>
			</Page>
		)
	}
}