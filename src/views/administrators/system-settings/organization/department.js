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
            { label: '部门名称',	name: 'depart_name',    required: true},
            { label: '中文简称',    name: 'short_name'},
            { label: '英文名称',    name: 'en_name'},
            { label: '英文简称',    name: 'short_en_name'},
            { label: '部门负责人',  name: 'manager'},
            { label: '固定电话',    name: 'tel',            required: true},
            { label: '排序',        name: 'sort'},
        ],
        forms: [
            { label:'公司',         name:'comp_id',         type: 'select', data: [],   nameStr: 'company_name',  idStr: 'uuid'},
            { label:'状态',         name:'enabled',         type: 'select', data: []},
            { label:'部门名称',     name:'keyword'},
        ]
	}
	id = $fn.query('id') || ''
	model = { comp_id: this.id }
	componentDidMount(){
        const { forms } = this.state
        forms[1].data = statusOption // 状态
        cacheApi.then(f => {
            const d = f.default
            // 公司
			$fn.getCache({
				cache: d.CompanySelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        forms[0].data = data
                        this.setState({forms})
                    } else {
                        $http.submit(null, 'company/select').then(data => {
                            forms[0].data = data
                            this.setState({forms})
                            $fn.setCache()
                        })
                    }
				}
            })
		})
		this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'department/index', param)
	// table
	cols = [
        { type: 'checkbox' },
		{ title: '部门编号',	field: 'depart_code',     width: 120 },
		{ title: '部门名称',	field: 'depart_name',	width: 150},
		{ title: '部门负责人',	field: 'manager',	width: 150},
        { title: '简称',        field: 'short_name',	width: 100 },
        { title: '英文名称',	field: 'en_name',	    width: 100 },
        { title: '英文简称',	field: 'short_en_name',	width: 100 },
        { title: '所属公司',	field: 'company_name',	width: 100 },
        { title: '状态',		field: 'enabled',       width: 80,      render: ({rows}) => {
            let d = statusOption.filter(i => i.value === rows.enabled)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
		{ title: '操作',        align:'tc',             width: 200,     render:({rows})=>{
			return (
				<div className='plr5'>
                    <Button className='mr10' label='查看' ghost onClick={e=>{
						$fn.push(this, $fn.getRoot().root + 'system-settings/office?id=' + rows.uuid)
					}}  />
					<Button className='mr10' label='编辑' ghost onClick={e=>{
						this.refs.modal.open()
                        const { submit } = this.state
						$http.submit(null,'department/info',{ param:{uuid: rows.uuid} }).then(data=>{
                            this.rows = data
                            this.isEdit = true
                            $fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
                        })
					}}  />
                    <Button className='mr10' label='禁用' ghost onClick={e=>{
						const param = {uuid: rows.uuid} 
						coms.interfaceConfirm('department/del', '禁用', param, () => {
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
                    if (item.name === 'tel') {
                        item.value = '13588888888'
                    }
                    if (item.name === 'sort') {
                        item.value = '1'
                    }
				})
				this.isEdit = false
				this.setState({ submit })
			} },
			{ label:'启用', disabled:this.state.selectedKeys.length===0, onClick:()=>{
				const param = {uuid: this.state.selectedKeys.map(v=>v.uuid)} 
				coms.interfaceConfirm('department/open', '启用', param, () => {
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
			<Page title='部门管理' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onAdd		= { this.onAdd } 
					onReset		= { $fn.onReset.bind(this,forms) }
                    loading		= { pullLoading }
                    init        = { form => form.setFieldsValue({comp_id: this.id}) }
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
                            const pid = ''
                            if (this.isEdit) {
                                const param = { ...this.rows, ...v}
                                $http.submit(null,'department/edit',{ param }).then(data=>{
                                    message.then(f=>f.default.success('编辑成功'))
                                    this.refs.modal.close()
                                    this.fetch(this.model)
                                    $fn.setCache()
                                })
                            } else {
                                const param = { ...v, pid }
                                $http.submit(null, 'department/add', { param }).then(data => {
                                    message.then(f => f.default.success('添加成功'))
                                    this.refs.modal.close()
                                    this.fetch(this.model)
                                    $fn.setCache()
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