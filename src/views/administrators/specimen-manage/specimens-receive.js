// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
import { ExclamationCircleTwoTone } from '@ant-design/icons';
// ===================================================================== common
import coms from '@/private/js/common.js'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const message = import('@antd/message')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table')) 
const SpecimensReceiveChild = $async(()=>import('@views/administrators/specimen-manage/specimens-receive-child')) 
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
			{ label:'用户名',		name:'account',		type: 'input',		required:true },
			{ label:'密码', 		name:'password',	type: 'password', 	required:true },
			{ label:'跨岗位领取', 	name:'sub_all',		type: 'checkbox' }
		],
		submit_single: [ 
			{ label:'领取科室', 	name:'team_id', 	type:'select', data:[], nameStr:'name', idStr:'uuid', required:true, full: true, width: '100%'},
			{ label:'条码号',		name:'spec_code',	type: 'input', required:true, maxLength: 14 },
			{ label:'条码科室',		name:'team',		type: 'input', disabled: true, required:true },
			{ label:'用户名',		name:'account',		type: 'input',		required:true },
			{ label:'密码', 		name:'password',	type: 'password', 	required:true }
		]
	}
	submit_single_row = {}
	forms = [
		{ label:'科室', name:'project_name', type:'select', data:[], nameStr:'name', idStr:'uuid' }
	]
	model = {}
	componentDidMount(){ 
		const { submit_single } = this.state
		cacheApi.then(f => {
			$fn.getCache({
				cache: f.default.ProjectTeamSelect, name: 'name', id: 'uuid', callback: (data) => {
					if ($fn.hasArray(data)) {
						this.forms[0].data = data
						submit_single[0].data = data
                    } else {
                        $http.submit(null, 'project-team/select').then(data => {
                            this.forms[0].data = data
							submit_single[0].data = data
							$fn.setCache()
                        })
					}
					this.setState({submit_single})
				}
			})
		}) 
		this.fetch() 
	}
	// paging 
	fetch = (param) => $http.pull(this,'receive/pull',{ param:{...param, ...this.model}, loading:false, onSuccess: (data) => data.items && data.items || [] }) 
	cols = [
		{ type: 'checkbox' }, 
		{ title: '标本架代码',			field: 'sf_code', 			width:120 },
		{ title: '可领取的标本架编号',	 field: 'un_receive_count',  width:120 },
		{ title: '数量',				field: 'spec_count', 		width:120 },
		{ title: '科室',				field: 'project_name', 		width:120 },
	]
	Derivedform = () => { 
		const params = {
		  team_id: this.model.team_id
		}
		$http.submit(this, 'receive/specimenReceiveExport', {param: params, submitLoading:'infoLoading'}).then(data => {
			if (data) {
				window.location.href = data.url;
			} else {
				message.then(f => f.default.error('操作失败')) 
			}
		})  
	  }
	ButtonGroup = () => {
		return [
			{ label:'领取', disabled: !$fn.hasArray(this.state.selectedKeys), onClick:()=> this.refs.modal.open() },
			{ label:'导出外包清单 F2', code:'F2', ghost:true, onClick:() => this.Derivedform()},
			{ label:'快捷领取', ghost:true, onClick:()=>{ 
				$fn.push(this, $fn.getRoot().root + 'specimen-manage/specimens-receive/quick')
			} },
			{ label:'单标本领取', ghost:true, onClick:()=> this.refs.modal_single.open() }
		]
	}
	render(){
		const { data, pullLoading, pag, submit, selectedKeys, submit_single } = this.state
		return (
			<Page title='标本领取' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
					onAdd       = { () => this.Derivedform() }
				/>
				{/* 表格 */}
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { (select, rows) => {
						this.setState({ selectedKeys: select, rows: rows })
						$fn.hasObject(rows) && this.receiveChildRef.fetch({team_id: rows.uuid, shelf_id: rows.shelf_id})
					} }  
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
					noPag       	= { true }
				/> 
				<SpecimensReceiveChild onRef={ref => this.receiveChildRef = ref} />
				<Modal ref='modal' title='领取' width={648} noFooter>
					<div className="f12 pb20 tc"><ExclamationCircleTwoTone twoToneColor="#ff4d4f" className="mr5" />请输入用户名与密码进行领取确认</div>
					<SubmitForm
						modal
						data = { submit }
						onSubmit = { v => {
							let param = { 
								shelf_id: selectedKeys.map(v=>v.uuids),
								account: v.account,
								password: v.password,
								sub_all: v.sub_all ? 1 : 0
							}   
							$http.submit(null, 'receive/add', { param }).then(data=>{
								message.then(f=>f.default.success('领取成功'))
								this.refs.modal.close()
								this.fetch(this.model) 
							}) 
						}}
						onClose = { ()=>this.refs.modal.close() }
					 />
				</Modal>
				<Modal ref='modal_single' title='单标本领取' width={648} noFooter>
					<SubmitForm
						modal
						data = { submit_single } 
						onEnter
						onChange = {(v, press, {name}) => {   
							submit_single.forEach(i => {
								if (i.name === name) {
									i.value = v
								} 
							}) 
							if (name === 'spec_code' && (v.length === 12 || v.length === 14)) {
								$http.submit(null, 'receive/singlePullList', {param: {spec_code: v}, onSuccess: () => {}}).then(data => {
									this.submit_single_row = data 
									$fn.setSubmitValues(submit_single, {team: data.team}, ()=>{this.setState({submit_single})})
								})   
							} 
						}}
						onSubmit = { v => {
							console.log(v)
							let param = {
								uuid: this.submit_single_row.uuid,
								account: v.account,
								password: v.password
							}
							if (this.submit_single_row.team_id === v.team_id) {
								coms.interfaceConfirm('receive/singleAdd', '领取', param, () => { 
									this.refs.modal_single.close()
									$fn.hasObject(this.state.rows) && this.receiveChildRef.fetch({team_id: this.state.rows.uuid, shelf_id: this.state.rows.shelf_id})
								})
							} else {
								message.then(f=>f.default.error('科室不匹配'))
							} 
						}}
						onClose = { ()=>this.refs.modal_single.close() }
					 />
				</Modal>
			</Page>
		)
	}
}