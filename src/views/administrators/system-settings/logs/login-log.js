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
		selectedKeys:[],
	}
	forms = [
        { label:'时间',			name:'date',			type:'date-range',	names:['start_time','end_time'],	value:[] },
		{ label:'真实姓名',		name:'user_real_name'},
		{ label:'用户编号',		name:'user_number'},
		{ label:'登录IP',		name:'login_ip'},
	]
	model = {}
	componentDidMount(){
		this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'lis-login-log/index', param)
	// table
	cols = [
		{ title: '真实姓名',		field: 'user_real_name' },
		{ title: '用户编号',		field: 'user_number' },
		{ title: '登录IP',			field: 'login_ip' },
		{ title: '当前登录时间',	field: 'login_time',		align: 'tc'},
		{ title: '上次登录时间',	field: 'last_login_time',	align: 'tc' },
	]
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='系统登录日志'>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onAdd		= { this.onAdd } 
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