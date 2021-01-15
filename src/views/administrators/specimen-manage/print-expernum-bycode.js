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
	
	forms = [
		{ label:'条码号', name:'spec_code',   	 type:'input' },
		{ label:'科室',   name:'team_id',    	 type:'select', data:[], nameStr:'name', idStr:'uuid' },
	]
	model = {}
	componentDidMount(){ 
		cacheApi.then(f => {
			$fn.getCache({
				cache: f.default.ProjectTeamSelect, name: 'name', id: 'uuid', callback: (data) => {
					// this.setState({ProjectTeamSelect: data})
					if ($fn.hasArray(data)) {
                        this.forms[1].data = data
                    } else {
                        $http.submit(null, 'bs-hospital/select').then(data => {
                            this.forms[1].data = data
                            $fn.setCache()
                        })
                    }
				}
			})
		})    
	}
	// paging
	// fetch = param => $http.paging(this,'device/index',{ param:{...param, pageSize:this.pageSize, ...this.model}, loading:false } )
	fetch = param => $fn.fetch.call(this,'specimen/printspec', param)
	cols = [
		{ type:'checkbox' },
		{ title: '主条码', 			field: 'old_spec_code', 	width:120 },
		{ title: '子条码', 			field: 'spec_code', 		width:120 },
		{ title: '科室', 			field: 'team_name', 		width:120 },
		{ title: '岗位', 			field: 'job_id', 			width:100 },
		{ title: '实验号', 			field: 'lb_tpl', 			width:100 },
		{ title: '自然项目', 		field: 'kind_name', 		width:130 },
		{ title: '患者姓名', 		field: 'patient_name', 		width:80 },
		{ title: '标本接收时间', 	field: 'sp_receive_time', 	width:150 } 
	]
	ButtonGroup = () => {
		return [
			{ label:'打印实验号 F2', code:'F2', disabled: !$fn.hasArray(this.selectedKeys), onClick:()=>{} }
		]
	}
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='按条码打印实验号' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press,null,true) } 
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