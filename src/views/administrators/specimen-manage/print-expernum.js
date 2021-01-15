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
		selectedKeys:[],
		searchForm: []
	}
	
	forms = [
		{ label:'打印数量',		name:'copies',			type:'input' },
		{ label:'批量打印',		name:'is_batch',		type:'checkbox' },
		{ label:'条码号',		name:'spec_number',		type:'input', noVisible: false },
		{ label:'开始条码',		name:'spec_start',		type:'input', noVisible: true },
		{ label:'结束条码',		name:'spec_end',		type:'input', noVisible: true },
		{ label:'标本架代码',	name:'sf_code',			type:'input' }
	]
	model = {}
	componentDidMount(){ 
		this.setState({searchForm: this.forms})
		cacheApi.then(f => {
			$fn.getCache({
				cache: f.default.ProjectTeamSelect, name: 'name', id: 'uuid', callback: (data) => { 
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
	fetch = param => $http.paging(this,'receive/printlists',{ param:{...param, pageSize:this.pageSize, ...this.model}, loading:false } )
	 
	cols = [
		{ type:'checkbox' },
		{ title: '标本条码号', 		field: 'spec_code', 		width:120 },
		{ title: '病人姓名', 		field: 'patient_name', 		width:100 },
		{ title: '检测项目', 		field: 'kind_name', 		width:100 },
		{ title: '实验号', 			field: 'lb_tpl', 			width:100 },
		{ title: '岗位', 			field: 'job_id', 			width:100 },
		{ title: '科室', 			field: 'team_name', 		width:100 },
		{ title: '标本架代码', 		field: 'sf_code', 			width:150 }, 
		{ title: '标本类型', 		field: 'spec_type_name', 	width:150 }, 
		{ title: '标本接收时间',	field: 'sp_receive_time', 	width:150 } 
	]
	ButtonGroup = () => {
		return [
			{ label:'打印实验号标签 F2', code:'F2', disabled: !$fn.hasArray(this.selectedKeys), onClick:()=>{} }
		]
	} 
	render(){
		const { data, pullLoading, pag, searchForm } = this.state
		return (
			<Page title='打印实验号' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { searchForm } 
					onChange={(v, press, { name }) => {
						$fn.onChange.call(this, v, press, () => { 
							if (name && name === 'is_batch') {  
								if (v.is_batch) { 
									this.form.resetFields(['spec_number'])
									searchForm.forEach(i => {
										if (i.name === 'spec_number') {
											i.noVisible = true
										} else if (i.name === 'spec_start' || i.name === 'spec_end') {
											i.noVisible = false
										}
									})
									this.setState({searchForm: searchForm})
								} else {
									this.form.resetFields(['spec_start', 'spec_end'])
									searchForm.forEach(i => {
										if (i.name === 'spec_start' || i.name === 'spec_end') {
											i.noVisible = true
										} else if (i.name === 'spec_number') {
											i.noVisible = false
										}
									})
									this.setState({searchForm: searchForm})
								}
							}
						},true)
					} }
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading } 
					init    	= { form => this.form = form }
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