import React from 'react'
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const message = import('@antd/message')
const confirm = import('@antd/confirm')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
const Button = $async(()=>import('@antd/button'))

// ===================================================================== component
const Enclosure = $async(()=>import('./child/enclosure'))


export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		data1: {},
		submit: [
            { label: '合同编号',	name: 'code',				disabled: true, },
			{ label: '合同名称',	name: 'name',				disabled: true, },
			{ label: '折扣率',		name: 'discount_rate' },
			{ label: '延期时间',	name: 'delay' },
			{ label: '新生效时间',	name: 'sign_at', 			type:'date-time',},
            { label: '新到期时间',	name: 'contract_validity',	type:'date-time',},
		],
		ids: '',
	}
	statusList = [
		{ label: "待审核", 		value: "0" },
        { label: "审核成功", 	value: "1" }
	]
	delayOptions = [
		{label: '请选择',		value: ''},
		{label: '7天内',		value: '7'},
		{label: '15天内',		value: '15'},
		{label: '1个月内',		value: '31'}
	]
	contractOptions = [
        { label: "全部",		value: "" },
        { label: "草稿",		value: "0" },
        { label: "正常",		value: "1" },
        { label: "已过期", 		value: "2" }
    ]
    enabledOptions = [
        { label: "全部", 		value: "" },
        { label: "待审核", 		value: "0" },
        { label: "审核成功", 	value: "1" }
	]
	options = [
		{ label: "草稿", 		value: "0" },
		{ label: "正常", 		value: "1" },
		{ label: "已过期", 		value: "2" }
	]
	forms = [
		{ label:'合同编号',		name:'code',		 },
        { label:'合同名称',		name:'name',		 },
        { label:'客户名称',		name:'hosp_id',		type:'select', 	data:[] },
		{ label:'到期时间',		name:'date',		type:'date-range', names:['start_at','end_at'] },
		{ label:'合同失效',		name:'invalid',		type:'select', 	data: this.delayOptions, nameStr:'label', idStr:'value' },
		{ label:'合同状态',		name:'status',		type:'select', 	data: this.contractOptions, nameStr:'label', idStr:'value' },
		{ label:'审核状态',		name:'enabled',		type:'select', 	data: this.enabledOptions, nameStr:'label', idStr:'value' },
	]
	model = {}
	componentDidMount(){
		cacheApi.then(f => {
			$fn.getCache({ // 客户名称
				cache: f.default.BsHospitalSelect, name: 'name', id: 'uuid', callback: (data) => {
					if ($fn.hasArray(data)) {
						this.forms[2].data = data
                    } else {
                        $http.submit(null, 'bs-hospital/select').then(data => {
							this.forms[2].data = data
							$fn.setCache()
                        })
					}
					this.setState()
				}
			})
		})
		this.fetch()
	}
	fetch = param => $fn.fetch.call(this,'bs-contract/index', param)
	cols = [
		{ type:'checkbox' },
		{ title: '合同编号', 		field: 'code', 		width:100 },
        { title: '合同名称', 		field: 'name', 		width:160 },
		{ title: '客户名称', 		field: 'hosp_name', width:160 },
		{ title: '生效时间', 		field: 'sign_at', 	width:120 },
		{ title: '到期时间', 		field: 'contract_validity', width:120 },
        { title: '延期时间(月)', 	field: 'delay', 	width:80 },
		{ title: '合同状态', 		field: 'status', 	width:80,
			render: ({rows}) => {
				return window.$fn.filterSelect(this.options, rows.status, 'label', 'value')
			} },
		{ title: '审核状态', 		field: 'enabled', 	width:100,
			render: ({rows}) => {
				return window.$fn.filterSelect(this.statusList, rows.enabled, 'label', 'value')
			} },
		{ title: '创建人（系统）', 	field: 'empl_name',	width:100 },
		{ title: '操作', 			width:200,  		render:({rows})=>{
			return (
				<div className='plr5'>
					<Button className='mr5' label='编辑' ghost onClick={()=>{
						$fn.push(this, $fn.getRoot().root + 'businessList/contract-manage/edit?uuid=' + rows.uuid)
					}}/>
					<Button className='mr5' label='查看附件' ghost onClick={()=>{
						this.refs.modal1.open()
						// this.uuid = rows.uuid
						this.setState({ids:rows.uuid})
					}}/>
					<Button className='mr5' label='续签' ghost onClick={()=>{
						const { submit } = this.state
						this.refs.modal.open()
						$fn.setSubmitValues(submit, rows, ()=>{this.setState({submit})})
						submit[4].value = ''
						submit[5].value = ''
						this.uuid = rows.uuid
					}}/>
					<Button label='合同签订记录' ghost onClick={()=>{
						$fn.push(this, $fn.getRoot().root + 'businessList/contract-manage/record?code=' + rows.code)
					}}/>
				</div>
			)
		}},
	]
	ButtonGroup = () => {
		return [
			{ label:'添加F1', code:'F1', ghost:true, onClick:()=>{
					$fn.push(this, $fn.getRoot().root + 'businessList/contract-manage/edit')
				}
			},
			{ label:'文件导入', ghost:true, onClick:()=>{
				confirm.then(f=>{
					f.default({
						msg:'是否导入文件？',
						onOk: close => {
							const keys = this.state.data1.map(v=>v.hosp_id)
							const summary = this.state.data1[0].summary_sn
							$http.submit(null,'bill-hosp/resettlement', { param: { hosp_ids: keys.join(','), summary_sn:summary} } ).then(data=>{
								message.then(f=>f.default.success('导入成功'))
								this.fetch(this.model)
								close()
							})
						}
					})
				})
			} },
			{ label:'审核', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				confirm.then(f=>{
					f.default({
						msg:'是否确认审核?',
						onOk: close => {
							let uid = []
							this.state.selectedKeys.map(v=>{uid.push(v.uuid)})
							console.log(uid)
							const param = { uuid: uid,}
							$http.submit(null,'bs-contract/exam', {param} ).then(data=>{
								message.then(f=>f.default.success('审核成功'))
								close()
							})
						}
					})
				})
			} },
		]
	}
	render(){
		const { data, data1, pullLoading, pag, submit, selectedKeys, ids } = this.state
		return (
			<Page title='合同管理' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) }
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
				/>
				{/* 表格 */}
				<Modal ref='modal' title='续签' width={648} noFooter>
					<SubmitForm
						modal
                        data = { submit }
                        onChange    = {(v, press, { name, data }) => {
                            const { submit } = this.state;
                        } } 
						onSubmit = { v => {
                            const param = { ...v,uuid: this.uuid, }
							$http.submit(null, 'bs-contract/renew', { param }).then(data => {
								message.then(f => f.default.success('续签成功'))
								this.refs.modal.close()
								this.fetch(this.model)
							})
						}}
                        onClose = { ()=>this.refs.modal.close() }
                        init    = { form => this.formSubmit = form }
					 />
				</Modal>
				<Modal ref='modal1' title='查看附件' width={648} noFooter>
					<Enclosure uuid={ ids || '' } />
				</Modal>
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= {current => {
						this.setState({data1:current})
						this.setState({selectedKeys:current})
					}}
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
					// sort
					onSort			= { v => $fn.onSort.call(this, v) }
				/>
			</Page>
		)
	}
}