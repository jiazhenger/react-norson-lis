// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== common
import coms from '@/private/js/common.js'
// ===================================================================== global declare
const { $http, $fn, $async } = window 
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
		{ label:'条码号',		name:'spec_code',		type:'input' },
		{ label:'领取人',		name:'receive_user',	type:'input' },
		{ label:'标本架编号',	name:'sf_number',		type:'input' },
		{ label:'实验号',		name:'experiment_num',	type:'input' }, 
		{ label:'岗位',			name:'project_name',	type:'select', data: [], nameStr:'name', idStr:'value' },
		{ label:'科室',			name:'team_name',		type:'select', data: [], nameStr:'name', idStr:'uuid' },
		{ label:'领取时间',		name:'date',			type:'date-range', names:['start_time', 'end_time'] }, // 标本领取记录-系统默认时间轴
		{ label:'接收时间',		name:'date1',			type:'date-range', names:['start_receive_time', 'end_receive_time'] } 
	]
	handoverSelect = [
		{ name: "未领取", value: 0 },
		{ name: "已领取", value: 1 } 
	] 
	model = {start_time: coms.sysTime(1), end_time: coms.sysTime(2)}
	componentDidMount(){ 
		// 岗位 
		$fn.dataSave('project-team-laboratoryselect-data').then(local => {
			if($fn.hasArray(local)){
			  this.forms[4].data = local
			}else{
			  $http.pull(null,'project-team/laboratoryselect', {dataName:null}).then(data=>{
				this.forms[4].data = data
				$fn.dataSave('project-team-laboratoryselect-data', data)
			  })
			}
		})
		// 科室 
		$fn.dataSave('project-team-select-data').then(local => {
			if($fn.hasArray(local)){
			  this.forms[5].data = local
			}else{
			  $http.pull(null,'project-team/select', {dataName:null}).then(data=>{
				this.forms[5].data = data
				$fn.dataSave('project-team-select-data', data)
			  })
			}
		})
		console.log(this.model)
		this.fetch(this.model)
	} 
	// paging 
	fetch = param => $fn.fetch.call(this,'receive/logs', param)
	cols = [
		{ title: '标本条码号',		field: 'spec_code',			width:150 },
		{ title: '实验号',			field: 'lb_tpl',			width:150, sort: true},
		{ title: '标本架编号',		field: 'sf_number',			width:150 },
		{ title: '创建人',			field: 'founder',			width:150 },
		{ title: '创建时间',		field: 'created_at',		width:150 },
		{ title: '领取人',			field: 'receive_user',		width:150 },
		{ title: '领取时间',		field: 'receive_time',		width:150 },
		{ title: '接收时间',		field: 'sp_receive_time',	width:150 },
		{ title: '岗位',			field: 'job_id',			width:150 },
		{ title: '科室',			field: 'team_name',			width:150 }, 
		{ title: '状态',			field: 'handover_type', 	width:150, render:({rows})=>{ 
			return window.$fn.filterSelect(this.handoverSelect, rows.handover_type, 'name', 'value') 
		}}
	]
	ButtonGroup = () => {
		return []
	}
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='标本领取记录' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
					init    	= { form => { form.setFieldsValue({date:[coms.sysTime(1), coms.sysTime(2)]}) }}
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
					onSort			= { v => $fn.onSort.call(this, v) }
				/> 
			</Page>
		)
	}
}