import React from 'react'
import Modal from '@antd/modal'
import coms from '@/private/js/common.js'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
const Text = $async(()=>import('@tp/text'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== 页面常量
const statusOption = [
	{ name: "启用", value: "1" },
	{ name: "待启用", value: "0" },
	{ name: "禁用", value: "-1" }
]
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
        selectedKeys:[],
        submit: [
            { label: '公司名称',	name: 'company_name',   required: true,     full: true,         width: '100%'},
            { label: 'Logo',		name: 'logo',           full: true,         width: '100%',      type: 'upload',     params: {modular: 118}},
            { label: '公司编号',    name: 'comp_code',		required: true,     disabled: true},
            { label: '中文简称',     name: 'short_name',    required: true},
            { label: '英文名称',    name: 'en_name',		required: true},
            { label: '英文简称',    name: 'short_en_name',  required: true},
            { label: '所属集团',    name: 'group_id',		required: true,     type: 'select',     data: [],   nameStr: 'group_name',  idStr: 'uuid'},
            { label: '区域',		name: 'area_id',        type: 'cascader'},
            { label: '地址',        name: 'address'},
            { label: '英文地址',    name: 'en_address'},
            { label: '法人代表',    name: 'legal_person'},
            { label: '固定电话',    name: 'tel'},
            { label: '注册日期',	name:'reg_date',		type:'date-time',   after:true },
			{ label: '排序',		name: 'sort'},
            { label: '公司网址',    name: 'website'},
            { label: '公司简介',    name: 'summary',		type: 'textarea',   full: true,         width: '100%'},
			{ label: '公司描述',    name: 'description',	type: 'textarea',   full: true,         width: '100%'},
        ],
        forms: [
            { label:'集团',     name:'group_id',    type: 'select', data: [],   nameStr: 'group_name',  idStr: 'uuid'},
            { label:'状态',     name:'enabled',     type: 'select', data: []},
            { label:'公司名称', name:'keyword'},
        ]
	}
	id = $fn.query('id') || ''
	model = { group_id: this.id }
	componentDidMount(){
        const { submit, forms } = this.state
        forms[1].data = statusOption // 状态
        cacheApi.then(f => {
            const d = f.default
            // 集团
			$fn.getCache({
				cache: d.CorpGroupSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        submit[6].data = data
                        forms[0].data = data
                        this.setState({forms, submit})
                    } else {
                        $http.submit(null, 'corp-group/select').then(data => {
                            submit[6].data = data
                            forms[0].data = data
                            this.setState({forms, submit})
                            $fn.setCache()
                        })
                    }
				}
            })
		})
		this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'company/index', param)
	// table
	cols = [
        { type: 'checkbox' },
		{ title: '公司编码',	field: 'comp_code',     width: 120 },
		{ title: '公司名称',	field: 'company_name',	width: 150},
        { title: '简称',        field: 'short_name',	width: 100 },
        { title: '英文名称',	field: 'en_name',	    width: 100 },
        { title: '英文简称',	field: 'short_en_name',	width: 100 },
        { title: '所属集团',	field: 'group_name',	width: 100 },
        { title: '状态',		field: 'enabled',       width: 80,      render: ({rows}) => {
            let d = statusOption.filter(i => i.value === rows.enabled)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
		{ title: '操作',        align:'tc',             width: 200,     render:({rows})=>{
			return (
				<div className='plr5'>
                    <Button className='mr10' label='查看' ghost onClick={e=>{
						$fn.push(this, $fn.getRoot().root + 'system-settings/department?id=' + rows.uuid)
					}}  />
					<Button className='mr10' label='编辑' ghost onClick={e=>{
						this.refs.modal.open()
                        const { submit } = this.state
						$http.submit(null,'company/info',{ param:{id: rows.id} }).then(data=>{
                            this.rows = data
                            this.isEdit = true
                            $fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
                        })
					}}  />
                    <Button className='mr10' label='禁用' ghost onClick={e=>{
						const param = {uuid: rows.uuid} 
						coms.interfaceConfirm('company/del', '禁用', param, () => {
							this.fetch(this.model)
						})
					}}  />
				</div>
			)
		}},
	]
	ButtonGroup = () => {
        const arr = [
            { label:'添加 F2', code:'F2', onClick:()=>{
				this.refs.modal.open()
                const { submit } = this.state
				submit.map(item => {
                    item.value = ''
                    if (this.id && item.name === 'group_id') {
                        item.value = this.id
                    }
				})
				this.isEdit = false
				this.setState({ submit })
			} },
			{ label:'启用', disabled:this.state.selectedKeys.length===0, onClick:()=>{
				const param = {uuid: this.state.selectedKeys.map(v=>v.uuid)} 
				coms.interfaceConfirm('company/open', '启用', param, () => {
                    this.fetch(this.model)
                    this.setState({selectedKeys: []})
                })
            } },
        ]
        if (this.id) {
            arr.push({ label:'返回', onClick:()=>{ $fn.back(this) } },)
        }
        return arr
	}
	render(){
		const { data, pullLoading, pag, submit, forms } = this.state
		return (
			<Page title='公司管理' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onAdd		= { this.onAdd } 
					onReset		= { $fn.onReset.bind(this,forms) }
                    loading		= { pullLoading }
                    init        = { form => form.setFieldsValue({group_id: this.id}) }
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
                                $http.submit(null,'company/edit',{ param }).then(data=>{
                                    message.then(f=>f.default.success('编辑成功'))
									this.refs.modal.close()
									$fn.setCache()
                                    this.fetch(this.model)
                                })
                            } else {
                                const param = { ...v }
                                $http.submit(null, 'company/add', { param }).then(data => {
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