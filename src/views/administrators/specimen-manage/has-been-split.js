// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== global declare
const { $fn, $async } = window 
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
		{ label:'原条码',		name:'old_spec_code',	type:'input' }, 
		{ label:'创建时间',		name:'date',			names:['start_date','end_date'], type:'date-range' }
	]
	model = {}
	componentDidMount(){
		this.fetch()
	}
	// paging
	fetch = param => $fn.fetch.call(this,'spec-split/index', param)
	cols = [
		{ type:'checkbox' },
		{ title: '原条码',			field: 'old_spec_code',			width:120 },   
		{ title: '新条码',			field: 'new_spec_code',			width:120 },  
		{ title: '岗位',			field: 'project_name',			width:120 },   
		{ title: '科室',			field: 'parent_project_name',			width:120 },   
		{ title: '创建时间',		field: 'created_at',			width:140 },  
		{ title: '状态',			field: 'split_status',			width:100, render: ({rows}) => {
			return window.$fn.filterSelect([{name: "已拆分", value: 1}], rows.split_status, 'name', 'value') 
		} }  
	]
	ButtonGroup = () => {
		return [  
			{ label:'条码打印', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{} },
		]
	}
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='已拆分' ButtonGroup={this.ButtonGroup()}>
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