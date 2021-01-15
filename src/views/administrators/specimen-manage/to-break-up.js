// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== common
import coms from '@/private/js/common.js'
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
		{ label:'标本架',		name:'sf_name',			type:'input' },
		{ label:'标本架代码',	name:'sf_code',			type:'input' },
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
		{ title: '标本架名称',		field: 'sf_name',				width:120 },   
		{ title: '标本架代码',		field: 'sf_code',				width:120 },   
		{ title: '标本架编号',		field: 'sf_number',				width:120 },   
		{ title: '岗位',			field: 'project_name',			width:120 },   
		{ title: '创建时间',		field: 'created_at',			width:140 },   
		{ title: '状态',			field: 'split_status',			width:100, render: ({rows}) => {
			return window.$fn.filterSelect([{name: "待拆分", value: 0}], rows.split_status, 'name', 'value') 
		} } 
	]
	ButtonGroup = () => {
		return [
			{ label:'批量拆分完成 F2', code:'F2', onClick:()=>{
				const param = {spec_code: this.state.selectedKeys.map(v=>v.new_spec_code)}
				coms.interfaceConfirm('spec-split/split', '批量拆分完成', param, () => { this.fetch(this.model) })
			} },
			{ label:'打印', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{}}
		]
	}
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='待拆分' ButtonGroup={this.ButtonGroup()}> 
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