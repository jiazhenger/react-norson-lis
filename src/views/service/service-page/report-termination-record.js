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
		{ label:'标本条码',	    name:'spec_code',		type:'input' }, 
        { label:'终止时间',		name:'date',			type:'date-range', names:['start_date', 'end_date'] } 
	]
	model = {}
	componentDidMount(){
		this.fetch()
	}
	// paging
	fetch = param => $fn.fetch.call(this,'sp-info-modify/abortList', param)
	cols = [
        { type: 'checkbox' },
		{ title: '标本条码',		field: 'spec_code',			width:130 },
		{ title: '姓名',		    field: 'patient_name',		width:150 },
		{ title: '医院',			field: 'hosp_name',	        width:220 },
		{ title: '终止时间',		field: 'created_at',		width:160 } 
	]
	ButtonGroup = () => {
		return [
            { label:'批准报告单', disabled: !$fn.hasArray(this.state.selectedKeys), onClick:()=> {
                const param = {uuid: this.state.selectedKeys.map(i => i.uuid)} 
 				coms.interfaceConfirm('sp-info-modify/approve', '批准报告单', param, () => { this.fetch(this.model) })
            } },
            { label:'预览并批准报告单', disabled: !$fn.hasArray(this.state.selectedKeys), onClick:()=> {} } 
        ]
	}
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='报告单终止记录' ButtonGroup={this.ButtonGroup()}>
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