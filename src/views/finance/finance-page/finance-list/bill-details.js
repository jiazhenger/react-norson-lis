import React from 'react'
// ===================================================================== global declare
import Time from '@utils/time'
import Modal from '@antd/modal'
const { $http, $fn, $async } = window
const cacheApi = import('@/private/api/cacheApi')
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
const BillDetailsTable = $async(()=>import('./bill-details-table'))
const BillInfo = $async(()=>import('./bill-info'))

export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		data1: [],
		rowId: '',
		submit: [
            { label: '条码号',	    name: 'spec_code',		disabled: true },
            { label: '当前账期',	name: 'phase_str',		disabled: true },
			{ label: '修改后账期',	name: 'phase_id',		type:'select',		data:[] },
		],
		specCode: '',
	}
	payTypeOptions = [
        { label: "财务待审核", 	value: "45301" },
        { label: "财务待结算", 	value: "45302" },
        { label: "财务已结算", 	value: "45303" },
        { label: "已作废", 	   	value: "45304" },
        { label: "业务员待审核",value: "45305" }
	]
	options= [
		{ label: "正常", value: "1" },
		{ label: "冲抵", value: "2" }
	]
	forms = [
		{ label:'账期', 	    name:'bill_phase_id',      	type:'select', data:[] },
		{ label:'条码号', 	    name:'spec_code' },
		{ label:'接收标本日期', name: 'date', 				names:['start_at','end_at'], type:'date-range' },
		{ label:'账单状态', 	name:'status', 	            type:'select', data: this.payTypeOptions,   nameStr:'label', idStr:'value' },
        { label:'区域', 		name:'region_id', 			type:'select', data:[] },
        { label:'医院名称', 	name:'hosp_id', 		    type:'select', data:[] },
        { label:'业务员', 		name:'salesman_id', 		type:'select', data:[] },
        { label:'病人姓名', 	name:'patient_name' },
		{ label:'项目名称', 	name:'item_name' },
    ]
	model = {}
	componentDidMount(){
		const { submit } = this.state
		$fn.dataSave('bill-phase-select-data').then(local => { // 账期
			if($fn.hasArray(local)){
				this.forms[0].data = local
				submit[2].data = local
			}else{
				$http.pull(null,'bill-phase/select', {dataName:null}).then(data=>{
					this.forms[0].data = data.items
					submit[2].data = data.items
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
			$fn.getCache({ // 医院名称
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
		this.fetch()
	}
	
	fetch = param => $fn.fetch.call(this,'bill/speclists', param)

	cols = [
		{ title: '账单编号',	field: 'order_sn', 	    	width:160 },
		{ title: '条码号',		field: 'old_spec_code', 	width:100, render: ({text,rows})=> <span onDoubleClick={()=>{
			this.setState({specCode: text})
			this.refs.modal2.open()
		}}>{text}</span>
		},
		{ title: '接收标本日期',field: 'receive_at',    	width:160 },
		{ title: '开票单位',	field: 'organization_name', width:160 },
		{ title: '开票单位编码',field: 'organization_code', width:170 },
		{ title: '姓名', 		field: 'patient_name',  	width:80 },
		{ title: '性别', 	    field: 'sex_name',      	width:80 },
		{ title: '年龄',        field: 'age',           	width:80 },
		{ title: '所属医生', 	field: 'doctor', 			width:100 },
		{ title: '业务员名称',	field: 'salesman_user',		width:100 },
		{ title: '账期', 		field: 'phase_str', 		width:100 },
		{ title: '自然项目', 	field: 'parent_kind_name',  width:100 },
		{ title: '账单类型', 	field: 'pay_type',      	width:80, render: ({rows})=> {
			return window.$fn.filterSelect(this.options, rows.pay_type, 'label', 'value') 
		} },
		{ title: '医院名称',	field: 'hosp_name', 		width:100 },
		{ title: '项目名称', 	field: 'kind_name',     	width:100 },
		{ title: '实验科室',	field: 'project_parent_name',width:100 },
		{ title: '送检科室',	field: 'department_name',	width:100 },
		{ title: '标准价格',	field: 'sprice',        	width:100 },
		{ title: '实际价格',    field: 'price',        	 	width:100 },
		{ title: '折扣率',		field: 'percent',	    	width:100 },
		{ title: '折扣金额',    field: 'perprice',	    	width:100 },
		{ title: '帐单生成时间',field: 'created_at',		width:100 },
		{ title: '账单状态',	field: 'status',	    	width:80,  render: ({rows}) => {
			return window.$fn.filterSelect(this.payTypeOptions, rows.status, 'label', 'value') 
		} },
        { title: '备注',		field: 'attribute_name',	width:100 },
        { title: '操作', 		align:'tc', 				width:100, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='操作详情' ghost onClick={() => {
						this.refs.modal1.open()
						this.setState({rowId:rows.uuid})
					}}/>
				</div>
			)
		}},
	]
	ButtonGroup = () => {
		return [
			{ label:'修改账期', ghost:true, disabled:this.state.data1.length===0, onClick:()=>{
				this.refs.modal.open()
				const { submit } = this.state
				submit[0].value = this.state.data1.old_spec_code
				submit[1].value = this.state.data1.phase_str
				submit[2].value = ''
				this.setState({ submit })
            }}
		]
	}
	render(){
		const { data, pullLoading, pag, submit, rowId, specCode } = this.state
		return (
			<Page title='账单明细' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange={(v, press, { name, data }) => { } } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
					init    	= { form => { form.setFieldsValue({date:[Time.customDate(2, "date"), Time.customDate("current-date")]}) }}
				/>
				<Modal ref='modal' title='修改账期' width={648} noFooter>
					<SubmitForm
						modal
                        data = { submit }
                        onChange    = {(v, press, { name, data }) => {
                            const { submit } = this.state;
						} } 
						onSubmit = { v => {
                            const param = { ...v }
                            $http.submit(null, 'bill/changephase', { param }).then(data => {
                                message.then(f => f.default.success('审核成功'))
                                this.refs.modal.close()
                                this.fetch(this.model)
                            })
						}}
                        onClose = { ()=>this.refs.modal.close() }
                        init    = { form => this.formSubmit = form }
					 />
				</Modal>
				<Modal ref='modal1' title='操作详情' width={900} noFooter>
					<BillDetailsTable className='fv rel ex xplr' bill_id = { rowId } />
				</Modal>
				<Modal ref='modal2' title='账单信息' width={1000} noFooter>
					<BillInfo className='fv rel ex xplr' specCode = { specCode || '' } />
				</Modal>
				{/* 表格 */}
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { current => { this.setState({data1:current}) } }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
					onSort			= { v => $fn.onSort.call(this, v) }
				/>
			</Page>
		)
	}
}