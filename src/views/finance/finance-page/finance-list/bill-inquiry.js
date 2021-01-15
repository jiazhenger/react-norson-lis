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
// ===================================================================== component
const BillInquiryChild = $async(()=>import('./bill-inquiry-child'))

export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		data1: {},
	}
	statusList = [
		{ label: "作废", value: "45801" },
		{ label: "正常", value: "45802" }
	]
	forms = [
		{ label:'账期',			name:'summary_sn',		type:'select', data:[] },
        { label:'区域名称',		name:'region_id',		type:'select', data:[] },
        { label:'客户名称',		name:'hosp_id',			type:'select', data:[] },
		{ label:'结算单状态',	name:'status',			type:'select', data:this.statusList, nameStr:'label', idStr:'value' },
	]
	model = {}
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
						this.forms[1].data = data
					} else {
						$http.submit(null, 'bs-area/select').then(data => {
							this.forms[1].data = data
							$fn.setCache()
						})
					}
				}
			})
			$fn.getCache({ // 客户名称
				cache: d.BsHospitalSelect, callback: (data) => {
					if ($fn.hasArray(data)) {
						this.forms[2].data = data
					} else {
						$http.submit(null, 'bs-hospital/select').then(data => {
							this.forms[2].data = data
							$fn.setCache()
						})
					}
				}
			})
		})
		this.fetch()
	}

	fetch = param => $fn.fetch.call(this,'bill-summary/index', param)
	cols = [
		{ type:'checkbox' },
		{ title: '区域', 		field: 'region_name', 	width:120 },
        { title: '客户名称', 	field: 'hosp_name', 	width:120 },
		{ title: '账期', 		field: 'phase_str', 	width:120 },
		{ title: '标本数量', 	field: 'spec_num', 		width:120 },
		{ title: '标准总价', 	field: 'sprice', 		width:120 },
        { title: '折扣率', 		field: 'percent', 		width:120 },
		{ title: '实际总价', 	field: 'price', 		width:120 },
		{ title: '结算时间', 	field: 'created_at', 	width:120 },
		{ title: '结算人', 		field: 'operator_name',	width:120 },
		{ title: '结算单状态', 	field: 'status', 		width:120,  
			render: ({rows}) => {
			return window.$fn.filterSelect(this.statusList, rows.status, 'label', 'value')
		}},
	]
	ButtonGroup = () => {
		return [
			{ label:'反结算', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				confirm.then(f=>{
					f.default({
						msg:'是否确认反结算账单？',
						onOk: close => {
							const keys = this.state.data1.map(v=>v.hosp_id)
							const summary = this.state.data1[0].summary_sn
							$http.submit(null,'bill-hosp/resettlement', { param: { hosp_ids: keys.join(','), summary_sn:summary} } ).then(data=>{
								message.then(f=>f.default.success('反结算成功'))
								this.fetch(this.model)
								close()
							})
						}
					})
				})
			} },
			{ label:'客户账单导出F2', code:'F2', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				confirm.then(f=>{
					f.default({
						msg:'是否导出客户账单?',
						onOk: close => {
							const keys = this.state.data1.map(v=>v.hosp_id)
							$http.submit(null,'bill/endexport', { param: { hosp_ids: keys, summary_sn:this.state.data1[0].summary_sn} } ).then(data=>{
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
	getChildrenMsg = (result, msg) => {
		if (msg.uuid) {
			$http.submit(null,'bill/viewpic', { param: { uuid: msg.uuid } } ).then(data=>{
				this.refs.modal.open()
				const { submit } = this.state
				submit[0].reason = data.reason
				submit[1].img	 = data.img
				this.setState({ submit })
			})
		}
    }
	render(){
		const { data, data1, pullLoading, pag, submit, selectedKeys } = this.state
		return (
			<Page title='已结算账单查询' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) }
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
					onRow			= {current => {
						this.setState({data1:current})
						this.setState({selectedKeys:current})
					}}
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
					// sort
					onSort			= { v => $fn.onSort.call(this, v) }
				/>
				<BillInquiryChild className='fv rel ex xplr' parent={ this } model={this.model} rowdata={ data1 || [] } />
			</Page>
		)
	}
}