/* 薛玉梅 | 2020-12-28 15:33:58 | desc: 新建模型*/
import React from 'react'
// ===================================================================== common
import ts from '@views/laboratory/testing-center/tp/common.js' 
// ===================================================================== global declare
const { $http, $fn, $async } = window 
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))  
// ===================================================================== private component
const Control = $async(()=>import('./tp/control'))
const PersonDetail = $async(()=>import('./tp/person-detail'))
const ProjectList = $async(()=>import('./tp/project-list'))
const GraphicRendition44020 = $async(()=>import('./tp/graphic-rendition-44020'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		tableData:[],
		pag: {},
		selectedKeys:[],
		spec_typeOption: [], // 标本类型
		infos: {}, // 单个数据的详情
		list: [], // 多条数据
		status: '45001', // 搜索条件
	}   
	param = this.props.match.params
	
	cols = [
		{ type:'checkbox' },
		{ title: '病理号', 				field: 'experiment_num', 		width:110,  	sort:true },
		{ title: '姓名', 				field: 'patient_name', 			width:100 }, 
		{ title: '标本条码', 			field: 'spec_code', 			width:150, 		sort:true, render: ({ rows }) => {
			return ts.renderIcons(rows, rows.spec_code)
		} }, 
		{ title: '性别', 				field: 'sex_name', 				width:50 },
		{ title: '年龄', 				field: 'age', 					width:80 },
		{ title: '项目名称', 			field: 'kind_name',	 			width:220, 		sort:true, render: ({ rows }) => {
			return ts.renderSettings.call(this, rows.kind_name, rows.kind_code)
		} },
		{ title: '项目编码', 			field: 'kind_code',				width:80 },
		{ title: '自然项目', 			field: 'parent_kind_name', 		width:220, 		sort:true, render: ({ rows }) => {
			return ts.renderSettings.call(this, rows.parent_kind_name, rows.parent_kind_code)
		} },
		{ title: '接收时间', 			field: 'receive_time',			width:140, 		sort:true },
		{ title: '图标', 				field: '图标',					width:120 }
	]
	onChanged = (v, name, rows, index) => { 
		ts.onChanges.call(this, v, name, rows, index)
	}
	// 参考范围
	changeReferenceRange = (rows) => {
		this.ProjectListRef.changeReferenceRange(rows)
	} 
	componentDidMount(){
		$fn.dataSave('dis-item-2000-data').then(local => {
			if($fn.hasArray(local)){ 
            this.setState({spec_typeOption: local})
			}else{
			  $http.submit(null,'dis-item/item', { param:{dis_code:2000}}).then(data=>{
                this.setState({spec_typeOption: data})
				$fn.dataSave('dis-item-2000-data', data)
			  }) 
			}
		}) 
	}
	render(){
		const { infos, list } = this.state
		return (
			<Page nobc={ true }>
				<Control {...this.props} list={list} infos={infos} getData={() => {return this.ProjectListRef.state.data} } getSelectedKeys={() => { return this.ProjectListRef.state.selectedKeys }}  onRef={ref => this.ControlRef = ref} changeFetch={(e) => {
					this.ProjectListRef.changeFetch({param: e})
					this.setState({status: e.status})
				}} /> 
				<div className='fx ex mt5 height0'>
					<PersonDetail infos={infos} />
					<GraphicRendition44020 infos={infos} width={610} status={this.state.status} />
					<ProjectList onRef={ref => this.ProjectListRef = ref} cols={this.cols} getData={(v) => this.setState({tableData: v})} getInfo={(v) => this.setState({infos: v})} getSelectedKeys={(v) => this.setState({list: v})} />
				</div>
			</Page>
		)
	}
}