import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== 页面变量
const conditionOptions = [
    { name: "小于", value: "<" },
    { name: "大于", value: ">" },
    { name: "等于", value: "=" }
  ]
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
        selectedKeys:[],
        submit: [
            { label: '物料编号',	    name: 'mate_number',        required: true },
            { label: '物料名称',	    name: 'mate_number',        required: true },
            { label: '物料分类',		name: 'mate_type',          required: true,     type: 'select',     data: [] },
			{ label: '描述',			name: 'mate_content',       type: 'textarea' }
        ],
	}
	forms = [
		{ label: '物料编号',        name:'mate_number'},
		{ label: '输入物料名称',    name:'mate_name'},
		{ label: '物料分类',        name:'mate_type',       type:'select', data: []},
        { label: '未使用量',        name:'condition',       type:'select', data: []},
        { label: '',               name:'unuse_qty'},
        { label: '最后采购时间',    name:'date',			type:'date-range',	names:['start_date','end_date'], value:[] },
	]
    model = {}
	componentDidMount(){
        const { submit } = this.state
        this.forms[3].data = conditionOptions
        // 物料分类
        $fn.getDisItem({
			code: 26000,
			callback: (data) => {
                this.forms[2].data = data
                submit[2].data = data
            }
        })
		this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'material/index', param)
	// table
	cols = [
		{ title: '物料名称',        field: 'mate_name', 	        width: 130 },
		{ title: '物料编号',		field: 'mate_number',		    width: 100 },
		{ title: '物料类型', 		field: 'mate_type_name',        width: 80 },
		{ title: '单位',            field: 'unit_name',             width: 80 },
		{ title: '总量',            field: 'total',                 width: 80 },
		{ title: '未使用量', 		field: 'unuse_qty',             width: 80 },
		{ title: '使用量',          field: 'use_qty',               width: 80 },
		{ title: '过期量',          field: 'expire_qty',            width: 80 },
		{ title: '即将过期量', 		field: 'coming_soon_qty',	    width: 80 },
		{ title: '保质期',          field: 'shelf_life',            width: 100 },
		{ title: '最后采购时间',    field: 'updated_at',	        width: 160,         align: 'tc' },
		{ title: '操作', align:'tc', width: 110, render:({rows})=>{
			return (
				<div className='plr5'>
                    <Button label='编辑' ghost className='ml15' onClick={() => {
						const { submit } = this.state
						$http.submit(null, 'material/info', { param: { uuid: rows.uuid } }).then(data => {
							this.rows = data
                            this.isEdit = true
                            $fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
                            this.refs.modal.open()
                        })
					} } />
				</div>
			)
		}},
    ]
	render(){
		const { data, pullLoading, pag, submit } = this.state
		return (
			<Page title='物料列表'>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
                    onChange    = {(v, press, { name, data }) => $fn.onChange.call(this,v,press) }
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
				<Modal ref='modal' title='编辑' width={648} noFooter>
                <SubmitForm
                    modal
                    data		= { submit }
                    onChange    = {(v, press, { name, data }) => {} }
                    onSubmit	= { v => {
                        if (this.isEdit) {
                            const param = { ...this.rows, ...v }
                            $http.submit(null, 'material/edit', { param }).then(data => {
                                message.then(f => f.default.success('修改成功'))
                                this.refs.modal.close()
                                this.fetch()
                            })
                        }
                    }}
                    onClose		= { ()=>this.refs.modal.close() }
                    init        = { form => this.form = form }
                    />
				</Modal>
			</Page>
		)
	}
}