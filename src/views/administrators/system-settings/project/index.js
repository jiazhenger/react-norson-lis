import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
import coms from '@/private/js/common.js'
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
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== 页面常量
const kindStatusOption = [
    { value: '',    name: '全部' },
    { value: '2',   name: "开启" },
    { value: '1',   name: "审核中" },
    { value: '0',   name: "草稿" }
]
const categoryOption = [
    { value: '',        name: '全部' },
    { value: "25001",   name: "单一项目" },
    { value: "25002",   name: "从属项目" },
    { value: "25003",   name: "组合项目" },
    { value: "25004",   name: "营销项目" }
]
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		submit: [
			{ label: '项目名称',	name: 'kind_name',		disabled: true},
			{ label: '公司名称',	name: 'comp_id',		required: true,		type: 'select',	data: [] },
		],
		uuid: '',
		kind_status: ''
	}
	forms = [
		{ label:'状态',			name:'kind_status',		type: 'select',		data: []},
		{ label:'项目代码',		name:'kind_code'},
		{ label:'项目全称',		name:'kind_name'},
		{ label:'助记码',		name:'debit_code'},
        { label:'项目分类',		name:'category',		type:'select',      data:[]},
        { label:'备注',			name:'memo'},
        { label:'岗位',			name:'project_id',		type:'select',      data:[]},
	]
	model = {}
	componentDidMount(){
		const { submit } = this.state
		this.forms[0].data = kindStatusOption
		this.forms[4].data = categoryOption
        cacheApi.then(f => {
            const d = f.default
            // 岗位
			$fn.getCache({
				cache: d.laboratoryselect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        this.forms[6].data = data
                    } else {
                        $http.submit(null, 'project-team/laboratoryselect').then(data => {
                            this.forms[6].data = data
                            $fn.setCache()
                        })
                    }
				}
			})
			// 公司名称
			$fn.getCache({
				cache: d.CompanySelect, name: 'company_name', id: 'uuid', callback: (data) => {
                    if ($fn.hasArray(data)) {
						submit[1].data = data
						this.setState({submit})
                    } else {
                        $http.submit(null, 'company/select').then(data => {
							submit[1].data = data
							this.setState({submit})
                            $fn.setCache()
                        })
                    }
				}
            })
		})
        this.fetch()
	}
	getProjectKindId(api, cb) {
        $http.submit(null, api).then(data=>{
			cb && cb(data.kind_id)
        })
    }
	// paging
	fetch = param => $fn.fetch.call(this,'kind-info/index', param)
	// table
	cols = [
		{ title: '状态',		field: 'kind_status',		width: 100,		render:({rows})=>{
			let d = kindStatusOption.filter(i => i.value === rows.kind_status)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
		}},
		{ title: '项目分类',	field: 'category_name',		width: 120},
		{ title: '项目代码',	field: 'kind_code',			width: 120},
		{ title: '项目名称',	field: 'kind_name',			width: 160},
		{ title: '项目属性',	field: 'kind_type_name',	width: 160},
		{ title: '检测方法',	field: 'check_method_name',	width: 160},
		{ title: '岗位',		field: 'job_name',			width: 120},
		{ title: '助记码',		field: 'debit_code',		width: 100},
		{ title: '价格',		field: 'total_price',		width: 100},
		{ title: '项目排序',	field: 'sort',				width: 80},
		{ title: '备注',		field: 'memo',				width: 200},
	]
	ButtonGroup = () => {
		const arr = [
			{ label:'编辑', disabled: !this.rows, onClick:()=>{
				const rows = this.rows
				if (rows.category === '25001') { // 单一项目
					$fn.push(this, $fn.getRoot().root + `system-settings/project-settings/single?id=${rows.uuid}&kind_status=${rows.kind_status}`)
				} else if (rows.category === '25002') { // 从属项目
					$fn.push(this, $fn.getRoot().root + `system-settings/project-settings/subordinate?id=${rows.uuid}&kind_status=${rows.kind_status}`)
				} else if (rows.category === '25003') { // 组合项目
					$fn.push(this, $fn.getRoot().root + `system-settings/project-settings/combination?id=${rows.uuid}&kind_status=${rows.kind_status}`)
				} else if (rows.category === '25004') { // 营销项目
					$fn.push(this, $fn.getRoot().root + `system-settings/project-settings/marketing?id=${rows.uuid}&kind_status=${rows.kind_status}`)
				}
			} },
			{ label:'设置单一项目', onClick:()=>{
				this.getProjectKindId('kd-market/add', kind_id=>{
					$fn.push(this, $fn.getRoot().root + `system-settings/project-settings/single?id=${kind_id}&kind_status=0`)
				})
			} },
			{ label:'新增从属项目', onClick:()=>{
				this.getProjectKindId('kd-subordinate-set/add', kind_id=>{
					$fn.push(this, $fn.getRoot().root + `system-settings/project-settings/subordinate?id=${kind_id}&kind_status=0`)
				})
			} },
			{ label:'设定组合项目', onClick:()=>{
				this.getProjectKindId('kd-market/add', kind_id=>{
					$fn.push(this, $fn.getRoot().root + `system-settings/project-settings/combination?id=${kind_id}&kind_status=0`)
				})
			} },
			{ label:'设置营销项目', onClick:()=>{
				this.getProjectKindId('kd-market/add', kind_id=>{
					$fn.push(this, $fn.getRoot().root + `system-settings/project-settings/marketing?id=${kind_id}&kind_status=0`)
				})
			} },
			{ label:'导出', onClick:()=>{
				coms.exportExcel({
					api: 'kind-info/index',
					param: {param: {...this.model, export: '1'}}
				})
			} },
			{ label:'更新公式', onClick:()=>{
				$http.submit(null,'result-unit-item/changeFormula2Kind').then(data=>{
					message.then(f=>f.default.success('操作 成功'))
				})
			} },
			{ label:'复制项目到', disabled: !this.rows, onClick:()=>{
				this.refs.modal.open()
				const { submit } = this.state
				submit[0].value = this.rows.kind_name
				submit[1].value = ''
				this.setState({ submit })
			} },
		]
		if ($fn.query('kind_code')) {
			arr.push({ label:'返回', onClick:()=>{ $fn.back(this) } },)
		}
		return arr
	}
	render(){
		const { data, pullLoading, pag, submit } = this.state
		return (
			<Page title='检测项目' ButtonGroup={this.ButtonGroup()}>
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
					onRow			= { (rows) => {
						this.setState({ uuid: rows.uuid, kind_status: rows.kind_status })
						this.rows = rows
					} }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
				/>
				<Modal ref='modal' title='复制项目到' width={648} noFooter>
					<SubmitForm
						modal
						data = { submit }
						onSubmit = { v => {
							const param = { 
								uuid: this.rows.uuid,
								comp_id: v.comp_id
							 }
							$http.submit(null, 'specimen/copykind', { param }).then(data => {
								message.then(f => f.default.success('操作成功'))
								this.refs.modal.close()
								this.fetch(this.model)
							})
						}}
                        onClose = { ()=>this.refs.modal.close() }
                        init    = { form => this.form = form }
					 />
				</Modal>
			</Page>
		)
	}
}