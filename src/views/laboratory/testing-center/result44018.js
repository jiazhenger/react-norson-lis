/* 薛玉梅 | 2020-12-28 15:33:58 | desc: 新建模型*/
import React from 'react'
// ===================================================================== common
import ts from '@views/laboratory/testing-center/tp/common.js' 
// ===================================================================== global declare
const { $http, $fn, $async } = window 
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container')) 
// ===================================================================== antd 
const Input = $async(()=>import('@antd/form/input'))
const Select = $async(()=>import('@antd/form/select')) 
// ===================================================================== private component
const Control = $async(()=>import('./tp/control'))
const PersonDetail = $async(()=>import('./tp/person-detail'))
const ProjectList = $async(()=>import('./tp/project-list'))
const GraphicRendition44018 = $async(()=>import('./tp/graphic-rendition-44018'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		tableData:[],
		pag: {},
		selectedKeys:[],
		spec_typeOption: [], // 标本类型
		infos: {}, // 单个数据的详情
		list: [], // 多条数据
	}
	model = {}
	
	param = this.props.match.params
	
	cols = [
		{ type:'checkbox' },
		{ title: '标本条码', 			field: 'spec_code', 			width:150, 		sort:true, render: ({ rows }) => {
			return ts.renderIcons(rows, rows.spec_code)
		} }, 
		{ title: '自然项目', 			field: 'parent_kind_name', 		width:220, 		sort:true, render: ({ rows }) => {
			return ts.renderSettings.call(this, rows.parent_kind_name, rows.parent_kind_code)
		} },
		{ title: '实验号', 				field: 'experiment_num', 		width:110 },
		{ title: '项目名称', 			field: 'kind_name',	 			width:220, 		sort:true, render: ({ rows }) => {
			return ts.renderSettings.call(this, rows.kind_name, rows.kind_code)
		} },
		{ title: '姓名', 				field: 'patient_name', 			width:100 },
		{ title: '报告结果', 			field: 'result1', 				width:120, render: ({ rows, index }) => {
			return rows.kd_check_result_cats && rows.kd_check_result_cats.result1 === '1' ?
			<Input name='result1' width='100%' value={rows.result1} onChange={(v, data, name) => ts.onChanges.call(this, v, name, rows, index) } /> : ''
		} },
		{ title: '建议与解释', 			field: 'result_suggestion_id', 	width:100, render: ({ rows, index }) => {
			return <Select name='result_suggestion_id' data={rows.result_suggestion} nameStr='name' idStr='uuid' value={rows.result_suggestion_id}  onChanged={(v, data, name) => ts.onChanges.call(this, v, name, rows, index)} width='100%' />
		} },
		{ title: '迟发状态', 			field: 'is_delay',				width:70, render: ({ rows }) => {
			const options = [{ name: "是", value: "1" }, { name: "否", value: "0" }]
			return $fn.filterSelect(options, rows.is_delay)
		} },
		{ title: '迟发预计报告时间', 	field: 'delay_at',				width:140 },
		{ title: '异常状态', 			field: 'status_abnormal_name',	width:80 },
		{ title: '项目检测编号', 		field: 'ts_sn',					width:160 },
		{ title: '项目编码', 			field: 'kind_code',				width:80 },
		{ title: '检验日期', 			field: 'check_time',			width:140 },
		{ title: '医院名称', 			field: 'hosp_name',				width:180 }, 
		{ title: '科室', 				field: 'department_name',		width:100 }, 
		{ title: '住院号', 				field: 'outpatient',			width:100 }, 
		{ title: '类型', 				field: 'case_type',				width:100 }, 
		{ title: '打印', 				field: '',				width:80 }, 
		{ title: '提交', 				field: '',				width:80 }, 
		{ title: '预审核', 				field: '',				width:80 }, 
		{ title: '架子号', 				field: '',				width:80 }, 
		{ title: '年龄', 				field: 'age',					width:80 }, 
		{ title: '床号', 				field: 'bed_no',				width:80 }, 
		{ title: '测试时间', 			field: '',				width:80 }, 
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
				<Control {...this.props} list={list} infos={infos} getData={() => {return this.ProjectListRef.state.data} } getSelectedKeys={() => { return this.ProjectListRef.state.selectedKeys }}  onRef={ref => this.ControlRef = ref} changeFetch={(e) => {this.ProjectListRef.changeFetch({param: e})}} /> 
				<div className='fx ex mt5 height0'>
					<ProjectList onRef={ref => this.ProjectListRef = ref} cols={this.cols} getData={(v) => this.setState({tableData: v})} getInfo={(v) => this.setState({infos: v})} getSelectedKeys={(v) => this.setState({list: v})} />
					<PersonDetail infos={infos} />
					<GraphicRendition44018 infos={infos} />
				</div>
			</Page>
		)
	}
}