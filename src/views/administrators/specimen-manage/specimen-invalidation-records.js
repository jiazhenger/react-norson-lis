// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
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
	audit_statusSelect = [
		{ name: "已作废", value: "-3" }
	]
	forms = [ 
		{ label:'条码号',		name:'spec_code',		type:'input' }, 
		{ label:'医院名称',		name:'hosp_id',			type:'select', data: [], nameStr:'name', idStr:'value' },
		{ label:'操作人',		name:'operator_id',		type:'select', data: [], nameStr:'name', idStr:'uuid' },
		{ label:'作废时间',		name:'date',			type:'date-range', names:['start_at', 'end_at'] }
	]
	model = {}
	componentDidMount(){
		// 医院列表
		$fn.dataSave('bs-hospital-select-data').then(local => {
			if($fn.hasArray(local)){
			  this.forms[1].data = local
			}else{
			  $http.pull(null,'bs-hospital/select', {dataName:null}).then(data=>{
				this.forms[1].data = data.items
				$fn.dataSave('bs-hospital-select-data', data.items)
			  })
			}
		})
		// 操作人列表 
		$fn.dataSave('employee-select-data').then(local => {
			if($fn.hasArray(local)){
			  this.forms[2].data = local
			}else{
			  $http.pull(null,'bs-hospital/select', {dataName:null}).then(data=>{
				this.forms[2].data = data.items
				$fn.dataSave('employee-select-data', data.items)
			  })
			}
		})
		this.fetch()
	}
	// paging
	fetch = param => $fn.fetch.call(this,'specimen/invalidlists', param)
	cols = [
		{ title: '标本箱编号',		field: 'box_num',			width:90 },
		{ title: '标箱条码号',		field: 'box_code',			width:90 },
		{ title: '医院名称',		field: 'hosp_name',			width:150 },
		{ title: '条码号',			field: 'spec_code',			width:120 },
		{ title: '项目列表',		field: 'kind_str',			width:240 },
		{ title: '录入时间',		field: 'created_at',		width:140 },
		{ title: '作废时间',		field: 'operator_at',		width:140 },
		{ title: '操作员',			field: 'operator_name',		width:120 },
		{ title: '项目状态',		field: 'audit_status',		width:150, render:({rows})=>{ 
			return window.$fn.filterSelect(this.audit_statusSelect, rows.audit_status, 'name', 'value') 
		}} 
	]
	ButtonGroup = () => {
		return []
	}
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='标本作废记录' ButtonGroup={this.ButtonGroup()}>
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
					onRow			= { v => this.setState({ selectedKeys: v }) }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
				/> 
			</Page>
		)
	}
}