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
		selectedKeys:[],
		rows: {}
	} 
	
	forms = [
		{ label:'标本条码',			name:'spec_code',		type:'input' },
		{ label:'操作人', 			name:'operator_name', 	type:'input' },
		{ label:'操作时间', 		name:'date',			type:'date-range',		names:['created_time_start_date', 'created_time_end_date'] },
		{ label:'类型', 			name:'dtype',			type: 'select',  		data: [], nameStr:'name', idStr:'value' }, 
		{ label:'描述', 			name:'title',			type: 'textarea', 		full:true, width:'100%' }
	] 
	model = {}
	componentDidMount(){ 
		$fn.dataSave('slog-select-data').then(local => {
			if($fn.hasArray(local)){ 
				this.forms[3].data = local
			}else{
			  	$http.submit(this,'slog/select').then(data=>{
					this.forms[3].data = data
					$fn.dataSave('slog-select-data', data)
			  	})
			}
		})
		this.fetch()
	}
	// paging
	fetch = param => $fn.fetch.call(this,'slog/index', param)
	cols = [ 
		{ title: 'Id', 			field: 'id', 				width:70 },
		{ title: '模块', 		field: 'dtype_str', 		width:230 },
		{ title: '操作人', 		field: 'operator_name',		width:130 },
		{ title: '操作时间', 	field: 'created_time', 		width:150 },
		{ title: '描述', 		field: 'title', 			width: 500 } 
	]
	ButtonGroup = () => {
		return []
	}
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='标本日志' ButtonGroup={this.ButtonGroup()}>
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
				<div className="br4 r4px" style={{boxShadow: '0 0 3px #8fcfec'}}>
					<div className="tc h22" style={{background: '#f5fcff', borderBottom: '1px solid #e5f5fd'}}>详细信息</div>
					<div className="lh20 pl10 pr10 oxys" style={{height: '60px', borderBottom: '1px solid #e5f5fd'}}>{ this.state.selectedKeys.details }</div>
					<div className="tc h22" style={{background: '#f5fcff', borderBottom: '1px solid #e5f5fd'}}>修改前数据</div>
					<div className="lh20 pl10 pr10 oxys" style={{height: '60px', borderBottom: '1px solid #e5f5fd'}}>{ this.state.selectedKeys.before_details }</div>
				</div>
			</Page>
		)
	}
}