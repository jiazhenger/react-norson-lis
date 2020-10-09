import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== global template
const Text = $async(()=>import('@tp/text'))
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
const confirm = import('@antd/confirm')
// ===================================================================== private template
const Page = $async(()=>import('#tp/content/content-aside'))
const Container = $async(()=>import('#tp/box/container'))
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
			{ label:'设备编号', name:'gps_number'},
			{ label:'步经参数', name:'step_param'},
			{ label:'设备状态', name:'device_status', type:'select', data:[] },
			{ label:'排序', 	name:'sort'},
			{ label:'IMEI', 	name:'gps_unique'},
		],
		key:0
	}
	forms = [
		{ label:'设备编号', name:'gps_number'},
		{ label:'设备状态', name:'device_status', type:'select', data:[]},
	]
	model = {}
	componentDidMount(){
		const local = $fn.local('dis-item')
		if($fn.hasArray(local)){
			this.forms[1].data = local
			this.state.submit[2].data = local
			this.setState({deviceStadius:local, submit:this.state.submit})
		}else{
			$http.submit(null,'dis-item/item', { param:{dis_code:200}, loading:false}).then(data=>{
				this.forms[1].data = data
				this.state.submit[2].data = data
				$fn.local('dis-item', data)
				this.setState({deviceStadius:data, submit:this.state.submit})
			})
		}
		this.fetch()
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
						submit[0].value = rows['gps_number']
						submit[1].value = rows['step_param']
						submit[2].value = rows['device_status']
						submit[3].value = rows['sort']
						submit[4].value = rows['gps_unique']
						this.rows = rows
						this.setState({submit})
					}}  />
				</div>
			)
		}},
	]
	ButtonGroup = () => {
		return [
			{ label:'添加 F2', code:'F2', onClick:()=>{
				$fn.push(this,'/laboratory/laboratory-manage/equipment-list/add')
			} },
			{ label:'删除', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				confirm.then(f=>{
					f.default({
						msg:'是否确认禁用?',
						onOk: close => {
							const keys = this.state.selectedKeys.map(v=>v.uuid)
							$http.submit(null,'sp-gps-device/del',{ param:{uuid: keys} }).then(data=>{
								message.then(f=>f.default.success('删除成功'))
								this.fetch(this.model)
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
			<Page>
				<Container title='GPS设备列表' ButtonGroup={this.ButtonGroup()}>
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
				</Container>
				<Modal ref='modal' title='编辑' width={648} noFooter>
					<SubmitForm
						modal
						data = { submit }
						onSubmit = { v => {
							const param = { ...v, uuid: this.rows.uuid}
							$http.submit(null,'sp-gps-device/edit',{ param }).then(data=>{
								message.then(f=>f.default.success('编辑成功'))
								this.refs.modal.close()
								this.fetch(this.model)
							})
						}}
						onClose = { ()=>this.refs.modal.close() }
					 />
				</Modal>
			</Page>
		)
	}
}