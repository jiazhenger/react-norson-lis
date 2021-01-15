import React from 'react'
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const message = import('@antd/message')
const confirm = import('@antd/confirm')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component

export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		data1: {},
	}
	options = [
		{ label: "在职", value: 1 },
		{ label: "离职", value: -1 }
	]
	forms = [
		{ label:'创建时间', name:'date', type:'date-range',	names:['start_at','end_at'] },
    ]
	model = {
		start_date: "",
        end_date: ""
	}
	componentDidMount(){
		
		this.fetch()
	}

	fetch = param => $fn.fetch.call(this,'bs-salesman/lowerSalesman', param)
	cols = [
		{ title: '序号', 		field: 'id', 			width:60 },
		{ title: '员工编码', 	field: 'empl_name', 	width:120 },
        { title: '创建时间', 	field: 'created_at', 	width:120 },
		{ title: '真实姓名', 	field: 'real_name', 	width:80 },
		{ title: '年龄', 		field: 'age', 			width:80 },
		{ title: '籍贯', 		field: 'address', 		width:120 },
        { title: '最高学历', 	field: 'education', 	width:120 },
		{ title: '手机号', 		field: 'phone', 		width:120 },
		{ title: '所属区域', 	field: 'region_name', 	width:120 },
		{ title: '在职状态', 	field: 'status',		width:120,  
			render: ({rows}) => {
			return window.$fn.filterSelect(this.options, rows.status, 'label', 'value')
		}},
	]
	ButtonGroup = () => {
		return []
	}
	render(){
		const { data, data1, pullLoading, pag, submit, selectedKeys } = this.state
		return (
			<Page title='我的下级业务员' ButtonGroup={this.ButtonGroup()}>
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
					onRow			= {current => {
						this.setState({data1:current})
						this.setState({selectedKeys:current})
					}}
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
					// sort
					onSort			= { v => $fn.onSort.call(this, v) }
				/>
			</Page>
		)
	}
}