import React from 'react'  
// ===================================================================== global declare
const { $fn, $async, $http } = window  
const cacheApi = import('@/private/api/cacheApi')
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
    optypeSelect = [
        { label: '加做', value: '1' },
        { label: '减做', value: '2' }
    ]
	forms = [
        { label:'项目名称',		    name:'kind_name',		type:'select', data:[], nameStr:'name', idStr:'value' },
		{ label:'条码号',	        name:'spec_code',		type:'input' }, 
        { label:'是否加做项目',		name:'op_type',		    type:'select', data:this.optypeSelect, nameStr:'label', idStr:'value' },
	]
	model = {}
	componentDidMount(){
        cacheApi.then(f => {
			$fn.getCache({ // 项目名称
				cache: f.default.dictionarySelect, name: 'name', id: 'value', callback: (data) => {
					if ($fn.hasArray(data)) {
						this.forms[0].data = data 
                    } else {
                        $http.submit(null, 'dictionary/select').then(data => {
							this.forms[0].data = data 
							$fn.setCache()
                        })
					}
				}
			}) 
		})
		this.fetch()
	}
	// paging
	fetch = param => $fn.fetch.call(this,'sp-additional/index', param)
	cols = [ 
		{ title: '项目名称',		field: 'kind_name',			width:120 },
		{ title: '条码号',		    field: 'spec_code',			width:120 },
		{ title: '操作人',		    field: 'op_name',			width:120 },
		{ title: '操作时间',		field: 'op_time',			width:120 },
		{ title: '备注',		    field: 'op_reason',			width:120 },
		{ title: '是否加做',		field: 'op_type',			width:120, render: ({rows}) => { 
            return window.$fn.filterSelect(this.optypeSelect, rows.op_type, 'label', 'value') 
        }} 
	] 
	render(){
		const { data, pullLoading, pag } = this.state
		return (
            <div className='wh fv r5px bcf f12'> 
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
            </div>
		)
	}
}