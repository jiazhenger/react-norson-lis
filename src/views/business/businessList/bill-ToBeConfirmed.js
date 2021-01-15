import React from 'react'
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const message = import('@antd/message')
const confirm = import('@antd/confirm')
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
const Button = $async(()=>import('@antd/button'))
// ===================================================================== component
const OperationRecord = $async(()=>import('./child/operation-record'))
const BillInfo = $async(()=>import('../../finance/finance-page/finance-list/bill-info'))

export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		data1: {},
		bill_id: '',
		submit: [
            { label: '异常状态',	name: 'type', 	type: 'select', data: [] },
			{ label: '价格',		name: 'price',  },
			{ label: '异常备注',	name: 'remark', type: 'textarea' },
			{ label: '图片',		name: 'pic_path',type: 'upload', params: {modular: 117} }
		],
		sspecCode: '',
	}
	options = [
		{ label: "正常", value: "1" },
		{ label: "冲抵", value: "2" }
	]
	forms = [
        { label:'主条码号',		name:'spec_code',		},
        { label:'医院',			name:'hosp_id',		type:'select', 	data:[] },
        { label:'区域',			name:'region_id',	type:'select', 	data:[] },
		{ label:'账期',			name:'summary_sn',	type:'select', 	data:[] },
        { label:'接收标本日期',	name:'date', 		type:'date-range',names:['start_at','end_at'] },
		{ label:'账单生成时间',	name:'date', 		type:'date-range',names:['bill_start_at','bill_end_at'] },
	]
	model = {}
	async getDataAsync() { // 账单状态
		await $fn.getDisItem({
			code: 63000,
			callback: (data) => {
				console.log(data);
				const {submit} = this.state
				submit[0].data = data
			}
		})
	}
	componentDidMount(){
		$fn.dataSave('bill-summary-select-data').then(local => { // 账期
			if($fn.hasArray(local)){
				this.forms[3].data = local
			}else{
				$http.pull(null,'bill-summary/select', {dataName:null}).then(data=>{
					this.forms[3].data = data.items
					$fn.dataSave('bill-summary-select-data', data)
				})
			}
		})
		cacheApi.then(f => {
            const d = f.default
			$fn.getCache({ // 客户名称
				cache: d.BsHospitalSelect, callback: (data) => {
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
			$fn.getCache({ // 区域
				cache: d.bsareaSelect, callback: (data) => {
					if ($fn.hasArray(data)) {
						this.forms[2].data = data
					} else {
						$http.submit(null, 'bs-area/select').then(data => {
							this.forms[2].data = data
							$fn.setCache()
						})
					}
				}
			})
		})
		this.fetch()
		this.getDataAsync()
	}

	fetch = param => $fn.fetch.call(this,'bill/salesmanauditlists', param)
	cols = [
		{ title: '账单编号', 	field: 'order_sn', 		width:120 },
		{ title: '账期', 		field: 'phase_str', 	width:120 },
		{ title: '条码号', 		field: 'old_spec_code', width:120, render: ({text,rows})=> <span onDoubleClick={()=>{
			this.setState({specCode: text})
			this.refs.modal2.open()
		}}>{text}</span> },
        { title: '标本接收时间', field: 'receive_at', 	width:120 },
		{ title: '账单类型', 	field: 'pay_type', 		width:120,
			render: ({rows}) => {
				return window.$fn.filterSelect(this.options, rows.pay_type, 'label', 'value')
		} },
        { title: '医院名称', 	field: 'hosp_name', 	width:120 },
		{ title: '自然项目', 	field: 'parent_kind_name',width:120 },
        { title: '项目名称', 	field: 'kind_name', 	width:120 },
		{ title: '业务员', 		field: 'salesman_user', width:120 },
		{ title: '标准总价', 	field: 'sprice', 		width:120 },
        { title: '折扣率', 		field: 'percent', 		width:120 },
		{ title: '实际价格', 	field: 'price', 		width:120 },
		{ title: '折扣金额', 	field: 'perprice', 		width:120 },
		{ title: '账单生成', 	field: 'created_at', 	width:120 },
		{ title: '接收标本', 	field: 'sp_check_time',	width:120 },
		{ title: '账单状态', 	field: 'status_name', 	width:120 },
		{ title: '备注', 		field: 'attribute_name', width:120 },
	]
	validateServiceName = (value, text, callback) => {
		const { submit, data1 } = this.state
		if (callback.name == 'type' && value == '63003') {
			console.log(222);
			submit[1].value = data1.sprice
			submit[1].disabled = true
			this.forceUpdate()
		// } else if (callback.name == 'type'&& value !== '63003') {
		// 	console.log(111);
		// 	submit[1].value = ''
		// 	submit[1].disabled = false
		// 	this.forceUpdate()
		}
		console.log(submit);
	}
	ButtonGroup = () => {
		return [
			{ label:'确定', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				confirm.then(f=>{
					f.default({
						msg:'是否确定',
						onOk: close => {
							const keys = this.state.data1.map(v=>v.hosp_id)
							const summary = this.state.data1[0].summary_sn
							$http.submit(null,'bill/salesmannormal', { param: { hosp_ids: keys.join(','), summary_sn:summary} } ).then(data=>{
								message.then(f=>f.default.success('反结算成功'))
								this.fetch(this.model)
								close()
							})
						}
					})
				})
			} },
			{ label:'操作详情', ghost:true, disabled:!this.state.data1.uuid, onClick:()=>{
				this.refs.modal.open()
				const { data1 } = this.state
				this.setState({ bill_id: data1.uuid})
			} },
			{ label:'账单异常', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				this.refs.modal1.open()
			} },
			{ label:'导出', code:'F2', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				confirm.then(f=>{
					f.default({
						msg:'是否导出?',
						onOk: close => {
							const keys = this.state.data1.map(v=>v.hosp_id)
							$http.submit(null,'bill/salesmanauditlists', { param: { hosp_ids: keys, summary_sn:this.state.data1[0].summary_sn} } ).then(data=>{
								message.then(f=>f.default.success('导出成功'))
								window.location.href = data.url;
								close()
							})
						}
					})
				})
			} },
		]
	}
	render(){
		const { data, data1, pullLoading, pag, submit, specCode, bill_id } = this.state
		return (
			<Page title='待确认账单' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) }
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
				/>
				{/* 表格 */}
				<Modal ref='modal' title='操作详情' width={1000} noFooter>
					<OperationRecord bill_id={bill_id||''} />
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
				<Modal ref='modal1' title='异常账单' width={648} noFooter>
					<SubmitForm
						modal
						data = { submit }
						onChange    = {(v, press, { name, data }) => this.validateServiceName(v, press, { name, data })}
						// {
						// 	const { submit } = this.state;
						// 	if (name == 'type' && v == '63003') {
						// 		console.log(222);
						// 		submit[1].value = data1.sprice
						// 		submit[1].disabled = true
						// 	} else if (name == 'type'&& v !== '63003') {
						// 		console.log(111);
						// 		submit[1].value = ''
						// 		submit[1].disabled = false
						// 	}
						// 	console.log(submit);
						// } } 
						onSubmit = { v => { // 还未完成
							console.log(v);
							console.log(submit);
							if (!v.pic_path) {
								v.pic_path = ''
							}
							const param = { 
								...v,
								id: data1.uuid,
								old_spec_code: data1.old_spec_code
							}
							$http.submit(null, 'bill/salesmanabnormal', { param }).then(data => {
								message.then(f => f.default.success('保存成功'))
								this.refs.modal1.close()
								this.fetch(this.model)
							})
						}}
						onClose = { ()=>this.refs.modal1.close() }
						init    = { form => this.formSubmit = form }
					/>
				</Modal>
				<Modal ref='modal2' title='账单信息' width={1000} noFooter>
					<BillInfo className='fv rel ex xplr' specCode = { specCode || '' } />
				</Modal>
			</Page>
		)
	}
}