import React from 'react'
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== antd
const message = import('@antd/message')
// const confirm = import('@antd/confirm')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
const Button = $async(()=>import('@antd/button'))
// ===================================================================== component

export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		data1: {},
		submit: [
            { label: '真实姓名',	name: 'salesman_id', type:'select', data:[] },
            { label: '籍贯',		name: 'address' },
            { label: '入职时间',	name: 'entrytime', 	type: 'date', disabled: true },
            { label: '员工编码',	name: 'number', 	disabled: true },
            { label: '年龄',		name: 'age', 		disabled: true },
            { label: '手机号码',	name: 'phone', 		disabled: true },
            { label: '在职状态',	name: 'status', 	type:'select', 	data: [], nameStr:'label', idStr:'value' },
            { label: '银行账号',	name: 'bank_account' },
            { label: '开户行',		name: 'open_bank', },
            { label: '最高学历',	name: 'education' },
            { label: '所属区域',	name: 'area_id', 	type:'select', 	data:[] },
        ],
	}
	real_name= ''
	options = [
		{ label: "在职", 	value: 1 },
		{ label: "离职", 	value: -1 }
	]
	forms = [
		{ label:'人员姓名',		name:'real_name',		},
		{ label:'所属区域',		name:'region_name',		type:'select', 	data:[] },
        { label:'在职状态',		name:'status',			type:'select', 	data: this.options, nameStr:'label', idStr:'value' },
    ]
	model = {}
	componentDidMount(){ 
		const { submit } = this.state
		submit[6].data = this.options
		cacheApi.then(f => {
			$fn.getCache({ // 所属区域
				cache: f.default.bsareaSelect, name: 'name', id: 'uuid', callback: (data) => {
					if ($fn.hasArray(data)) {
						this.forms[1].data = data
						submit[10].data = data
                    } else {
                        $http.submit(null, 'bs-area/select').then(data => {
							this.forms[1].data = data
							submit[10].data = data
							$fn.setCache()
                        })
					}
				}
			})
			$fn.getCache({ // 真实姓名
				cache: f.default.employeeSelect, name: 'name', id: 'uuid', callback: (data) => {
					if ($fn.hasArray(data)) {
						submit[0].data = data
                    } else {
                        $http.submit(null, 'employee/select').then(data => {
							submit[0].data = data
							$fn.setCache()
                        })
					}
				}
			})
		})
		this.fetch()
	}
	fetch = param => $fn.fetch.call(this,'bs-salesman/index', param)
	cols = [
		{ title: '序号', 		field: 'id', 			width:60 },
        { title: '员工编码', 	field: 'empl_name', 	width:120 },
		{ title: '真实姓名', 	field: 'real_name', 	width:120 },
		{ title: '年龄', 		field: 'age', 			width:60 },
		{ title: '籍贯', 		field: 'address', 		width:120 },
        { title: '最高学历', 	field: 'education', 	width:120 },
		{ title: '手机号', 		field: 'phone', 		width:120 },
		{ title: '所属区域', 	field: 'region_name', 	width:120 },
		{ title: '在职状态', 	field: 'status',		width:120,  
			render: ({rows}) => {
			return window.$fn.filterSelect(this.options, rows.status, 'label', 'value')
		} },
		{ title: '操作', 	 	width:120,  			render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='编辑' ghost onClick={()=>{
						const { submit } = this.state
						this.refs.modal.open()
						$http.submit(null,'bs-salesman/info', { param: { uuid: rows.uuid } } ).then(data=>{
                            this.rows = data
							this.isEdit = true
                            $fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
						})
					}}/>
				</div>
			)},
		}
	]
	ButtonGroup = () => {
		return [
			{ label:'添加业务员F1', code:'F1', ghost:true, onClick:()=>{
					this.refs.modal.open()
					this.isEdit = false
					const { submit } = this.state
					submit[0].value = ''
					submit[1].value = ''
					submit[2].value = ''
					submit[3].value = ''
					submit[4].value = ''
					submit[5].value = ''
					submit[6].value = ''
					submit[7].value = ''
					submit[8].value = ''
					submit[9].value = ''
					submit[10].value = ''
					this.setState({ submit })
				}
			},
		]
	}
	render(){
		const { data, data1, pullLoading, pag, submit, selectedKeys } = this.state
		return (
			<Page title='业务员管理' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) }
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
				/>
				{/* 表格 */}
				<Modal ref='modal' title='查看其他' width={648} noFooter>
					<SubmitForm
						modal
                        data = { submit }
                        onChange    = {(v, press, { name, data }) => {
							if (name === 'salesman_id') {
								submit[0].data.map(e => {
									if (e.value === v) {
										submit[2].value = e.entrytime
										submit[3].value = e.number
										submit[4].value = e.age
										submit[5].value = e.phone
										this.real_name = e.name
									}
								})
							}
						} } 
						onSubmit = { v => {
                            if (this.isEdit) {
								const param = {
									...v,
									uuid: this.rows.uuid, 
									id: this.rows.id,
									sort: this.rows.sort,
									created_at: this.rows.created_at,
									comp_id: this.rows.comp_id,
									detp_id: this.rows.detp_id,
									real_name: this.real_name
								}
								$http.submit(null,'bs-salesman/edit',{ param }).then(data=>{
									message.then(f=>f.default.success('编辑成功'))
									this.refs.modal.close()
									this.fetch()
								})
							} else {
								const param = { ...v }
								$http.submit(null, 'bs-salesman/add', { param }).then(data => {
									message.then(f => f.default.success('添加成功'))
									this.refs.modal.close()
									this.fetch()
								})
							}
						}}
                        onClose = { ()=>this.refs.modal.close() }
                        init    = { form => this.formSubmit = form }
					 />
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