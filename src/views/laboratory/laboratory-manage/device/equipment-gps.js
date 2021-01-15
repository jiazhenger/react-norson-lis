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
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		deviceStadius:[],
		submit: [
			{ label: '设备编号',	name: 'gps_number',		required: true},
			{ label: '步经参数',	name: 'step_param',		required: true},
			{ label: '设备状态',	name: 'device_status',	required: true,		type: 'select',	data: [] },
			{ label: '排序',		name: 'sort',			required: true},
			{ label: 'IMEI',		name: 'gps_unique',		required: true},
		],
		key:0
	}
	forms = [
		{ label:'设备编号', name:'gps_number'},
		{ label:'设备状态', name:'device_status', type:'select', data:[]},
	]
	model = {}
	componentDidMount(){
		const { submit } = this.state
		$fn.dataSave('dis-item-200').then(local => {
			if($fn.hasArray(local)){
				this.forms[1].data = local
				submit[2].data = local
				this.setState({deviceStadius:local, submit:this.state.submit})
			}else{
				$http.submit(null,'dis-item/item', { param:{dis_code:200}, loading:false}).then(data=>{
					this.forms[1].data = data
					submit[2].data = data
					$fn.dataSave('dis-item-200', data)
					this.setState({deviceStadius:data, submit:this.state.submit})
				})
			}
			this.fetch()
		})
	}
	// paging
	fetch = param => $fn.fetch.call(this,'sp-gps-device/index', param)
	// table
	cols = [
		{ type:'checkbox' },
		{ title: '设备编号', 	field: 'gps_number' },
		{ title: '步经参数', 	field: 'step_param'},
		{ title: '设备状态', 	field: 'device_status_name', align:'tc'},
		{ title: '创建时间', 	field: 'created_at', align:'tc' },
		{ title: '操作', align:'tc', render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='编辑' ghost onClick={e=>{
						this.refs.modal.open()
						const { submit } = this.state
						$http.submit(null,'sp-gps-device/info',{ param:{uuid: rows.uuid} }).then(data=>{
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
			{ label:'删除', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				confirm.then(f=>{
					f.default({
						msg:'是否确认删除?',
						onOk: close => {
							const keys = this.state.selectedKeys.map(v=>v.uuid)
							$http.submit(null,'sp-gps-device/del',{ param:{uuid: keys} }).then(data=>{
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
			<Page title='GPS设备列表' ButtonGroup={this.ButtonGroup()}>
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
								$http.submit(null,'sp-gps-device/edit',{ param }).then(data=>{
									message.then(f=>f.default.success('编辑成功'))
									this.refs.modal.close()
									this.fetch(this.model)
								})
							} else {
								const param = { ...v }
								console.log(param, 'param')
								$http.submit(null, 'sp-gps-device/add', { param }).then(data => {
									message.then(f => f.default.success('添加成功'))
									this.refs.modal.close()
									this.fetch(this.model)
								})
							}
							
						}}
						onClose = { ()=>this.refs.modal.close() }
					 />
				</Modal>
			</Page>
		)
	}
}