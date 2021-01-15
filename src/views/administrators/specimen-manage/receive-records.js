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
		{ label:'标箱号',		name:'box_num',			type:'input' },
		{ label:'标本条码',		name:'spec_code',		type:'input' },
		{ label:'接收人',		name:'receive_user',	type:'input' },
		{ label:'接收时间',		name:'date',			type:'date-range', names:['start_date','end_date'] }
	]
	model = {}
	componentDidMount(){
		this.fetch()
	}
	// paging
	fetch = param => $fn.fetch.call(this,'sp-box-receive-log/index', param)
	cols = [
		{ title: '标箱编号',		field: 'box_num',			width:145 },
		{ title: '录入总标本数',	field: 'spec_num_total', 	width:145 },
		{ title: '接收总标本数',	field: 'receive_count', 	width:145 },
		{ title: '开箱温度', 		field: 'warm',				width:145 },
		{ title: '标本条码', 		field: 'spec_code', 		width:145 },
		{ title: '条码标本数', 		field: 'spec_num', 			width:145 },
		{ title: '接收人',			field: 'receive_user', 		width:145 },
		{ title: '接收时间', 		field: 'created_at', 		width:145 },
	]
	ButtonGroup = () => {
		return []
	}
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='标本箱接收记录' ButtonGroup={this.ButtonGroup()}>
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