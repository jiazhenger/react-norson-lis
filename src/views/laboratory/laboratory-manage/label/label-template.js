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
const Table = $async(()=>import('#cpt/table'))
const templateStatus = [
    { name: "启用", value: "1" },
    { name: "禁用", value: "0" },
]
// ===================================================================== component
const SubmitModel = $async(() => import('./tp/label-template-form'))
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
        selectedKeys:[],
        submit: [
            { label: '只显示当前打印机支持的纸型',	name: 'gps_number',		type: 'checkbox'},
			{ label: '步经参数',	name: 'step_param',		required: true},
			{ label: '设备状态',	name: 'device_status',	required: true,		type: 'select',	data: [] },
			{ label: '排序',		name: 'sort',			required: true},
			{ label: 'IMEI',		name: 'gps_unique',		required: true},
        ]
	}
	forms = [
		{ label: '模板编号',        name:'tpl_number' },
		{ label: '状态',        name:'enabled', type: 'select', data: []}
	]
	componentDidMount(){
        this.forms[1].data = templateStatus
		this.fetch()
	}
	// paging
	fetch = param => $fn.fetch.call(this,'lis-tag-template/index', param)
	// table
	cols = [
        { type:'checkbox' },
		{ title: '标签名称', 	    field: 'tag_name'},
		{ title: '模板编号',		field: 'tpl_number' },
		{ title: '纸型', 		field: 'pager_type_name'},
		{ title: '创建时间', 	    field: 'created_at', align:'tc' },
		{ title: '状态',	        field: 'enabled', render: ({rows}) => {
            const d = templateStatus.filter(i => i.value === rows.enabled)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        } },
		{ title: '操作', align:'tc', render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='编辑' className='ml15' ghost onClick={e=>{
                        this.refs.modal.open()
						const { submit } = this.state
						submit[0].value = rows['gps_number']
						submit[1].value = rows['step_param']
						submit[2].value = rows['device_status']
						submit[3].value = rows['sort']
						submit[4].value = rows['gps_unique']
						this.rows = rows
						this.isEdit = true
						this.setState({submit})
					}}  />
				</div>
			)
		}},
	]
	ButtonGroup = () => {
        const keys = this.state.selectedKeys.map(v=>v.uuid)
		return [
            { label:'添加 F2', code:'F2', onClick:()=>{
				this.refs.modal.open()
				const { submit } = this.state
				submit[0].value = ''
				submit[1].value = ''
				submit[2].value = ''
				submit[3].value = ''
				submit[4].value = ''
				this.isEdit = false
				this.setState({ submit })
            } },
            { label:'启用', disabled:this.state.selectedKeys.length===0, onClick:()=>{
                $http.submit(null,'lis-tag-template/on',{ param:{uuid: keys} }).then(data=>{
                    message.then(f=>f.default.success('启用成功'))
                    this.fetch(this.model)
                })
            } },
            { label:'禁用', disabled:this.state.selectedKeys.length===0, onClick:()=>{
                $http.submit(null,'lis-tag-template/off',{ param:{uuid: keys} }).then(data=>{
                    message.then(f=>f.default.success('禁用成功'))
                    this.fetch(this.model)
                })
			} },
            { label:'删除', disabled:this.state.selectedKeys.length===0, onClick:()=>{
				confirm.then(f=>{
					f.default({
						msg:'是否确认删除?',
						onOk: close => {
							$http.submit(null,'lis-tag-template/delete',{ param:{uuid: keys} }).then(data=>{
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
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='标签模板' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
                    onChange    = { (v,press)=>$fn.onChange.call(this,v,press) } 
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
                     <SubmitModel onClose = { ()=>this.refs.modal.close() } />
				</Modal>
			</Page>
		)
	}
}