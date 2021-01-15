import React from 'react'
// ===================================================================== utils
import Time from '@utils/time'
import Modal from '@antd/modal'

// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
// const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// const confirm = import('@antd/confirm')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
const SettDetailsChild = $async(() => import('./sett-details-child'))
const BillInfo = $async(()=>import('./bill-info'))

export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		// selectedKeys:[],
		data1: {},
		showmodel:'',
		submit: [
			{label: '结算账期',		name: 'phase_id',	type: 'select', data:[] },
			{label: '用户名',		name: 'account',    },
			{label: '密码',			name: 'password',   },
		],
		specCode: '',
	}
	payTypeOptions = [
		{ label: "全部", value: "" },
        { label: "已结算", value: "45303" },
        { label: "待结算", value: "45302" }
	]
	options = [
		{ label: "正常", value: "1" },
		{ label: "冲抵", value: "2" }
	]
	statusList = []
	forms = [
		{ label:'账期', 	    name:'bill_phase_id',      	type:'select', data:[], mode: 'multiple',required: true, },
		{ label:'条码号', 	    name:'spec_code' },
		{ label:'帐单生成时间',  name: 'date', 				names:['start_at','end_at'], type:'date-range' },
		{ label:'账单状态', 	name:'status', 	            type:'select', data: this.payTypeOptions,   nameStr:'label', idStr:'value' },
        { label:'区域', 		name:'region_id', 			type:'select', data:[] },
        { label:'医院名称', 	name:'hosp_id', 		    type:'select', data:[] },
        { label:'业务员', 		name:'salesman_id', 		type:'select', data:[] },
        { label:'病人姓名', 	name:'patient_name' },
    ]
	model = {
		start_at: Time.customDate(2, "date"),
		end_at: Time.customDate("current-date"),
	}
    async getDataAsync() {
		await $fn.getDisItem({
			code: 45300,
			callback: (data) => {
				this.statusList = data
			}
		}) // 账单状态
	}
	componentDidMount(){
		const { submit } = this.state
		$fn.dataSave('bill-phase-select-data').then(local => { // 账期
			if($fn.hasArray(local)){
				console.log(local)
				this.forms[0].data = local
				submit[0].data = local
			}else{
				$http.pull(null,'bill-phase/select', {dataName:null}).then(data=>{
					console.log(data)
					this.forms[0].data = data.items
					submit[0].data = data.items
					$fn.dataSave('bill-phase-select-data', data)
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
			$fn.getCache({ // 医院
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
			$fn.getCache({ // 业务员
				cache: d.bssalesmanSelect, callback: (data) => {
					if ($fn.hasArray(data)) {
						this.forms[6].data = data
					} else {
						$http.submit(null, 'bs-salesman/select').then(data => {
							this.forms[6].data = data
							$fn.setCache()
						})
					}
				}
			})
		})
		this.getDataAsync()
		this.fetch()
	}
	// paging
	fetch = param => $fn.fetch.call(this,'bill/index', param)
	cols = [
		{ title: "序号",		field: "id", 			width:80, },
		{ title: '接收标本日期',field: 'receive_at',     width:160 },
		{ title: '开票单位',	field: 'organization_name', width:160 },
		{ title: '开票单位编码',field: 'organization_code', width:170 },
		{ title: '姓名', 		field: 'patient_name',  width:80 },
		{ title: '性别', 	    field: 'sex_name',      width:80 },
		{ title: '年龄',        field: 'age',           width:80 },
		{ title: '所属医生', 	field: 'doctor', 		width:100 },
		{ title: '业务员名称',	field: 'salesman_user',	width:100 },
		{ title: '业务区域',	field: 'region_name',	width:100 },
		{ title: '条码号',		field: 'spec_code', 	width:100, render: ({text,rows})=> <span onDoubleClick={()=>{
			this.setState({specCode: text})
			this.refs.modal1.open()
		}}>{text}</span> },
		{ title: '账期', 		field: 'phase_str', 	width:100 },
		{ title: '账单类型', 	field: 'pay_type',      width:100,
			render: ({rows}) => {
				return window.$fn.filterSelect(this.options, rows.pay_type, 'label', 'value')
			}
		},
		{ title: '医院名称',	field: 'hosp_name', 	width:100 },
		{ title: '标准价格',	field: 'sprice',        width:100 },
		{ title: '折扣率',		field: 'percent',	    width:100 },
		{ title: '实际价格',    field: 'price',         width:160 },
		{ title: '折扣金额',    field: 'perprice',	    width:100 },
		{ title: '帐单生成时间',field: 'created_at',	width:100 },
		{ title: '账单状态',	field: 'status',	    width:100, 
			render: ({rows}) => {
				return window.$fn.filterSelect(this.statusList, rows.status, 'name', 'value')
			}
		},
        { title: '备注',		field: 'attribute_name',width:100 },
	]
	ButtonGroup = () => {
		return [
			{ label:'结算', ghost:true, onClick:()=>{
				this.refs.modal.open()
				const { submit } = this.state
				submit[0].value = ''
				submit[1].value = ''
				submit[2].value = ''
				this.setState({ submit })
				this.setState({showmodel: 1})
			} },
			{ label:'反结算', ghost:true, onClick:()=>{
				this.refs.modal.open()
				const { submit } = this.state
				submit[0].value = ''
				submit[1].value = ''
				submit[2].value = ''
				this.setState({ submit })
				this.setState({showmodel: 0})
			} },
		]
	}
	render(){
		const { data, data1, pullLoading, pag, submit, showmodel, specCode } = this.state
		return (
			<Page title='账单信息' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange={(v,press)=>$fn.onChange.call(this,v,press)} 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
					init    	= { form => { form.setFieldsValue({date:[Time.customDate(2, "date"), Time.customDate("current-date")]}) }}
				/>
				<Modal ref='modal' title={showmodel?"结算":"反结算"} width={648} noFooter>
					<SubmitForm
						modal
                        data = { submit }
                        onChange    = {(v, press, { name, data }) => {} }
						onSubmit = { v => {
							const param = { ...v }
							if (showmodel) {
								$http.submit(null, 'bill/settlement', { param }).then(data => {
									message.then(f => f.default.success('操作成功'))
									this.refs.modal.close()
									this.fetch(this.model)
								})
							} else {
								$http.submit(null, 'bill/resettlement', { param }).then(data => {
									message.then(f => f.default.success('操作成功'))
									this.refs.modal.close()
									this.fetch(this.model)
								})
							}
						}}
                        onClose = { ()=>this.refs.modal.close() }
                        init    = { form => this.formSubmit = form }
					 />
				</Modal>
				{/* 表格 */}
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { current => {
						console.log(current)
						this.setState({data1:current})
					} }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
					onSort			= { v => $fn.onSort.call(this, v) }
				/>
				<Modal ref='modal1' title='账单信息' width={1000} noFooter>
					<BillInfo className='fv rel ex xplr' specCode = { specCode || '' } />
				</Modal>
				<SettDetailsChild className='fv rel ex xplr' model={this.model} rowdata={ data1 || [] } />
			</Page>
		)
	}
}