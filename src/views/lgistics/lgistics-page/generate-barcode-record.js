// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react' 
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
	enabledSelect = [
		{ label: "已使用", value: "1" },
		{ label: "未使用", value: "0" },
		{ label: "已删除", value: "-1" } 
	]
	enabledSelect1 = [
		{ label: "已使用", value: "1" },
		{ label: "未使用", value: "0" }
	 ]
	forms = [
		{ label:'条码号',		name:'id',				type:'input' },
		{ label:'操作人',		name:'real_name',		type:'input' }, 
		{ label:'医院名称',		name:'hosp_id',			type:'select', data:[], nameStr:'name', idStr:'value' }, 
		{ label:'使用状态',		name:'enabled',			type:'select', data: this.enabledSelect1, nameStr:'label', idStr:'value' }, 
		{ label:'生成时间',		name:'date',			type:'date-range', names:['created_at_start_date', 'created_at_end_date'] } 
	] 
	model = {}
	componentDidMount(){  
		cacheApi.then(f => {
			// 医院
			$fn.getCache({
				cache: f.default.BsHospitalSelect, name: 'name', id: 'value', callback: (data) => {
					if ($fn.hasArray(data)) {
						this.forms[2].data = data 
                    } else {
                        $http.submit(null, 'bs-hospital/select').then(data => {
                            this.forms[2].data = data 
							$fn.setCache()
						})
                    }
				}
			})
		}) 
		this.fetch(this.model)
	} 
	// paging 
	fetch = param => $fn.fetch.call(this,'barcode/getBarcodeSpecList', param)
	cols = [
		{ title: '标本条码',		field: 'id',				width:120 },
		{ title: '操作人',			field: 'real_name',			width:120 },
		{ title: '医院名称',		field: 'hosp_name',			width:150 },
		{ title: '使用状态',		field: 'enabled',			width:100, render:({rows})=>{ 
			return window.$fn.filterSelect(this.enabledSelect, rows.enabled, 'label', 'value') 
		}},
		{ title: '生成时间',		field: 'created_at',		width:150 } 
	] 
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='条码生成记录' >
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