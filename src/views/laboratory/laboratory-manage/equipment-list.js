import React from 'react'
// ===================================================================== antd 汉化

// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== global template
const Text = $async(()=>import('@tp/text'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/content/content-aside'))
const Container = $async(()=>import('#tp/box/container'))
const Button = $async(()=>import('@antd/button'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		forms : [
			{ label:'设备名称', name:'a', type:'select', data:[], nameStr:'name', idStr:'value' },
			{ label:'设备型号', name:'b', type:'input' },
			{ label:'购买时间', names:['startDate','endDate'], name:'date',  type:'date-range' },
		],
		key:0
	}
	model = {}
	param = this.props.match.params
	componentDidMount(){
		$http.pull(null,'device/selectName', {dataName:null}).then(data=>{
			data.forEach(v=>{
				v.name = `${v.name}(${v.device_number}) - ${v.device_model}`
			})
			this.state.forms[0].data = data
			this.setState({ forms : this.state.forms})
		})
		this.fetch()
	}
	// paging
	fetch = param => $http.paging(this,'device/index',{ param:{...param,...this.model}, loading:false } )
	// 切换值
	onChange = v => {
		$fn.setModels(this,v)
	}
	// 搜索
	onSubmit = () => {
		const model = $fn.getBody(this.model)
		console.log(model)
	}
	// 添加
	onAdd = () => {
		alert(0)
	}
	cols = [
		{ title: '编号', 		field: 'device_number', 	width:145 },
		{ title: '设备名称', 	field: 'device_name', 		width:145 },
		{ title: '设备型号', 	field: 'device_model', 		width:130 },
		{ title: '设备识别码', 	field: 'id_code', 			width:100, 	align:'tc' },
		{ title: '购买时间', 	field: 'buy_date', 			width:130, 	align:'tc' },
		{ title: '采购价格', 	field: 'buy_price', 		width:130 },
		{ title: '设备类型', 	field: 'device_type_name', 	width:80 },
		{ title: '所属科室', 	field: 'project_name', 		width:80 },
		{ title: '负责人', 		field: 'pinyin_name', 		width:80 },
		{ title: '启用时间', 	field: 'enabeld_date', 		width:80, 	align:'tc' },
		{ title: '联机类型', 	field: 'rel_type_name', 	width:100 },
		{ title: '设备状态', 	field: 'device_status_name',width:80, 	align:'tc' },
		{ title: '操作', align:'tc', render:()=>{
			return (
				<div className='plr5'>
					<Button label='编辑' />
					<Button label='校准计划' className='mlr5' />
					<Button label='校准记录' />
					<Button label='项目关联' className='mlr5' />
					<Button label='设备维护' />
				</div>
			)
		}},
	]
	ButtonGroup = [
		{ label:'添加 F9', code:'F9', onClick:()=>{
			
		} },
		{ label:'禁用', ghost:true, onClick:()=>{
			
		} },
		{ label:'文件导入', ghost:true, onClick:()=>{
			
		} },
	]
	render(){
		const { key, data, pullLoading, pag } = this.state
		return (
			<Page key={key}>
				<Container title='设备列表' ButtonGroup={this.ButtonGroup}>
					{/* 搜索 */}
					<SearchForm data={this.state.forms} onChange={this.onChange} onSubmit={this.onSubmit} onAdd={this.onAdd} onRefesh={()=>$fn.refresh(this)} />
					<Table
						className		= 'xplr'
						cols			= { this.cols }
						data 			= { data }
						loading 		= { pullLoading }
						pag				= { pag }
						onChange		= { (current, pageSize) => this.fetch({current, pageSize}) }
						onSizeChange	= { (current, pageSize) => this.fetch({current, pageSize})  }
					/>
				</Container>
			</Page>
		)
	}
}