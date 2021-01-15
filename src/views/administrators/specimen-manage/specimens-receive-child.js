// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
const confirm = import('@antd/confirm')
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
	componentDidMount(){  
		this.props.onRef(this) 
	}
	// paging 
	fetch = param => {
		console.log(param)
		$fn.fetch.call(this,'receive/index', param)
	}
	cols = [ 
		{ title: '标本条码',			field: 'spec_code', 	width:120 },
		{ title: '标本架代码',	 		field: 'sf_code',  		width:120 },
		{ title: '标本架编号',			field: 'sf_number', 	width:120 },
		{ title: '实验号',				field: 'lb_tpl', 		width:120 },
		{ title: '创建人',				field: 'founder', 		width:120 },
		{ title: '创建日期',			field: 'receive_user', 	width:120 },
		{ title: '领取日期',			field: 'receive_time', 	width:120 },
		{ title: '岗位',				field: 'job_id', 		width:120 },
		{ title: '科室',				field: 'team_name', 	width:120 },
		{ title: '状态',				field: 'handover_type', width:120 }
	] 
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Table
				className		= 'xplr'
				cols			= { this.cols }
				data 			= { data }
				loading 		= { pullLoading }
				onRow			= { v => this.setState({ selectedKeys: v }) }
				pag				= { pag }
				onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
			/> 
		)
	}
}