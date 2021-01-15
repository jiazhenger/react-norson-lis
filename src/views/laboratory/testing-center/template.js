import React from 'react'
// ===================================================================== antd

// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== global template
const Button = $async(()=>import('@antd/button'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
const Tabs = $async(()=>import('#tp/tabs'))
const Box = $async(()=>import('#tp/box/box'))
// ===================================================================== component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== private component
const Control = $async(()=>import('./tp/control'))
const PersonDetail = $async(()=>import('./tp/person-detail'))
const ProjectList = $async(()=>import('./tp/project-list'))
const GraphicRendition = $async(()=>import('./tp/graphic-rendition'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
	}
	model = {}
	
	param = this.props.match.params
	
	cols = [
		{ type:'checkbox' },
		{ title: '标本条码', 	field: 'device_number', 	width:145, sort:true },
		{ title: '自然项目', 	field: 'device_name', 		width:150, sort:true },
		{ title: '实验号', 		field: 'device_model', 		width:130, sort:true },
		{ title: '项目名称', 	field: 'id_code', 			width:100, sort:true },
		{ title: '姓名', 		field: 'buy_date', 			width:100, 	},
		{ title: '标本类型', 	field: 'buy_price', 		width:130 },
		{ title: '结果', 		field: 'device_type_name', 	width:80, sort:true },
		{ title: '结果1', 		field: 'project_name', 		width:80 },
		{ title: '单位', 		field: 'pinyin_name', 		width:130 },
		{ title: '提示', 		field: 'enabeld_date', 		width:100, sort:true },
		{ title: '建议与解释', 	field: 'rel_type_name', 	width:100 },
		{ title: '稀释倍数', 	field: 'device_status_name',width:130 },
		{ title: '迟发状态', 	field: 'device_status_name',width:130 },
		{ title: '迟发预计报告时间', 	field: 'device_status_name',width:130 },
		{ title: '迟发原因', 	field: 'device_status_name',width:130 },
		{ title: '异常状态', 	field: 'device_status_name',width:130 },
		{ title: '项目检测编号', field: 'device_status_name',width:130 },
		{ title: '项目编码', 	field: 'device_status_name',width:130 },
		{ title: '接收时间', field: 'device_status_name',width:130, sort:true },
		{ title: '图标', 	field: 'device_status_name',width:130 },
	]
	componentDidMount(){
		console.log(this.param)
	}
	render(){
		const { data, pullLoading, pag, forms, btns } = this.state
		return (
			<Page nobc={ true }>
				<Control {...this.props} />
				
				<div className='fx ex mt5'>
					<ProjectList cols={this.cols} data={data} />
					<PersonDetail />
					<GraphicRendition />
				</div>
			</Page>
		)
	}
}