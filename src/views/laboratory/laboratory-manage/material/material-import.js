import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const message = import('@antd/message')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		deviceStadius:[],
		submit: [
			{ label: '物料编号',	name: 'mate_number',		required: true},
			{ label: '物料名称',	name: 'mate_name',		required: true},
			{ label: '物料分类',	name: 'mate_type',          required: true,		type: 'select',	    data: [] },
			{ label: '审核人',		name: 'reviewer',			required: true},
			{ label: '采购数量',	name: 'buy_qty',    		required: true},
			{ label: '采购人',		name: 'buy_user',   		required: true},
			{ label: '采购时间',	name: 'buy_date',   		required: true,     type:'date-time',   after:true},
            // { label: '生产厂家',	name: 'mate_factory_id',	type: 'select',	    data: []},
            { label: '生产厂家',	name: 'mate_factory_id'},
            { label: '单位',		name: 'unit',		        required: true,		type: 'select',	    data: []},
            { label: '入库批次号',	name: 'batch_number',		required: true},
			{ label: '保质期',		name: 'shelf_life',		    required: true},
		]
	}
	forms = [
		{ label:'物料编号',     name:'mate_number'},
		{ label:'物料名称',     name:'mate_name'},
        { label:'物料分类',     name:'mate_type',       type:'select',      data:[]},
        { label:'批次号',       name:'batch_number'},
        { label:'采购人',       name:'buy_user'},
        { label: '采购时间',    name:'date',			type:'date-range',	names:['start_date','end_date'], value:[] },
	]
	model = {}
	componentDidMount(){
		const { submit } = this.state
		// 物料分类
        $fn.getDisItem({
			code: 26000,
			callback: (data) => {
                this.forms[2].data = data
                submit[2].data = data
            }
        })
        // 单位
        $fn.getDisItem({
			code: 22000,
			callback: (data) => {
                submit[8].data = data
            }
        })
        this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'material-in/index', param)
	// table
	cols = [
		{ title: '物料名称', 	field: 'mate_name' },
		{ title: '物料编号', 	field: 'mate_number'},
		{ title: '物料类型', 	field: 'mate_type_name'},
		{ title: '单位',        field: 'unit_name'},
		{ title: '采购人',      field: 'buy_user'},
		{ title: '审核人',      field: 'reviewer'},
		{ title: '采购数量', 	field: 'buy_qty'},
		{ title: '批次号',      field: 'batch_number'},
		{ title: '购买时间', 	field: 'buy_date', align:'tc' },
		{ title: '保质期',      field: 'shelf_life'},
	]
	ButtonGroup = () => {
		return [
			{ label:'添加 F2', code:'F2', onClick:()=>{
				this.refs.modal.open()
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
				this.isEdit = false
				this.setState({ submit })
			} }
		]
	}
	render(){
		const { data, pullLoading, pag, submit } = this.state
		return (
			<Page title='物料入库批次列表' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onAdd		= { this.onAdd } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
				/>
				{/* 表格 */}
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { v => this.setState({ selectedKeys: v }) }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
				/>
				<Modal ref='modal' title={this.isEdit ? '编辑' : '添加'} width={648} noFooter>
					<SubmitForm
						modal
						data = { submit }
						onSubmit = { v => {
							if (this.isEdit) {
							} else {
								const param = { ...v }
								$http.submit(null, 'material-in/add', { param }).then(data => {
									message.then(f => f.default.success('添加成功'))
									this.refs.modal.close()
									this.fetch(this.model)
								})
							}
							
						}}
						onClose = { ()=>this.refs.modal.close() }
					 />
				</Modal>
			</Page>
		)
	}
}