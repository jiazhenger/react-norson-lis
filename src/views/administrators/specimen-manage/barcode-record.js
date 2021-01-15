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
		selectedKeys:[]
	}
	enabledSelect = [{name: "已使用", value: "1"}, {name: "未使用",value: "0"}]
	
	forms = [
		{ label:'条码号',		name:'id',			type:'input' }, 
		{ label:'操作人',		name:'real_name',	type:'input' }, 
		{ label:'医院名称',		name:'hosp_id',		type:'select', data:[], nameStr:'name', idStr:'value' },
		{ label:'使用状态',		name:'enabled',		type:'select', data: this.enabledSelect, nameStr:'name', idStr:'value' },
		{ label:'生成时间',		name:'date',		type:'date-range', names:['created_at_start_date','created_at_end_date'] } 
	]
	model = {}
	componentDidMount(){
		$fn.dataSave('bs-hospital-select-data').then(local => {
			if($fn.hasArray(local)){
			  this.forms[2].data = local
			}else{
			  $http.pull(null,'bs-hospital/select', {dataName:null}).then(data=>{ 
				this.forms[2].data = data.items
				$fn.dataSave('bs-hospital-select-data', data.items)
			  })
			}
		})
		this.fetch()
	}
	// paging
	fetch = param => $fn.fetch.call(this,'barcode/getBarcodeSpecList', param)
	cols = [ 
		{ title: '标本条码',	    field: 'id', 	        width:145 },
		{ title: '操作人',          field: 'real_name', 	width:145 },
		{ title: '医院名称', 		field: 'hosp_name', 	width:145 },
		{ title: '使用状态', 		field: 'enabled',    	width:145, render:({rows})=>{ 
			return window.$fn.filterSelect(this.enabledSelect, rows.enabled, 'name', 'value') 
		}},
		{ title: '生成时间', 		field: 'created_at', 	width:145 },
	] 
	ButtonGroup = () => {
		return []
	}
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='条码记录' ButtonGroup={this.ButtonGroup()}>
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