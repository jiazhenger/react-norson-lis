import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
const cacheApi = import('@/private/api/cacheApi')
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
		{ label:'岗位',			name:'project_id',			type:'select',		data:[],    idStr: 'uuid'},
		{ label:'项目',			name:'kind_id',				type:'select',		data:[]},
	]
	model = {}
	componentDidMount(){
		cacheApi.then(f => {
            const d = f.default
            // 项目
			$fn.getCache({
				cache: d.labkindselect, callback: (data) => {
                    if ($fn.hasArray(data)) {
						this.forms[1].data = data
                    } else {
                        $http.submit(null, 'specimen/labkindselect').then(data => {
							this.forms[1].data = data
                            $fn.setCache()
                        })
                    }
				}
            })
            // 岗位
            $fn.getCache({
                cache: d.jobAllselect, callback: (data) => {
                    console.log(data)
                    if ($fn.hasArray(data)) {
                        this.forms[0].data = data
                    } else {
                        $http.submit(null, 'project-team/jobAllselect').then(data => {
                            this.forms[0].data = data
                            $fn.setCache()
                        })
                    }
                }
            })
		})
		this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'Specimen/laboratoryListsCount', param)
	// table
	cols = [
		{ title: '岗位',		field: 'project_name' },
		{ title: '项目名称',	field: 'kind_name' },
		{ title: '数量',		field:  'count', },
		{ title: '标准收费',	field: 'sprice' },
		{ title: '实际收费',	field: 'price' },
	]
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='项目统计单'>
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