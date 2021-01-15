import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
// ===================================================================== utils
import Time from '@utils/time'
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
// ===================================================================== 页面变量
// 状态
const statusOptions = [
    { name: "合格",    value: '1' },
    { name: "待校准",  value: '0' },
    { name: "停用",    value: '-1' }
]
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		deviceStadius:[],
		deviceName: [],
		submit: [
			{ label: '设备名称',		name: 'device_id',		required: true,		type: 'select',	data: [], nameStr: 'title'},
			{ label: '周期值',			name: 'type_val',		required: true },
			{ label: '校准周期类型',	name: 'cycle_type',		required: true,		type:'select',	data:[] },
			{ label: '操作人',			name: 'operator_user',	required: true },
			{ label: '校准机构',		name: 'agency' },
			{ label: '提前提醒天数',	name: 'remind_set',		required: true },
			{ label: '描述',			name: 'content',		type: 'textarea' },
		],
		// 校准
		submit1: [
			{ label: '设备名称',		name: 'device_id',	required: true,		type: 'select',	data: [], nameStr: 'title'},
			{ label: '执行人',			name: 'ex_user',	required: true,},
			{ label: '状态',			name: 'status',		required: true,		type: 'select',	data: []},
			{ label: '实际校准时间',	name: 'update_at',	disabled: true},
			{ label: '结果',			name: 'result',		required: true,		type: 'textarea'},
		]
	}
	forms = [
		{ label:'设备编号', name:'device_number'},
		{ label:'设备名称', name:'device_id',	type:'select', data: [], nameStr: 'title'},
		{ label: '周期类型', name:'cycle_type',	type:'select', data:[]},
	]
	model = {device_id: $fn.query('id') || ''}
	componentDidMount(){
		const { submit, submit1 } = this.state
		// 周期类型
		$fn.dataSave('dis-item-44200').then(local => {
			if($fn.hasArray(local)){
				this.forms[2].data = local
				submit[2].data = local
				this.setState({deviceStadius:local, submit:this.state.submit})
			}else{
				$http.submit(null, 'dis-item/item', { param: { dis_code: 44200}, loading:false}).then(data=>{
					this.forms[2].data = data
					submit[2].data = data
					$fn.dataSave('dis-item-44200', data)
					this.setState({deviceStadius:data, submit:this.state.submit})
				})
			}
		})
		// 设备名称
		$fn.dataSave('device').then(local => {
			if ($fn.hasArray(local)) {
				this.forms[1].data = local
				submit[0].data = local
				submit1[0].data = local
				this.setState({deviceName:local, submit:this.state.submit})
			} else {
				$http.pull(null, 'device/select', { dataName: null }).then(data => {
					data.forEach(v => {
						v.title = `${v.device_name}(${v.device_number}) - ${v.device_model}`
					})
					this.forms[1].data = data
					submit[0].data = data
					submit1[0].data = data
					this.setState({deviceName:data, submit:this.state.submit})
					$fn.dataSave('device', data)
				})
			}
		})
		this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'device-plan/index', param)
	// table
	cols = [
		{ title: '设备编号',		field: 'device_number',		width: 100 },
		{ title: '设备名称', 		field: 'device_name',		width: 200 },
		{ title: '上次校准日期', 	field: 'last_time',			width: 150 },
		{ title: '下次校准日期', 	field: 'next_time',			width: 150,		align: 'tc' },
		{ title: '校准周期类型', 	field: 'cycle_type_name',	width: 150,		align: 'tc' },
		{ title: '实际完成时间', 	field: 'update_at', 		width: 150,		align: 'tc' },
		{ title: '校准机构',		field: 'agency',			width: 150 },
		{ title: '操作人员',		field: 'operator_user',		width: 100 },
		{ title: '操作时间',		field: 'created_at',		width: 150,		align: 'tc' },
		{ title: '操作', align:'tc', width:300, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='编辑' ghost onClick={e=>{
						this.refs.modal.open()
						const { submit } = this.state
						$http.submit(null,'device-plan/info',{ param:{uuid: rows.uuid} }).then(data=>{
                            this.rows = data
                            this.isEdit = true
                            $fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
                        })
					}}  />
					<Button label='校准' ghost className='ml15' onClick={() => {
						this.refs.modal1.open()
						const { submit1 } = this.state
						submit1[2].data = statusOptions
						submit1[0].value = rows['device_id']
						submit1[1].value = ''
						submit1[2].value = ''
						submit1[3].value = Time.format(new Date(), {t: 'full'})
						submit1[4].value = ''
						this.rows = rows
						const device = submit1[0].data.filter(i => i.value === submit1[0].value)
						this.device_name = {device_name: device[0].device_name}
						this.setState({submit1})
					}} />
					<Button label='校准记录' className='ml15' ghost onClick={() => {
						$fn.push(this, $fn.getRoot().root + 'laboratory-manage/calibration-record?id=' + rows.device_id)
					}} />
					<Button label='删除' ghost className='ml15' onClick={() => {
						confirm.then(f => {
							f.default({
								msg: '是否确认删除?',
								onOk: close => {
									$http.submit(null, 'device-plan/delete', { param: { uuid: rows.uuid } }).then(data => {
										message.then(f => f.default.success('删除成功'))
										this.fetch(this.model)
										this.setState({selectedKeys: []})
										close()
									})
								}
							})
						})
					} } />
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
				submit[5].value = ''
				submit[6].value = ''
				this.isEdit = false
				this.setState({ submit })
			} },
		]
	}
	render(){
		const { data, pullLoading, pag, submit, submit1 } = this.state
		return (
			<Page title='设备校准计划' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onAdd		= { this.onAdd } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
					init        = { form => form.setFieldsValue({device_id: this.model.device_id}) }
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
								$http.submit(null,'device-plan/edit',{ param }).then(data=>{
									message.then(f=>f.default.success('编辑成功'))
									this.refs.modal.close()
									this.fetch(this.model)
								})
							} else {
								const param = { ...v }
								$http.submit(null, 'device-plan/add', { param }).then(data => {
									message.then(f => f.default.success('添加成功'))
									this.refs.modal.close()
									this.fetch(this.model)
								})
							}
						}}
						onClose = { ()=>this.refs.modal.close() }
					 />
				</Modal>
				<Modal ref='modal1' title='校准' width={648} noFooter>
					<SubmitForm
						modal
						data = { submit1 }
						onSubmit = { v => {
							const param = { ...v, uuid: this.rows.uuid, ...this.device_name}
							$http.submit(null,'device-plan/cali',{ param }).then(data=>{
								message.then(f=>f.default.success('操作成功'))
								this.refs.modal1.close()
								this.fetch(this.model)
							})
						}}
						onClose = { ()=>this.refs.modal1.close() }
					 />
				</Modal>
			</Page>
		)
	}
}