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
        { label:'统计时间',		name:'date',				type:'date-range',	names:['start_at','end_at'],	value:[] },
		{ label:'科室',			name:'project_parent_id',	type:'select',		data:[]},
        { label:'岗位',			name:'project_id',			type:'select',		data:[],    idStr: 'uuid'},
		{ label:'检测项目',		name:'kind_id',             type:'select',		data:[]},
        
	]
	model = {}
	componentDidMount(){
		cacheApi.then(f => {
            const d = f.default
            // 科室
			$fn.getCache({
				cache: d.ProjectTeamSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
						this.forms[1].data = data
                    } else {
                        $http.submit(null, 'project-team/select').then(data => {
							this.forms[1].data = data
                            $fn.setCache()
                        })
                    }
				}
            })
            // 岗位
            $fn.getCache({
                cache: d.laboratoryselect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        this.forms[2].data = data
                    } else {
                        $http.submit(null, 'project-team/laboratoryselect').then(data => {
                            this.forms[2].data = data
                            $fn.setCache()
                        })
                    }
                }
            })
            // 检测项目
			$fn.getCache({
				cache: d.kindinfoSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
						this.forms[3].data = data
                    } else {
                        $http.submit(null, 'kind-info/select').then(data => {
							this.forms[3].data = data
                            $fn.setCache()
                        })
                    }
				}
            })
		})
		this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'statistics/labSingleTestResultCount', param)
	// table
	cols = [
		{ title: '科室',            field: 'project_parent_name' },
		{ title: '岗位',            field: 'project_name' },
		{ title: '检测项目名称',    field: 'single_kind_name' },
		{ title: '检测数量',        field:  'count_total', },
		{ title: '收费标准',        field: 'sprice_total' },
		{ title: '实际收费',        field: 'price_total' },
	]
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='测试数统计'>
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