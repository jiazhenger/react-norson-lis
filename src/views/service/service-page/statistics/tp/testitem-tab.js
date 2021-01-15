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
	forms = [
        { label:'项目名称',		    name:'kind_name',		type:'select', data:[], nameStr:'name', idStr:'value' },
		{ label:'项目代码',	        name:'kind_code',		type:'input' }, 
        { label:'创建时间',			name:'date',			type:'date-range', names:['start_date', 'end_date'] }
	]
	model = {}
	componentDidMount(){
		cacheApi.then(f => {
			$fn.getCache({
				cache: f.default.kindinfoSelect, name: 'name', id: 'value', callback: (data) => {
					this.setState({data: data})
					if ($fn.hasArray(data)) {
                        this.forms[0].data = data
                    } else {
                        $http.submit(null, 'kind-info/select').then(data => {
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
	fetch = param => $fn.fetch.call(this,'st-cs-kind/index', param)
	cols = [ 
		{ title: '项目名称',		field: 'kind_name',			width:120 },
		{ title: '项目代码',		field: 'kind_code',			width:120 },
		{ title: '项目数量',		field: 'kind_num',			width:120 },
		{ title: '统计时间',		field: 'st_time',			width:120 },
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