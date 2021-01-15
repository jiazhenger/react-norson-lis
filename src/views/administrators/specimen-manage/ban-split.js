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
		{ label:'创建时间',		name:'date',			type:'date-range', names:['start_date', 'end_date'] } 
	]
	model = {}
	componentDidMount(){
		this.fetch()
	}
	// paging
	fetch = param => $fn.fetch.call(this,'spec-split/index', param)
	cols = [ 
		{ title: '标本类型',		field: 'spec_type_name',	width:150 },
		{ title: '原条码',			field: 'new_spec_code',		width:150 }, 
		{ title: '新条码',			field: 'old_spec_code',		width:150 }, 
		{ title: '说明',			field: 'description',		width:150 }, 
		{ title: '创建时间',		field: 'created_at',		width:150 }, 
		{ title: '状态',			field: 'split_status',		width:150, render: ({rows}) => {
			return window.$fn.filterSelect([{name: "停止拆分", value: -1}], rows.split_status, 'name', 'value') 
		}}
	]
	ButtonGroup = () => {
		return []
	}
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='禁止拆分' ButtonGroup={this.ButtonGroup()}>
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