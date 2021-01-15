// ===================================================================== 薛玉梅 | 2020-10-19 | 新增文件
import React from 'react'
// ===================================================================== global declare
const { $fn, $async } = window 
// ===================================================================== private component
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[], 
	}
	
	forms = []
	model = {}
	componentDidMount(){ 
		// console.log(this.props)
		// this.fetch()
	}
	componentWillReceiveProps(props) {
		if (props.data) { 
			this.fetch({box_num: props.data.box_number})
		}
	}
	// paging
	fetch = param => $fn.fetch.call(this,'specimen/boxlists', param) 
	cols = [
		{ title: '标本箱编号', 		field: 'box_num', 		width:120 },
		{ title: '医院名称', 		field: 'hosp_name', 	width:120 },
		{ title: '条码号', 			field: 'spec_code',		width:120 },
		{ title: '标本数量', 		field: 'spec_num', 		width:120 },
		{ title: '送检时间', 		field: 'arrival_time', 	width:120 },
		{ title: '项目状态', 		field: 'audit_status', 	width:120, render: ({rows}) => {
			const opt = [
				{label: "待录入", 	value: "-2"},
				{label: "审核失败", value: "-1"},
				{label: "待审核", 	value: "0"},
				{label: "审核成功", value: "1"}
			]
			return $fn.filterSelect(opt, rows.audit_status, 'label', 'value')
		} }
	] 
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Table
				className		= 'xplr'
				cols			= { this.cols }
				data 			= { data }
				loading 		= { pullLoading }
				onRow			= { v => { this.setState({ selectedKeys: v }) } }
				pag				= { pag }
				onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
			/>  
		)
	}
}