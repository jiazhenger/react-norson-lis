import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table'))
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
	}
	forms = [
		{ label:'操作人',		name:'operator_name'},
        { label:'操作时间',		name:'date',			type:'date-range',  names:['created_time_start_date','created_time_end_date'],	value:[] },
		{ label:'类型',		    name:'dtype',           type: 'select',     data: []},
		{ label:'描述',		    name:'title',           type: 'textarea'},
	]
	model = {}
	componentDidMount(){
        cacheApi.then(f => {
            const d = f.default
            // 类型
			$fn.getCache({
				cache: d.slogSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        this.forms[2].data = data
                    } else {
                        $http.submit(null, 'slog/select').then(data => {
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
	fetch = param => $fn.fetch.call(this,'slog/sysLogs', param)
	// table
	cols = [
		{ title: 'Id',          field: 'id',            width: 50 },
		{ title: '模块',		field: 'dtype_str',     width: 130 },
		{ title: '操作人',		field: 'operator_name', width: 80 },
		{ title: '操作时间',	field: 'created_time',  width: 160,		align: 'tc'},
		{ title: '描述',	    field: 'title',         width: 500,    tdCss: 'wpn' },
	]
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='系统日志'>
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