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
		sspecCode: '',
	}
	statusList = []
	model ={
		hosp_id: "",
		status: "",
		start_at: "",
		end_at: "",
		spec_code: "",
		bill_phase_id: [],
		region_id: "",
		patient_name: "",
		item_name: "",
		show_del:"",
		type: "my"
	}
	options = [
		{ label: "正常", value: "1" },
		{ label: "冲抵", value: "2" }
	]
	forms = [
		{ label:'账期',			name:'summary_sn',	type:'select', 	data:[] },
        { label:'条码号',		name:'spec_code',	},
        { label:'接收标本日期',	name:'date', 		type:'date-range',names:['start_at','end_at'] },
        { label:'账单状态',		name:'status',		type:'select', 	data:[] },
        { label:'区域',			name:'region_id',	type:'select', 	data:[] },
        { label:'医院名称',		name:'hosp_id',		type:'select', 	data:[] },
        { label:'病人姓名',		name:'patient_name',},
        { label:'项目名称',		name:'item_name',	},
        { label:'显示作废账单',	type:'checkbox', },
	]
	async getDataAsync() { // 账单状态
		await $fn.getDisItem({
			code: 45300,
			callback: (data) => {
				console.log(data);
				// this.statusList = data
				this.forms[3].data = data
			}
		})
	}
	componentDidMount(){
		$fn.dataSave('bill-summary-select-data').then(local => { // 账期
			if($fn.hasArray(local)){
				this.forms[0].data = local
			}else{
				$http.pull(null,'bill-summary/select', {dataName:null}).then(data=>{
					console.log(data)
					this.forms[0].data = data.items
					$fn.dataSave('bill-summary-select-data', data)
				})
			}
		})
		cacheApi.then(f => {
            const d = f.default
			$fn.getCache({ // 区域
				cache: d.bsareaSelect, callback: (data) => {
					if ($fn.hasArray(data)) {
						this.forms[4].data = data
					} else {
						$http.submit(null, 'bs-area/select').then(data => {
							this.forms[4].data = data
							$fn.setCache()
						})
					}
				}
			})
			$fn.getCache({ // 客户名称
				cache: d.BsHospitalSelect, callback: (data) => {
					if ($fn.hasArray(data)) {
						this.forms[5].data = data
					} else {
						$http.submit(null, 'bs-hospital/select').then(data => {
							this.forms[5].data = data
							$fn.setCache()
						})
					}
				}
			})
		})
		this.getDataAsync()
		this.fetch(this.model)
	}

	fetch = param => $fn.fetch.call(this,'bill/salesmanauditlists', param)
	cols = [
		{ title: '账单编号', 		field: 'order_sn', 			width:120 },
        { title: '条码号', 			field: 'old_spec_code', 	width:120, render: ({text,rows})=> <span onDoubleClick={()=>{
			this.setState({specCode: text})
			this.refs.modal1.open()
		}}>{text}</span> },
		{ title: '接收标本日期', 	field: 'receive_at', 		width:120 },
		{ title: '开票单位', 		field: 'organization_name', width:120 },
		{ title: '开票单位编码', 	field: 'organization_code', width:120 },
        { title: '姓名', 			field: 'patient_name', 		width:100 },
		{ title: '性别', 			field: 'sex_name', 			width:80 },
		{ title: '年龄', 			field: 'age', 				width:60 },
		{ title: '所属医生', 		field: 'doctor',			width:120 },
		{ title: '业务员名称', 		field: 'salesman_user', 	width:120 },
        { title: '账期', 			field: 'phase_str', 		width:120 },
		{ title: '自然项目', 		field: 'parent_kind_name', 	width:120 },
		{ title: '账单类型', 		field: 'pay_type',			width:120,  
			render: ({rows}) => {
			return window.$fn.filterSelect(this.options, rows.pay_type, 'label', 'value')
		} },
		{ title: '医院名称', 		field: 'hosp_name', 		width:120 },
        { title: '项目名称', 		field: 'kind_name', 		width:120 },
		{ title: '标准价格', 		field: 'sprice', 			width:120 },
		{ title: '实际价格', 		field: 'price', 			width:120 },
		{ title: '折扣率', 			field: 'percent',			width:120 },
		{ title: '折扣金额', 		field: 'perprice', 			width:120,  },
		{ title: '帐单生成时间', 	field: 'created_at', 		width:120,  },
		{ title: '账单状态', 		field: 'status', 			width:120,  },
		{ title: '备注', 			field: 'attribute_name', 	width:120,  },
		{ title: '操作', 			width:120, 	render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='查看操作记录' ghost onClick={()=>{
						this.refs.modal.open()
					}}/>
				</div>
			)
		}},
	]
	ButtonGroup = () => {
		return [
			{ label:'导出', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				confirm.then(f=>{
					f.default({
						msg:'是否导出我的财务账单?',
						onOk: close => {
							$http.submit(null,'bill/salesmanauditlists', { param: { export: 1, ...this.model} } ).then(data=>{
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
		const { data, data1, pullLoading, pag, specCode } = this.state
		console.log(data)
		return (
			<Page title='我的财务账单' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) }
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
				/>
				{/* 表格 */}
				<Modal ref='modal' title='查看操作记录' width={1000} noFooter>
					<OperationRecord model={this.model} rowdata={ data1 || [] } />
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
				<Modal ref='modal1' title='账单信息' width={1000} noFooter>
					<BillInfo className='fv rel ex xplr' specCode = { specCode || '' } />
				</Modal>
			</Page>
		)
	}
}