import React from 'react'
// ===================================================================== antd

import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window 
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
// ===================================================================== private component
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
const BillInfo = $async(()=>import('./bill-info'))

export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[], 
		submit: [
            { label: '原因',  name: 'reason' },
            { label: '图片',  name: 'img',		type: 'textarea' },
        ],
		specCode: '',
	}
	
	forms = []
	model = {}
	statusList = [
		{ label: "作废", value: "45801" },
		{ label: "正常", value: "45802" }
	]
	options = [
		{ label: "正常", value: "1" },
		{ label: "冲抵", value: "2" }
	]
	check = {}
	componentDidMount(){}
	componentWillReceiveProps(props) {
		if (props.rowdata.length > 0) { 
			var len = props.rowdata.length-1
            this.model.hosp_id = props.rowdata[len].hosp_id
            this.model.summary_sn = props.model.summary_sn
			this.fetch()
		}
	}

	fetch = param => $http.paging(this,'bill/speclists',{ param:{...param, pageSize:this.pageSize, ...this.model}, loading:false } )

	cols = [
		{ title: '条码', 		field: 'old_spec_code', width:120, render: ({text,rows})=> <span onDoubleClick={()=>{
			this.setState({specCode: text})
			this.refs.modal1.open()
		}}>{text}</span> },
		{ title: '账期', 		field: 'phase_str', 	width:120 },
		{ title: '自然项目', 	field: 'category_name',	width:120 },
		{ title: '账单类型', 	field: 'pay_type', 		width:120, 
			render: ({rows}) => {
				return window.$fn.filterSelect(this.options, rows.pay_type, 'label', 'value') 
			}  },
        { title: '医院名称', 	field: 'hosp_name', 	width:120 },
        { title: '项目名称', 	field: 'kind_name', 	width:120 },
		{ title: '标准价格', 	field: 'sprice', 	    width:120 },
        { title: '折扣率', 		field: 'percent', 		width:120 },
		{ title: '实际价格', 	field: 'price', 	    width:120 },
        { title: '折扣金额', 	field: 'perprice', 		width:120 },
		{ title: '帐单生成时间',field: 'created_at', 	width:120 },
		{ title: '账单状态', 	field: 'status', 	    width:120, 
			render: ({rows}) => {
				return window.$fn.filterSelect(this.statusList, rows.status, 'label', 'value') 
			} },
		{ title: '备注', 		field: 'remark', 	    width:120 },
		{ title: '操作', 		field: 'custom', 	    width:120, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='查看其他' ghost className='ml15' onClick={() => {
						this.refs.modal1.open()
						$http.submit(null,'bill/viewpic', { param: { uuid: rows.uuid } } ).then(data=>{
							this.check = data
						})
					}} />
				</div>
			)
		} }
	] 
	render(){
		const { data, pullLoading, pag, specCode } = this.state
		return (
			<div>
				<Modal ref='modal1' title='查看其他' width={648} noFooter>
					<div className='p20 r6px'>
						<div className='pb20 pt20'>
							<span className='dk pr10'>原因:</span>
							<input type='textarea' className=' bor1 h70 ' disabled style={{width: "84%"}} value={this.check.reason} />
						</div>
						<div className='pb20'>
							<span className='dk pr10'>图片:</span>
							<div className='dk bor1 h100 w tc' style={{width: "84%",lineHeight:"100px"}} >{this.check.img||'暂无图片'}</div>
						</div>
					</div>
				</Modal>
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { v => { this.setState({ selectedKeys: v }) } }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
				/>
				<Modal ref='modal1' title='账单信息' width={1000} noFooter>
					<BillInfo className='fv rel ex xplr' specCode = { specCode || '' } />
				</Modal>
			</div>
		)
	}
}