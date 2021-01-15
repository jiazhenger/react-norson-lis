// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
import { ExclamationCircleTwoTone } from '@ant-design/icons'; 
// ===================================================================== global declare
const { $http, $fn, $async } = window 
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table')) 
// ===================================================================== 缓存
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		rows: {},
		submit: [
			{ label:'科室',			name:'team_id',		type: 'select', data:[], nameStr:'name', idStr:'uuid', required:true, full: true, width: '100%' },
			{ label:'用户名',		name:'account',		type: 'input',		required:true },
			{ label:'密码', 		name:'password',	type: 'password', 	required:true },
		]
	}
	forms = [
		{ label:'科室', 	name:'team_id',  type:'select', data:[], nameStr:'name', idStr:'uuid' },
		{ label:'标本架', 	name:'shelf_id', type:'select', data:[], nameStr:'newName', idStr:'uuid' },
	]
	model = {}
	componentDidMount(){ 
		const {submit} = this.state
		cacheApi.then(f => {
			$fn.getCache({
				cache: f.default.ProjectTeamSelect, name: 'name', id: 'uuid', callback: (data) => {
					if ($fn.hasArray(data)) {
						this.forms[0].data = data
						submit[0].data = data
                    } else {
                        $http.submit(null, 'project-team/select').then(data => {
                            this.forms[0].data = data
							submit[0].data = data
							$fn.setCache()
                        })
					}
					this.setState({submit})
				}
			}) 
		}) 
		$fn.dataSave('shelf-quick-select-data').then(local => {
			if($fn.hasArray(local)){
			  this.forms[1].data = local
			}else{
			  $http.pull(null,'shelf/quickSelect', {dataName:null}).then(data=>{
				let d = data.items
				d.forEach(i => {
				  i.newName = i.name + '-' + i.sf_code + '-' + i.sf_number
				})  
				this.forms[1].data = d
				$fn.dataSave('shelf-quick-select-data', d)
			  })
			}
		})
		this.fetch() 
	}
	// paging 
	fetch = (param) => $http.pull(this,'receive/quickPullList', {param:{...param, ...this.model}}) 
	cols = [
		{ type: 'checkbox' },  
		{ title: '标本条码',				field: 'spec_code', 		width:120 },
		{ title: '标本架编号',				field: 'sf_number', 		width:120 },
		{ title: '实验号',					field: 'lb_tpl', 			width:120 },
		{ title: '创建人',					field: 'founder', 			width:120 },
		{ title: '创建日期',				field: 'created_at', 		width:150 },
		{ title: '领取人',					field: 'receive_user', 		width:120 },
		{ title: '领取日期',				field: 'receive_time', 		width:150 },
		{ title: '岗位',					field: 'job_id', 			width:120 },
		{ title: '科室',					field: 'team_name', 		width:120 }
	] 
	ButtonGroup = () => {
		return [
			{ label:'返回',  onClick:()=>{ $fn.back(this) } },
			{ label:'领取 F2', code:'F2', disabled: !$fn.hasArray(this.state.selectedKeys), onClick:()=> this.refs.modal.open() }, 
		]
	}
	render(){
		const { data, pullLoading, pag, submit } = this.state
		return (
			<Page title='快捷领取' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
					onAdd       = { () => this.refs.modal.open() }
				/>
				{/* 表格 */}
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { (v) =>  this.setState({ selectedKeys: v}) }  
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
				/>  
				<Modal ref='modal' title='领取' width={648} noFooter>
					<div className="f12 pb20 tc"><ExclamationCircleTwoTone twoToneColor="#ff4d4f" className="mr5" />请输入用户名与密码进行领取确认</div>
					<SubmitForm
						modal
						data = { submit }
						onSubmit = { v => { 
							$http.submit(null, 'receive/quickAdd', {param: {...v, uuid: this.state.selectedKeys.map(i => i.uuid)} }).then(data => {
								this.refs.modal.close() 
								this.fetch()
							}) 
						}}
						onClose = { ()=>this.refs.modal.close() }
					 />
				</Modal>
			</Page>
		)
	}
}