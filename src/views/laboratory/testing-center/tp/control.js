import React from 'react'
// ===================================================================== antd

// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== global template
const Button = $async(()=>import('@antd/button'))
// ===================================================================== private template
const Tabs = $async(()=>import('#tp/tabs'))
const Box = $async(()=>import('#tp/box/box'))
// ===================================================================== template
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== btns
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		forms:[],
		btns:[]
	}
	model = {}
	
	param = this.props.match.params
	form0 = [
		{ label:'条码号', name:'device_name' },
		{ label:'实验号', name:'device_model' },
		{ label:'姓名', name:'device_model' },
		{ label:'项目', name:'device_model' },
		{ label:'自然项目', name:'device_model' }
	]
	form1 = [
		{ label:'条码号', name:'device_name' },
		{ label:'实验号', name:'device_model' },
		{ label:'姓名', name:'device_model' },
		{ label:'项目', name:'device_model' },
		{ label:'自然项目', name:'device_model' },
		{ label:'医院名称', name:'device_model' }
	]
	
	btns = [
		[
			{ label:'上机' },
			{ label:'保存结果' },
			{ label:'提交' },
			{ label:'删除结果' },
			{ label:'迟发' },
			{ label:'退单' },
			{ label:'项目终止' },
			{ label:'修改资料' },
			{ label:'设置结果' },
		],
		[
			{ label:'保存结果' },
			{ label:'审核' },
			{ label:'不通过' },
			{ label:'迟发' },
			{ label:'退单' },
			{ label:'项目终止' },
			{ label:'修改资料' },
			{ label:'危机值报告' },
		],
		[
			{ label:'保存结果' },
			{ label:'批量批准' },
			{ label:'手动批准' },
			{ label:'拒绝' },
			{ label:'删除结果' },
			{ label:'迟发' },
			{ label:'退单' },
			{ label:'项目终止' },
			{ label:'修改资料' },
			{ label:'危机值报告' },
			{ label:'预览并批准报告单' },
			{ label:'合并项目' },
			{ label:'合并项目管理' },
		],
		[
			{ label:'报告终止' },
			{ label:'预览报告单' },
		],
		[
			{ label:'保存结果' },
			{ label:'提交' },
			{ label:'预览报告单' },
		],
		[
			{ label:'预览报告单' },
		]
	]
	cols = [
		{ type:'checkbox' },
		{ title: '标本条码', 	field: 'device_number', 	width:145, sort:true },
		{ title: '自然项目', 	field: 'device_name', 		width:150 },
		{ title: '实验号', 		field: 'device_model', 		width:130 },
		{ title: '设备识别码', 	field: 'id_code', 			width:100, 	align:'tc' },
		{ title: '购买时间', 	field: 'buy_date', 			width:100, 	align:'tc' },
		{ title: '采购价格', 	field: 'buy_price', 		width:130 },
		{ title: '设备类型', 	field: 'device_type_name', 	width:80 },
		{ title: '所属科室', 	field: 'project_name', 		width:80 },
		{ title: '负责人', 		field: 'pinyin_name', 		width:130 },
		{ title: '启用时间', 	field: 'enabeld_date', 		width:100, 	align:'tc' },
		{ title: '联机类型', 	field: 'rel_type_name', 	width:100 },
		{ title: '设备状态', 	field: 'device_status_name',width:80, 	align:'tc' },
		{ title: '操作', align:'tc', width:380, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='编辑' ghost onClick={()=>{
						$fn.push(this,'/laboratory/laboratory-manage/equipment-list/add?id=' + rows.id)
					}}/>
					<Button label='校准计划' ghost className='mlr5' />
					<Button label='校准记录' ghost />
					<Button label='项目关联' ghost className='mlr5' />
					<Button label='设备维护' ghost />
				</div>
			)
		}},
	]
	componentDidMount(){
		console.log(this.param)
		this.setState({ forms: this.form0, btns:this.btns[0] })
	}
	tabs = [
		{ title:'结果录入', status:45001 },
		{ title:'已提交', status:45002 },
		{ title:'已审核', status:45003 },
		{ title:'已批准', status:45004 },
		{ title:'已迟发', status:45006 },
		{ title:'已退单', status:45007 },
		{ title:'已终止', status:45008 },
	]
	render(){
		const { data, pullLoading, pag, forms, btns } = this.state
		return (
			<Box>
				<Tabs 
					data={ this.tabs }
					onTabs = { (data, index) => {
						if(['1','2','3'].includes(index)){
							this.setState({ forms: this.form1, btns: this.btns[index]})
						}else{
							this.setState({ forms: this.form0, btns: this.btns[index]})
						}
					}}
				/>
				{/* 操作按钮 */}
				{
					$fn.hasArray(btns) && (
						<nav className='xplr mt5'>
							{
								btns.map((v,i)=><Button key={i} className='mr10 mb5' ghost label={v.label} />)
							}
						</nav>
					)
				}
				{/* 搜索 */}
				<SearchForm
					className 	= { $fn.hasArray(btns) ? 'pt5 pb5' : 'pt10' }
					data		= { forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
				/>
			</Box>
		)
	}
}