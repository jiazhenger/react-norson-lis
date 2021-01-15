import React from 'react'
// ===================================================================== common
import coms from '@/private/js/common.js'
// ===================================================================== antd
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== global template
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// ===================================================================== private template
const Tabs = $async(()=>import('#tp/tabs')) 
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
		status: 1,
		submit: [ 
			{ label:'标箱条码', 	name:'box_code',		type: 'select', data: [], nameStr:'box_code', idStr:'box_code' },  
            { label:'领取时间',		name:'use_time',		type:'date-time' },
			{ label:'备注', 		name:'content',			type: 'textarea', full:true, width:'100%' } 
		]
	}
	tabs = [
		{ title: '正在使用', status: 1 },
		{ title: '使用记录', status: 2 }, 
	]
	model = {}  
	forms = [ 
		{ label:'标箱编号',		name:'box_number',		type:'input' }, 
		{ label:'领取时间',		name:'date',			type:'date-range', names:['start_date', 'end_date'] },
		{ label:'物流状态',		name:'follow_status',	type:'select', data: this.boxStatusSelect, nameStr:'name', idStr:'value' },
	]   
	cols = [ 
		{ title: '标箱条码', 	field: 'box_code', 		width: 120 }, 
		{ title: '标箱编号', 	field: 'box_number', 	width: 120 }, 
		{ title: '办事处地址', 	field: 'address', 		width: 200 }, 
		{ title: '办事处名称', 	field: 'contact_name', 	width: 120 }, 
		{ title: 'GPS设备', 	field: 'gps_number', 	width: 120 }, 
		{ title: '标本数量', 	field: 'spec_count', 	width: 120 }, 
		{ title: '标箱状态', 	field: 'status', 		width: 120, render: ({rows}) => {
			let options = [
				{ label: "标箱使用中",		value: "1" },
				{ label: "标箱已被接收",	value: "2" }
			  ]
			return window.$fn.filterSelect(options, rows.status, 'label', 'value') 
		} }, 
		{ title: '物流状态', 	field: 'follow_status_name', 	width: 120 }, 
		{ title: '领取时间', 	field: 'created_at', 			width: 140 },  
	]
	componentDidMount(){ 
		const { submit } = this.state
		$fn.dataSave('dis-item-43400-data').then(local => { // 物流状态 
			if($fn.hasArray(local)){  
				this.forms[2].data = local
			}else{
			  $http.submit(null,'dis-item/item', { param: {dis_code: 43400}}).then(data=>{
				this.forms[2].data = data
				$fn.dataSave('dis-item-43400-data', data)
			  })
			}
		})   
		// 标箱状态 
		$http.submit(null,'box/select', { param: {limit: 500}}).then(data=>{
			submit[0].data = data.items 
			this.setState({submit})
		})
		this.fetch(this.model) 
	} 
	fetch = param => $fn.fetch.call(this,'boxlogs/myboxlists', {...param, status: this.state.status})
	render(){
		const { data, pullLoading, pag, submit } = this.state
		return (
			<Page className='fv' style={{height: '100%'}}>
				<Tabs 
					data={ this.tabs }
					onTabs = { (data, index) => { 
						this.setState({status: data.status}, () => {
							this.fetch(this.model) 
						})
					}}
				/>
				{/* 操作按钮 */} 
				{ this.state.status === 1 && <div className='xplr mt10'>
					<Button ghost label='领取' onClick={() => {
						this.refs.modal.open()
						const { submit } = this.state
						submit[1].value = coms.intervalTime()   
						this.setState({ submit }) 
					}} />
				</div> }
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
					className		= 'xplr ex'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { (select, rows) => this.setState({ selectedKeys: select })}
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
					onSort			= { v => $fn.onSort.call(this, v) }
				/>
				<Modal ref='modal' title='领取' width={648} noFooter>
					<SubmitForm
						modal
						data = { submit }
						onSubmit = { v => { 
							$http.submit(null, 'boxlogs/add', { param: {...v, box_number: ''} }).then(data=>{
								message.then(f=>f.default.success('分领取成功'))
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