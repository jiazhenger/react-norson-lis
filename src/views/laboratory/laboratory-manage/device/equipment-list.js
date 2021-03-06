import React from 'react'
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
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[]
	}
	
	forms = [
		{ label: '设备名称',	name: 'device_id',		type: 'select',		data: [],	nameStr:'title'},
		{ label:'设备型号',		name:'device_model',	type:'input' },
		{ label:'购买时间',		name:'date',			type:'date-range',	names:['buy_date_start_date','buy_date_end_date'], value:['2020-12-10 12:12:50', '2020-12-11'] },
	]
	model = {}
	componentDidMount(){
		$fn.dataSave('device').then(local => {
			if($fn.hasArray(local)){
				this.forms[0].data = local
			}else{
				$http.pull(null,'device/select', {dataName:null}).then(data=>{
					data.forEach(v=> v.title = `${v.device_name}(${v.device_number}) - ${v.device_model}`)
					this.forms[0].data = data
					$fn.dataSave('device', data)
				})
			}
		})
		this.fetch()
	}
	// paging
	// fetch = param => $http.paging(this,'device/index',{ param:{...param, pageSize:this.pageSize, ...this.model}, loading:false } )
	fetch = param => $fn.fetch.call(this,'device/index', param)
	cols = [
		{ type:'checkbox' },
		{ title: '编号', 		field: 'device_number', 	width:145 },
		{ title: '设备名称', 	field: 'device_name', 		width:150 },
		{ title: '设备型号', 	field: 'device_model', 		width:130 },
		{ title: '设备识别码', 	field: 'id_code', 			width:100, 	align:'tc' },
		{ title: '购买时间', 	field: 'buy_date', 			width:150, 	align:'tc' },
		{ title: '采购价格', 	field: 'buy_price', 		width:130 },
		{ title: '设备类型', 	field: 'device_type_name', 	width:80 },
		{ title: '所属科室', 	field: 'project_name', 		width:80 },
		{ title: '负责人', 		field: 'pinyin_name', 		width:130 },
		{ title: '启用时间', 	field: 'enabeld_date', 		width:150, 	align:'tc' },
		{ title: '联机类型', 	field: 'rel_type_name', 	width:100 },
		{ title: '设备状态', 	field: 'device_status_name',width:80, 	align:'tc' },
		{ title: '操作', align:'tc', width:380, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='编辑' ghost onClick={()=>{
						$fn.push(this, $fn.getRoot().root + 'laboratory-manage/equipment-list/add?id=' + rows.uuid)
					}}/>
					<Button label='校准计划' ghost className='mlr5' onClick={()=>{
						$fn.push(this, $fn.getRoot().root + 'laboratory-manage/calibration-plan?id=' + rows.uuid)
					}} />
					<Button label='校准记录' ghost onClick={()=>{
						$fn.push(this, $fn.getRoot().root + 'laboratory-manage/calibration-record?id=' + rows.uuid)
					}} />
					<Button label='项目关联' ghost className='mlr5' onClick={()=>{
						$fn.push(this, $fn.getRoot().root + 'laboratory-manage/project-related?id=' + rows.uuid)
					}} />
					<Button label='设备维护' ghost onClick={()=>{
						$fn.push(this, $fn.getRoot().root + 'laboratory-manage/equipment-maintain?id=' + rows.uuid)
					}} />
				</div>
			)
		}},
	]
	ButtonGroup = () => {
		return [
			{ label:'添加 F2', code:'F2', onClick:()=>{
				$fn.push(this, $fn.getRoot().root + 'laboratory-manage/equipment-list/add')
			} },
			{ label:'禁用', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				confirm.then(f=>{
					f.default({
						msg:'是否确认禁用？',
						onOk: close => {
							const keys = this.state.selectedKeys.map(v=>v.uuid)
							console.log(keys)
							$http.submit(null, 'device/delete', { param: { uuid: keys } }).then(data => {
								message.then(f=>f.default.success('禁用成功'))
								this.fetch(this.model)
								close()
							})
						}
					})
				})
			} },
			{ label:'文件导入', ghost:true, onClick:()=>{
				
			} },
		]
	}
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='设备列表' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange={(v, press, { name, data }) => {
						$fn.onChange.call(this, v, press, () => {
							if (name && name === 'device_id') {
								return { device_name: data.device_name }
							}
						})
					} } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
					onAdd		= { ()=> $fn.push(this,'/laboratory/laboratory-manage/equipment-list/add') }
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
					// sort
					onSort			= { v => $fn.onSort.call(this, v) }
				/>
				{/*
					<Table
						className		= 'xplr'
						cols			= { this.cols }
						data 			= { data }
						loading 		= { pullLoading }
						selectedKeys	= {[  ]}
						disabledKeys	= {[ ]}
						pag				= { pag }
						onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
						sort
						onSort			= { v => $fn.onSort.call(this, v) }
					/>
				*/}
			</Page>
		)
	}
}