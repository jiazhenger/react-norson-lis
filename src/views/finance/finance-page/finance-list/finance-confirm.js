import React from 'react'
// ===================================================================== utils
import Time from '@utils/time'
import Modal from '@antd/modal'
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
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
const FinanceConfirmChild = $async(()=>import('./finance-confirm-child'))
const BillInfo = $async(()=>import('./bill-info'))

export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		data1: {},
		submit: [
            { label: '账期',	    name: 'bill_phase_id',	required: true,	  type: 'select',	data: [], nameStr: 'name', idStr:'value', width: '100%'},
            { label: '开始时间',	name: 'start_at',		type:'date-time', after:true },
			{ label: '结束时间',	name: 'end_at',     	type:'date-time', after:true },
        ],
		specCode: '',
		statusList: []
	}
	payTypeOptions = [
        { label: "待审核", 		 value: " 45301" },
		{ label: "业务员待确认", value: " 45305" }
	]
	forms = [
		{ label:'账期', 	    name:'bill_phase_id',	type:'select', data:[] },
		{ label:'条码号', 	    name:'spec_code' },
		{ label:'账单生成时间', name: 'date', 			names:['start_at','end_at'], type:'date-range' },
        { label:'医院名称', 	name:'hosp_id', 		type:'select', data:[] },
		{ label:'账单状态', 	name:'status', 	        type:'select', data: this.payTypeOptions,   nameStr:'label', idStr:'value' },
        { label:'显示状态异常', name:'status_salesman',	type:'checkbox' },
    ]
	model = {
		start_at: Time.customDate(2, "date"),
		end_at: Time.customDate("current-date"),
	}
	options= [
		{ label: "正常", value: "1" },
		{ label: "冲抵", value: "2" }
	]
	async getDataAsync() {
		await $fn.getDisItem({
			code: 45300,
			callback: (data) => {
				console.log(data);
				this.setState({statusList:data})
			}
		}) // 账单状态
	}
	componentDidMount(){
        const { submit } = this.state
		$fn.dataSave('bill-summary-select-data').then(local => { // 账期
			if($fn.hasArray(local)){
				this.forms[0].data = local
				submit[0].data	   = local
			}else{
				$http.pull(null,'bill-summary/select', {dataName:null}).then(data=>{
					this.forms[0].data = data.items
					submit[0].data = data.items
					$fn.dataSave('bill-summary-select-data', data)
				})
			}
		})
		$fn.dataSave('bs-hospital-select-data').then(hospital => { // 医院名称
			if($fn.hasArray(hospital)){
				this.forms[3].data = hospital
			}else{
				$http.pull(null,'bs-hospital/select', {dataName:null}).then(data=>{
					this.forms[3].data = data.items
					$fn.dataSave('bs-hospital-select-data', data)
				})
			}
		})
		this.getDataAsync()
		this.fetch(this.model)
	}
	fetch = param => $fn.fetch.call(this,'bill/auditlists', param)
	cols = [
		{ type:'checkbox' },
		{ title: '序号',		field: 'id', 	    	width:60 },
		{ title: '条码号',		field: 'spec_code', 	width:100, render: ({text,rows})=> <span onDoubleClick={()=>{
			this.setState({specCode: text})
			this.refs.modal1.open()
		}}>{text}</span> },
		{ title: '账期',		field: 'phase_str', 	width:100 },
		{ title: '账单类型', 	field: 'pay_type',      width:80, render: ({rows}) => {
			return window.$fn.filterSelect(this.options, rows.pay_type, 'label', 'value')
		}},
		{ title: '医院名称',	field: 'hosp_name', 	width:100 },
		{ title: '业务员',		field: 'salesman_user',	width:100 },
		{ title: '标准价格',	field: 'sprice',        width:100 },
		{ title: '折扣率',		field: 'percent',	    width:100 },
		{ title: '实际价格',    field: 'price',         width:100 },
		{ title: '创建时间',	field: 'created_at',    width:160 },
		{ title: '账单状态',	field: 'status',	    width:100, 
		render: ({rows}) => {
			const { statusList } = this.state
			return window.$fn.filterSelect(statusList, rows.status, 'name', 'value')
		} },
        { title: '备注',		field: 'remark',		width:100 },
	]
	ButtonGroup = () => {
		return [
			{ label:'确认', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				confirm.then(f=>{
					f.default({
						msg:'是否确认账单？',
						onOk: close => {
							const ids = this.state.data1.map(v=>v.hosp_id)
							$http.submit(null,'bill/audit', { param: { ids: ids.join(',')} } ).then(data=>{
								message.then(f=>f.default.success('确认成功'))
								this.fetch(this.model)
								close()
							})
						}
					})
				})
			} },
			{ label:'一键审核', onClick:()=>{
				this.refs.modal.open()
				const { submit } = this.state
				submit[0].value = ''
				submit[1].value = ''
				submit[2].value = ''
				this.setState({ submit })
            }
			},
		]
	}
	render(){
		const { data, data1, pullLoading, pag, submit, specCode } = this.state
		return (
			<Page title='待确认账单' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= {(v,press)=>$fn.onChange.call(this,v,press)} 
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
						this.setState({data1:current})
						this.setState({selectedKeys:current})
					} }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
					// sort
					onSort			= { v => $fn.onSort.call(this, v) }
				/>
				<Modal ref='modal' title='一键审核' width={648} noFooter>
					<SubmitForm
						modal
                        data = { submit }
                        onChange    = {(v, press, { name, data }) => {
                            const { submit } = this.state;
                            // if (name === 'device_id') {
                            //     this.deviceInfo = submit[0].data.filter(i => i.value === v)
                                if ($fn.hasArray(this.deviceInfo)) {
                                    const d = this.deviceInfo[0]
                                    const form = {
                                        bill_phase_id: d.bill_phase_id,
                                        start_at: d.start_at,
                                        end_at: d.end_at,
                                    }
                                    this.formSubmit.setFieldsValue({...form})
                                }
                            // }
						} } 
						onSubmit = { v => {
                            const param = { ...v }
                            $http.submit(null, 'bill/auditall', { param }).then(data => {
                                message.then(f => f.default.success('审核成功'))
                                this.refs.modal.close()
                                this.fetch(this.model)
                            })
						}}
                        onClose = { ()=>this.refs.modal.close() }
                        init    = { form => this.formSubmit = form }
					 />
				</Modal>
				<Modal ref='modal1' title='账单信息' width={1000} noFooter>
					<BillInfo className='fv rel ex xplr' specCode = { specCode || '' } />
				</Modal>
				<FinanceConfirmChild className='fv rel ex xplr' model={this.model} rowdata={ data1 || [] } />
			</Page>
		)
	}
}