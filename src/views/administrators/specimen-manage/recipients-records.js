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
		{ label:'标本架编号',	name:'sf_number',		type:'input' },
		{ label:'科室',			name:'project_name',	type:'input' },  
		{ label:'领用时间',		name:'date',			type:'date-range', names:['start_date', 'end_date'] } // 标本领取记录-系统默认时间轴 
	]
	model = {}
	componentDidMount(){
		this.fetch()
	}
	// paging
	fetch = param => $fn.fetch.call(this,'shelf/shelfloglist', param)
	cols = [
		{ title: '标本架编号',		field: 'sf_number',			width:120 },
		{ title: '标本架名称',		field: 'sf_name',			width:150 },
		{ title: '容量',			field: 'total_capacity',	width:150 },
		{ title: '科室',			field: 'project_name',		width:150 },
		{ title: '时间',			field: 'created_at',		width:150 },
		{ title: '领取人',			field: 'real_name',			width:150 },
		{ title: '状态',			field: 'status_name', 		width:150 }
	]
	ButtonGroup = () => {
		return []
	}
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='领用记录' ButtonGroup={this.ButtonGroup()}>
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