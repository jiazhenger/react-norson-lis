// ===================================================================== 薛玉梅 | 2020-10-19 | 新增文件
import React from 'react'
import Modal from '@antd/modal'

// ===================================================================== global declare
const { $http, $fn, $async } = window 
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const message = import('@antd/message')

// ===================================================================== private component
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
const BillInfo = $async(()=>import('./bill-info'))

export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		rowId: '',
		selectedKeys:[], 
		submit: [
            { label: '标本条码',	name: 'old_spec_code',	},
            { label: '医院名称',	name: 'hosp_name',		},
			{ label: '项目',		name: 'kind_name',	 	},
			{ label: '选择类型',	name: 'pay_type',		type: 'select',		data: this.typeList,   nameStr:'label', idStr:'value' },
			{ label: '价格',		name: 'price',			},
			{ label: '原因',		name: 'reason',			type: 'textarea' },
			{ label: '上传图片',	name: 'pic_path',		type: 'upload', 	params: {modular: 124} },
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
	typeList = [
		{ label: "增加", value: "1" },
		{ label: "减少", value: "2" }
	]
	check = {}
	componentDidMount(){}
	componentWillReceiveProps(props) {
		if (props.rowdata.length > 0) { 
			var len = props.rowdata.length-1
            this.model.hosp_id = props.rowdata[len].hosp_id
			this.model.bill_phase_id = props.rowdata[len].bill_phase_id
			this.model.status = props.rowdata[len].status
            this.model.summary_sn = props.model.summary_sn
			this.fetch(this.model)
		}
	}

	fetch = param => $http.paging(this,'bill/speclists',{ param:{...param, pageSize:this.pageSize, ...this.model}, loading:false } )

	cols = [
		{ title: '条码', 		field: 'old_spec_code', width:120, render: ({text,rows})=> <span onDoubleClick={()=>{
			this.setState({specCode: text})
			this.refs.modal2.open()
		}}>{text}</span> },
		{ title: '账期', 		field: 'phase_str', 	width:120 },
		{ title: '自然项目', 	field: 'category_name',	width:120 },
		{ title: '账单类型', 	field: 'pay_type', 		width:80, 
			render: ({rows}) => {
				return window.$fn.filterSelect(this.options, rows.pay_type, 'label', 'value') 
			}  },
        { title: '医院名称', 	field: 'hosp_name', 	width:120 },
        { title: '项目名称', 	field: 'kind_name', 	width:120 },
		{ title: '标准价格', 	field: 'sprice', 	    width:80 },
        { title: '折扣率', 		field: 'percent', 		width:80 },
		{ title: '实际价格', 	field: 'price', 	    width:80 },
        { title: '折扣金额', 	field: 'perprice', 		width:80 },
		{ title: '帐单生成时间',field: 'created_at', 	width:120 },
		{ title: '账单状态', 	field: 'status', 	    width:80, 
            render: ({rows}) => {
                return window.$fn.filterSelect(this.statusList, rows.status, 'label', 'value') 
            } },
		{ title: '备注', 		field: 'remark', 	    width:120 },
		{ title: '操作', 		field: 'custom', 	    width:180, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='新增账单' ghost className='ml15' onClick={() => {
						this.refs.modal.open()
						const { submit } = this.state
						submit[0].value = ''
						submit[1].value = ''
						submit[2].value = ''
						submit[4].value = ''
						submit[5].value = ''
						submit[6].value = ''
						this.setState({submit})
                    }} />
                    <Button label='查看其它' ghost className='ml15' onClick={() => {
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
		const { data, pullLoading, pag, submit, rowId, specCode } = this.state
		return (
			<div>
				<Modal ref='modal' title='新增账单' width={648} noFooter>
					<SubmitForm
						modal
                        data = { submit }
                        onChange    = {(v, press, { name, data }) => {} }
						onSubmit = { v => {
							console.log(v)
                            $http.submit(null, 'bill/add', { param: { uuid: rowId,...v} }).then(data => {
                                message.then(f => f.default.success('操作成功'))
                                this.refs.modal.close()
                                this.fetch(this.model)
                            })
						}}
                        onClose = { ()=>this.refs.modal.close() }
                        init    = { form => this.formSubmit = form }
					 />
				</Modal>
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
				<Modal ref='modal2' title='账单信息' width={1000} noFooter>
					<BillInfo className='fv rel ex xplr' specCode = { specCode || '' } />
				</Modal>
			</div>
		)
	}
}