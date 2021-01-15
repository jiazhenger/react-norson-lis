import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== private template
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== 页面常量
const outsourTypeOption = [
	{name: '常规外包', value: '1'},
	{name: '临时外包', value: '2'}
]
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		forms: [
			{ label:'条码号',	name:'spec_code' },
			{ label:'外送单位', name:'outsourcing_company' },
			{ label:'科室',		name:'project_parent_id',		type: 'select',		data: [], idStr: 'uuid' },
			{ label:'岗位',		name:'project_id',				type: 'select',		data: [] },
			{ label:'外送类型',	name:'outsourcing_type',		type: 'select',		data: [] },
			{ label:'外送时间',	name:'date',					type:'date-range',	names:['start_at','end_at'],	value:[] },
		]
	}
	// forms = [
	// 	{ label:'条码号',	name:'spec_code' },
    //     { label:'外送单位', name:'outsourcing_company' },
	// 	{ label:'科室',		name:'project_parent_id',		type: 'select',		data: [], idStr: 'uuid' },
	// 	{ label:'岗位',		name:'project_id',				type: 'select',		data: [] },
    //     { label:'外送类型',	name:'outsourcing_type',		type: 'select',		data: [] },
    //     { label:'外送时间',	name:'date',					type:'date-range',	names:['start_at','end_at'],	value:[] },
	// ]
	model = {}
	componentDidMount(){
		const { forms } = this.state
		this.props.onRef(this)
		forms[4].data = outsourTypeOption
		cacheApi.then(f => {
			const d = f.default
            // 科室
			$fn.getCache({
				cache: d.ProjectTeamSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        forms[2].data = data
						this.setState({forms})
                    } else {
                        $http.submit(null, 'project-team/select').then(data => {
                            forms[2].data = data
							this.setState({forms})
                            $fn.setCache()
                        })
                    }
				}
			})
			// 岗位
			$fn.getCache({
				cache: d.laboratoryselect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        forms[3].data = data
						this.setState({forms})
                    } else {
                        $http.submit(null, 'project-team/laboratoryselect').then(data => {
                            forms[3].data = data
							this.setState({forms})
                            $fn.setCache()
                        })
                    }
				}
			})
        })
		this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'specimen/getOutsourcingList', param)
	// table
	cols = [
		{ type:'checkbox' },
		{ title: '外送单位', 	field: 'outsourcing_company',	 	width:145 },
		{ title: '外送时间', 	field: 'outsourcing_created_at', 	width:150 },
		{ title: '外送类型', 	field: 'outsourcing_type',	 		width:80 },
		{ title: '条码号',	 	field: 'spec_code', 				width:130 },
		{ title: '姓名',	 	field: 'patient_name', 				width:120 },
		{ title: '性别',	 	field: 'sex_name', 					width:80 },
		{ title: '年龄',	 	field: 'age_first_val',			 	width:100 },
		{ title: '单一项目', 	field: 'kind_name', 				width:150 },
		{ title: '实验科室', 	field: 'project_parent_name', 		width:150 },
		{ title: '岗位',	 	field: 'project_name', 				width:150 },
	]
	render(){
		const { data, pullLoading, pag, forms } = this.state
		return (
			<>
				{/* 搜索 */}
				<SearchForm
					data		= { forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onAdd		= { this.onAdd } 
					onReset		= { $fn.onReset.bind(this,forms) }
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
			</>
		)
	}
}