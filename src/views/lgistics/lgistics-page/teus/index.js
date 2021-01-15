// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== common
import coms from '@/private/js/common.js'
// ===================================================================== antd
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
// ===================================================================== 缓存
const cacheApi = import('@/private/api/cacheApi') 
// ===================================================================== component
export default class extends React.Component{ 
	isEdit = false
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		selectRows: {},
		box_statusSelect: [], // 标箱状态
		employeeSelect: [], // 人员
		submit: [
			{ label:'标箱条码',		name:'box_code', 		disabled: false },
			{ label:'办事处地址', 	name:'address_id',		type: 'select', data: [], nameStr:'name', idStr:'value' },
			{ label:'gps设备', 		name:'gps_id',			type: 'select', data: [], nameStr:'name', idStr:'value', disabled: false },
			{ label:'容量',			name:'spec_count' },
			// { label:'标箱状态', 	name:'box_status',		type: 'select', data: [], nameStr:'name', idStr:'value'}
		],
		submit1: [
			{ label:'办事处地址', 	name:'address_id',		type: 'select', data: [], nameStr:'name', idStr:'value' } 
		],
		submit2: [
			{ label:'物流人员', 	name:'receiver_id',		type: 'select', data: [], nameStr:'name', idStr:'value' },
			{ label:'所属标箱',		name:'box_number', 		disabled: true },
            { label:'领取时间',		name:'use_time',		type:'date-time' },
			{ label:'备注', 		name:'content',			type: 'textarea', full:true, width:'100%' } 
		]
	}  
	typeSelect = [
		{ label: "系统标箱", value: "1" },
		{ label: "虚拟标箱", value: "2" }
	] 
	boxStatusSelect = [
		{ label: "待领取", value: 81 },
		{ label: "待使用", value: 82 },
		{ label: "待接收", value: 83 },
		{ label: "已接收", value: 84 },
		{ label: "已退回", value: 85 }, 
		{ label: "废弃", value: 87 }
	]
	forms = [ 
		{ label:'标箱条码',		name:'box_code',		type:'input' }, 
		{ label:'创建时间',		name:'date',			type:'date-range', names:['created_at_start_date', 'created_at_end_date'] },
		{ label:'标本箱状态',	name:'box_status',		type:'select', data: this.boxStatusSelect, nameStr:'label', idStr:'value' },
	]  
	model = {}
	componentDidMount(){   
		const { submit, submit1, submit2 } = this.state
		cacheApi.then(f => {
			$fn.getCache({ // gps设备
				cache: f.default.gpsSelect, name: 'name', id: 'value', callback: (data) => {
					if ($fn.hasArray(data)) {
                        submit[2].data = data
                    } else {
                        $http.submit(null, 'sp-gps-device/select').then(data => {
                            submit[2].data = data
                            $fn.setCache()
                        })
                    }
				}
			})
			$fn.getCache({ // 办事处地址
				cache: f.default.spBoxAddress, name: 'name', id: 'value', callback: (data) => {
					if ($fn.hasArray(data)) {
						submit[1].data = data
						submit1[0].data = data
                    } else {
                        $http.submit(null, 'sp-box-address/select').then(data => {
                            submit[1].data = data
							submit1[0].data = data
							$fn.setCache()
                        })
                    }
				}
			})   
			$fn.getCache({ // 员工
				cache: f.default.employeeSelect, name: 'name', id: 'value', callback: (data) => {
					if ($fn.hasArray(data)) {
						submit2[0].data = data 
						this.setState({employeeSelect: data})
                    } else {
                        $http.submit(null, 'employee/select').then(data => {
                            submit2[0].data = data 
							this.setState({employeeSelect: data})
							$fn.setCache()
                        })
                    }
				}
			})
		})   
		$fn.dataSave('dis-item-80-data').then(local => { // 标箱状态 
			if($fn.hasArray(local)){ 
				this.setState({box_statusSelect: local})
			}else{
			  $http.submit(null,'dis-item/item', { param: {dis_code: 80}}).then(data=>{
				this.setState({box_statusSelect: data})
				$fn.dataSave('dis-item-80-data', data)
			  })
			}
		})  
		this.fetch(this.model) 
	} 
	// paging 
	fetch = param => $fn.fetch.call(this,'box/index', param)
	cols = [
		{ type:'checkbox' },
		{ title: '标箱条码',		field: 'box_code',			width:90 },
		{ title: '标箱编号',		field: 'box_number',		width:90 },
		{ title: 'gps设备',			field: 'gps_number',		width:90 },
		{ title: '办事处地址',		field: 'address',			width:200 },
		{ title: '容量',			field: 'total_count',		width:80 },
		{ title: '标本箱状态',		field: 'box_status_name',	width:80 },
		{ title: '创建时间',		field: 'created_at',		width:150 },
		{ title: '类型',			field: 'type',				width:80, render: ({rows}) => {
			return window.$fn.filterSelect(this.typeSelect, rows.type, 'label', 'value') 
		}}, 
		{ title: '操作', 			align:'tc', 				width:120, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='编辑' ghost onClick={e => {
						this.refs.modal.open()
						const { submit, box_statusSelect } = this.state
						this.rows = rows
						this.isEdit = true
						$http.submit(this, 'box/info', { param: {uuid: rows.uuid}} ).then(data => {
							submit[0].value = data['box_code']
							submit[1].value = data['address_id']
							submit[2].value = data['gps_id'] 
							submit[3].value = data['spec_count'] 
							submit[4] = { label:'标箱状态', 	name:'box_status',		type: 'select', data: box_statusSelect, nameStr:'name', idStr:'value'}
							submit[4].value = data['box_status']  
							submit[0].disabled = true
							submit[2].disabled = true
							this.setState({submit})
						}) 
					}}/>  
					{String(rows.box_status) === "85" && <Button label='分配' ghost className='ml10' onClick={e => { 
						this.rows1 = rows 
						this.refs.modal1.open()
					}}/> }
				</div>
			)
		}}  
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
				delete submit[4]
				submit[0].disabled = false
				submit[2].disabled = false
				this.isEdit = false
				this.setState({ submit })
			}},
			{ label:'禁用', ghost:true, disabled: this.state.selectedKeys <= 0, onClick:()=>{
				const param = {uuid: this.state.selectedKeys.map(v=>v.uuid)} 
				coms.interfaceConfirm('box/delete', '禁用', param, () => { this.fetch(this.model) })
			}},
			{ label:'退回', ghost:true, disabled: this.state.selectedKeys <= 0, onClick:()=>{
				const param = {uuid: this.state.selectedKeys.map(v=>v.uuid)} 
				coms.interfaceConfirm('box/return', '退回', param, () => { this.fetch(this.model) })
			}},
			{ label:'领取', ghost:true, disabled: !$fn.hasObject(this.state.selectRows), onClick:()=>{ 
				this.refs.modal2.open()
				const { submit2, selectRows } = this.state
				submit2[0].value = ''
				submit2[1].value = selectRows.box_code
				submit2[2].value = coms.intervalTime(null, null) // 当前时间
				submit2[3].value = ''    
				this.setState({ submit2 }) 
			}},
			{ label:'文件导入', ghost:true, onClick:()=>{
				// const param = {uuid: this.state.selectedKeys.map(v=>v.uuid)} 
				// coms.interfaceConfirm('pick-group/del', '领取', param, () => { this.fetch(this.model) })
			}}
		]
	}
	render(){
		const { data, pullLoading, pag, submit, submit1, submit2 } = this.state
		return (
			<Page title='标本箱' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
				/>
				{/* 表格 */}
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { (select, rows) => { 
						this.setState({ selectedKeys: select, selectRows: rows })
					} }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
					onSort			= { v => $fn.onSort.call(this, v) }
				/> 
				<Modal ref='modal' title={this.isEdit ? '编辑' : '添加'} width={648} noFooter>
					<SubmitForm
						modal
						data = { submit }
						onSubmit = { v => {
							let param = { ...v} 
							let api ='box/add' 
							let info = '添加'  
							if (this.isEdit) {
								param = { ...v, uuid: this.rows.uuid}
								api = 'box/edit' 
								info = '编辑'
							} 
							$http.submit(null, api, { param }).then(data=>{
								message.then(f=>f.default.success(`${info}成功`))
								this.refs.modal.close()
								this.fetch(this.model) 
							}) 
						}}
						onClose = { ()=>this.refs.modal.close() }
					 />
				</Modal> 
				<Modal ref='modal1' title='分配' width={500} noFooter>
					<SubmitForm
						modal
						data = { submit1 }
						onSubmit = { v => {
							let param = { ...v, uuid: this.rows1.uuid} 
							$http.submit(null, 'box/updateaddress', { param }).then(data=>{
								message.then(f=>f.default.success('分配成功'))
								this.refs.modal1.close()
								this.fetch(this.model) 
							})  
						}}
						onClose = { ()=>this.refs.modal1.close() }
					 />
				</Modal>
				<Modal ref='modal2' title='领取' width={500} noFooter>
					<SubmitForm
						modal
						data = { submit2 }
						onSubmit = { v => {
							let receiver = this.state.employeeSelect.filter(i => i.value === v.receiver_id)
							const param = {
								receiver_id: v.receiver_id,
								receiver_name: $fn.hasArray(receiver) ? receiver[0].name : '',
								use_time: v.use_time,
								content: v.content,
								box_number: this.state.selectRows.uuid
							}  
							$http.submit(null, 'box/boxReceive', { param }).then(data=>{
								message.then(f=>f.default.success('领取成功'))
								this.refs.modal2.close()
								this.fetch(this.model) 
							})  
						}}
						onClose = { ()=>this.refs.modal2.close() }
					 />
				</Modal>
			</Page>
		)
	}
}