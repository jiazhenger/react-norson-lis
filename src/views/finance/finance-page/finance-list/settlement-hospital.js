import React from 'react'
// ===================================================================== utils
import Time from '@utils/time'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
const confirm = import('@antd/confirm')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
const SettHospitalChild = $async(()=>import('./sett-hospital-child'))
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		data1: {}
	}
	forms = [
		{ label:'账期', 	    name:'bill_phase_id',      	type:'select', data:[] },
		{ label:'接收标本日期', name: 'date', 				 names:['start_at','end_at'], type:'date-range' },
        { label:'区域名称', 	name:'region_id', 			 type:'select', data:[] },
        { label:'客户名称', 	name:'hosp_id', 		     type:'select', data:[] },
    ]
	model = {
		start_at: Time.customDate(2, "date"),
		end_at: Time.customDate("current-date"),
	}
	componentDidMount(){
		$fn.dataSave('bill-phase-select-data').then(billPhase => { // 账期
			if($fn.hasArray(billPhase)){
				this.forms[0].data = billPhase
			}else{
				$http.pull(null,'bill-phase/select', {dataName:null}).then(data=>{
					console.log(data)
					this.forms[0].data = data.items
					$fn.dataSave('bill-phase-select-data', data)
				})
			}
		})
		$fn.dataSave('bs-area-select').then(bsArea => { // 区域
			if($fn.hasArray(bsArea)){
				this.forms[2].data = bsArea
			}else{
				$http.pull(null,'bs-area/select', {dataName:null}).then(data=>{
					console.log(data)
					this.forms[2].data = data.items
					$fn.dataSave('bs-area-select', data)
				})
			}
		})
		$fn.dataSave('device').then(local => { // 客户名称
			if($fn.hasArray(local)){
				this.forms[3].data = local
			}else{
				$http.pull(null,'bs-hospital/select', {dataName:null}).then(data=>{
					this.forms[3].data = data.items
					$fn.dataSave('device', data)
				})
			}
		})
		this.fetch()
	}
	// paging
	fetch = param => $fn.fetch.call(this,'bill-hosp/wait', param)
	cols = [
		{ type:'checkbox' },
		{ title: '区域名称',	field: 'region_name', 	width:160 },
		{ title: '客户名称',	field: 'hosp_name', 	width:170 },
		{ title: '账期', 		field: 'phase_name', 	width:170 },
		{ title: '标本数量',	field: 'num',    		width:160 },
		{ title: '标准总价',	field: 'sum_sprice', 	width:160 },
		{ title: '实际总价',	field: 'sum_price', 	width:170 },
	]
	ButtonGroup = () => {
		return [
			{ label:'批量结算', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				confirm.then(f=>{
					f.default({
						msg:'是否确认批量结算？',
						onOk: close => {
							const keys = this.state.data1.map(v=>v.hosp_id)
							const billPhaseId = this.state.data1.map(v=>v.bill_phase_id)
							$http.submit(null,'bill-hosp/settlement', { param: { hosp_ids: keys.join(','), bill_phase_id:billPhaseId} } ).then(data=>{
								message.then(f=>f.default.success('批量结算成功'))
								this.fetch(this.model)
								close()
							})
						}
					})
				})
			}  },
		]
	}
	render(){
		const { data, data1, pullLoading, pag, selectedKeys } = this.state
		return (
			<Page title='账单结算' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange={(v,press)=>$fn.onChange.call(this,v,press)
						// (v, press, { name, data }) => {
						// $fn.onChange.call(this, v, press, () => {
						// 	if (name && name === 'device_id') {
						// 		console.log(data)
						// 		return { device_name: data.name }
						// 	}
						// })
						// }
				 	} 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
					init    	= { form => { form.setFieldsValue({date:[Time.customDate(2, "date"), Time.customDate("current-date")]}) }}
				/>
				{/* 表格 */}
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { current => {
						console.log(current)
						this.setState({data1:current})
						this.setState({selectedKeys:current})
					} }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
					// sort
					onSort			= { v => $fn.onSort.call(this, v) }
				/>
				<SettHospitalChild className='fv rel ex xplr' model={this.model} rowdata={ data1 || [] } />
			</Page>
		)
	}
}