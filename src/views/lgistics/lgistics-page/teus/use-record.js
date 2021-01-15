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
// ===================================================================== 缓存
const cacheApi = import('@/private/api/cacheApi') 
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[]
	}  
	forms = [ 
		{ label:'标本箱号',		name:'box_number',		type:'input' }, 
		{ label:'使用时间',		name:'date',			type:'date-range', names:['created_at_start_date', 'created_at_end_date'] } 
	]  
	model = {}
	componentDidMount(){   
		this.fetch(this.model)
	} 
	// paging 
	fetch = param => $fn.fetch.call(this,'boxlogs/index', param)
	cols = [
		{ title: '标箱编号',		field: 'box_number',		width:120 },
		{ title: '业务员名',		field: 'receiver_name',		width:120 },
		{ title: '使用内容',		field: 'content',			width:200 },
		{ title: '使用时间',		field: 'created_at',		width:150 }
	] 
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='标箱使用记录' >
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
					onSort			= { v => $fn.onSort.call(this, v) }
				/> 
			</Page>
		)
	}
}