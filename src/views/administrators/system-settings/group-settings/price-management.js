import React from 'react'
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// ===================================================================== global template
const Text = $async(()=>import('@tp/text'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== 页面常量
const statusOption = [
    { name: '启用', value: '1' },
    { name: '禁用', value: '-1' },
    { name: '待开启', value: '0' }
]
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
        selectedKeys:[],
        submit: [
            { label: '物价代码',    	name: 'price_code'},
            { label: '项目名称',    	name: 'item_name',			required: true},
            { label: '标准价格',    	name: 'price',				required: true},
            { label: '三甲医院价格',    name: 'hosp_price_ta',		required: true},
            { label: '三乙医院价格',    name: 'hosp_price_tb',		required: true},
            { label: '二甲医院价格',    name: 'hosp_price_sa',		required: true},
            { label: '二乙医院价格',    name: 'hosp_price_sb',		required: true},
            { label: '检测方法',    	name: 'detection_method',	required: true,			type: 'select',		data: []},
			{ label: '助记码',			name: 'qt_item_code'},
            { label: '物价状态',		name: 'enabled',			required: true,			type: 'select', 	data: []},
            { label: '排序',			name: 'sort',				required: true},
            { label: '项目内涵',		name: 'extend1',			full: true,				width: '100%',		type: 'textarea'},
            { label: '除外内容',		name: 'extend2',			full: true,				width: '100%',		type: 'textarea'},
            { label: '备注',			name: 'remark',				full: true,				width: '100%',		type: 'textarea'},
        ]
	}
	forms = [
		{ label:'状态',		name:'enabled',     type: 'select',     data: []},
		{ label:'物价代码', name:'price_code'},
		{ label:'项目名称', name:'item_name'},
		{ label:'助记码',   name:'qt_item_code'},
	]
	model = {}
	componentDidMount(){
		const { submit } = this.state
		this.forms[0].data = statusOption
		submit[9].data = statusOption.filter(i => i.value !== '0')
		// 检测方法
		$fn.getDisItem({
			code: 16000,
			callback: (data) => {
				submit[7].data = data
				this.setState({submit})
			}
		})
		this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'qt-item-source/index', param)
	// table
	cols = [
		{ title: '物价代码',    field: 'price_code',				width: 120 },
		{ title: '关联物价',	field: 'price_rel_codes',			width: 120 },
		{ title: '项目名称',	field: 'item_name',					width: 220 },
		{ title: '检测方法',	field: 'detection_method_name',		width: 160 },
		{ title: '标准价格',	field: 'price',						width: 100 },
		{ title: '三甲价格',	field: 'hosp_price_ta',				width: 100 },
		{ title: '三乙价格',	field: 'hosp_price_tb',				width: 100 },
		{ title: '二甲价格',	field: 'hosp_price_sa',				width: 100 },
		{ title: '二乙价格',	field: 'hosp_price_sb',				width: 100 },
		{ title: '项目内涵',	field: 'extend1',					width: 260 },
		{ title: '除外内容',	field: 'extend2',					width: 220 },
		{ title: '助记码',		field: 'qt_item_code',				width: 100 },
		{ title: '备注',		field: 'remark',					width: 100 },
		{ title: '助记码',		field: 'qt_item_code',				width: 100 },
		{ title: '状态', 	   field: 'enabled',					width: 80,		render: ({rows}) => {
            let d = statusOption.filter(i => i.value === rows.enabled)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
		{ title: '操作',    align:'tc',   width: 200, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button className='mr10' label='编辑' ghost onClick={e=>{
						this.refs.modal.open()
                        const { submit } = this.state
						$http.submit(null,'qt-item-source/info',{ param:{uuid: rows.uuid} }).then(data=>{
							this.rows = data
                            this.isEdit = true
                            $fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
                        })
					}}  />
				</div>
			)
		}},
	]
	ButtonGroup = () => {
		return [
			{ label:'添加 F2', code:'F2', onClick:()=>{
				this.refs.modal.open()
				const { submit } = this.state
				submit.map(item => {
                    item.value = ''
				})
				this.isEdit = false
				this.setState({ submit })
			} },
			{ label:'文件导入', onClick:()=>{
				
            } },
		]
	}
	render(){
		const { data, pullLoading, pag, submit } = this.state
		return (
			<Page title='源物价项目' ButtonGroup={this.ButtonGroup()}>
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
                                const param = { ...this.rows, ...v}
                                $http.submit(null,'qt-item-source/edit',{ param }).then(data=>{
                                    message.then(f=>f.default.success('编辑成功'))
                                    this.refs.modal.close()
                                    this.fetch(this.model)
                                })
                            } else {
                                const param = { ...v }
                                $http.submit(null, 'qt-item-source/add', { param }).then(data => {
                                    message.then(f => f.default.success('添加成功'))
                                    this.refs.modal.close()
                                    this.fetch(this.model)
                                })
                            }
                            
                        }}
                        onClose = { ()=>this.refs.modal.close() }
                        init    = { form => this.form = form }
                    />
                </Modal>
			</Page>
		)
	}
}