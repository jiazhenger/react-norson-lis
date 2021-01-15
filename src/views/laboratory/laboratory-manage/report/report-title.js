import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
// ===================================================================== common
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
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== 页面常量
const enabledOptions = [
    { name: "开启", value: "1" },
    { name: "未开启", value: "0" },
    { name: "关闭", value: "-1" }
]
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		submit: [
			{ label: '公司抬头',        name: 'main_title',         required: true},
			{ label: '二级抬头',        name: 'secondary_title'},
			{ label: '二级英文抬头',    name: 'subtitle'},
            { label: '公司地址',        name: 'address'},
            { label: '岗位',            name:'project_id',          type:'select',      data:[],    idStr: 'uuid'},
			{ label: '状态',            name: 'enabled',            type:'select',      data:[]},
			{ label: 'logo',            name: 'logo_img',           type: 'upload',     params: {modular: 124}},
			{ label: '二维码',          name: 'qr_code',            type: 'upload',     params: {modular: 124}},
        ],
	}
	forms = [
        { label: '岗位',            name:'project_id',         type:'select',      data:[]},
	]
    model = {}
	componentDidMount(){
        const { submit } = this.state
        submit[5].data = enabledOptions
        cacheApi.then(f => {
            const d = f.default
            // 岗位
            $fn.getCache({
                cache: d.jobAllselect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        this.forms[0].data = data
                        submit[4].data = data
                    } else {
                        $http.submit(null, 'project-team/jobAllselect').then(data => {
                            this.forms[0].data = data
                            submit[4].data = data
                            $fn.setCache()
                        })
                    }
                }
            })
            this.setState({submit})
        })
        this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'conf-report/index', param)
	// table
	cols = [
        { type: 'checkbox' },
		{ title: '公司抬头',        field: 'main_title',            width: 160 },
		{ title: '二级抬头',        field: 'secondary_title',       width: 180},
		{ title: '二级英文抬头',    field: 'subtitle',              width: 240},
		{ title: '公司地址',        field: 'address',               width: 300},
		{ title: '岗位',            field: 'project_name',          width: 120},
        { title: '状态',            field: 'enabled',               width: 80,       render: ({ rows }) => {
            const d = enabledOptions.filter(i => i.value === rows.enabled)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
		{ title: '操作', width: 200, align: 'tc', render: ({rows}) => {
            return (
				<div className='plr5'>
					<Button label='编辑' className='' ghost onClick={e=>{
						const { submit } = this.state
						$http.submit(null, 'conf-report/info', {param: {uuid: rows.uuid}}).then(data => {
							this.rows = data
                            this.isEdit = true
                            $fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
                            this.refs.modal.open()
						})
					}}  />
				</div>
			)
        }},
	]
	ButtonGroup = () => {
        const { selectedKeys } = this.state
		return [
            { label:'新增 F2', code:'F2', onClick:()=>{
				this.refs.modal.open()
                const { submit } = this.state
                submit.map(item => {
                    item.value = ''
                })
				this.isEdit = false
				this.setState({ submit })
			} },
            { label:'删除', disabled:selectedKeys.length === 0, onClick:()=>{
                const param = selectedKeys.map(i => i.uuid)
				coms.interfaceConfirm('conf-report/del', '删除', {uuid: param}, () => {
					this.fetch(this.model)
					this.setState({selectedKeys: []})
				})
            } },
		]
	}
	render(){
		const { data, pullLoading, pag, submit } = this.state
		return (
			<Page title='报告单抬头' ButtonGroup={this.ButtonGroup()}>
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
                                const param = { ...this.rows, ...v }
								$http.submit(null, 'conf-report/edit', { param }).then(data => {
									message.then(f => f.default.success('编辑成功'))
									this.refs.modal.close()
									this.fetch(this.model)
								})
							} else {
                                const param = { ...v }
								$http.submit(null, 'conf-report/add', { param }).then(data => {
									message.then(f => f.default.success('添加成功'))
									this.refs.modal.close()
									this.fetch(this.model)
								})
                            }
						}}
                        onClose = { ()=>this.refs.modal.close() }
                        init    = { form => this.editForm = form }
					 />
				</Modal>
			</Page>
		)
	}
}