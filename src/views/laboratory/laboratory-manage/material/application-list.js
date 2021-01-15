import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
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
// ===================================================================== 页面变量
const enabledOptions = [
    { name: '已申请', value: '1' },
    { name: '申请中', value: '0' },
    { name: '已过期', value: '-1' }
]
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		deviceStadius:[],
		submit: [
			{ label: '物料名称',	name: 'mate_id',            required: true,         type:'select',      data:[]},
			{ label: '申请数量',	name: 'apply_qty',          required: true },
            { label: '申请人',      name: 'apply_user',         required: true },
            { label: '申请时间',	name: 'apply_for_time',     required: true,         type:'date-time',   after:true},
			{ label: '检测组',		name: 'pgroup_id',			required: true,         type:'select',      data:[]},
			{ label: '审核人',      name: 'reviewer'},
		]
	}
	forms = [
		{ label: '物料名称',    name:'material',        type:'select',      data:[]},
        { label: '检测组',      name:'pproject',        type:'select',      data:[],    idStr: 'uuid'},
        { label: '申请人',      name:'apply_user'},
        { label: '状态',        name:'apply_status',    type:'select',      data:[]},
        { label: '申请时间',    name:'date',			type:'date-range',	names:['start_date','end_date'], value:[] },
	]
	model = {}
	componentDidMount(){
        const { submit } = this.state
        this.forms[3].data = enabledOptions
		cacheApi.then(f => {
            const d = f.default
            // 检测组列表
            $fn.getCache({
                cache: d.ProjectTeamSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        this.forms[1].data = data
                        submit[4].data = data
                    } else {
                        $http.submit(null, 'project-team/select').then(data => {
                            this.forms[1].data = data
                            submit[4].data = data
                            $fn.setCache()
                        })
                    }
                }
            })
            // 物料名称
            $fn.getCache({
                cache: d.materialSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        this.forms[0].data = data
                        submit[0].data = data
                    } else {
                        $http.submit(null, 'material/select').then(data => {
                            this.forms[0].data = data
                            submit[0].data = data
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
	fetch = param => $fn.fetch.call(this,'mt-apply-form/index', param)
	// table
	cols = [
		{ title: '申请单', 	        field: 'apply_number' },
		{ title: '申请时间', 	    field: 'apply_for_time',          align:'tc'},
		{ title: '物料名称', 	    field: 'mate_name'},
		{ title: '物料编号',        field: 'mate_number'},
		{ title: '申请数量',        field: 'apply_qty'},
		{ title: '申请码', 	        field: 'encrypt_code' },
		{ title: '审核人',          field: 'reviewer'},
		{ title: '检测组', 	        field: 'project_name'},
		{ title: '状态',            field: 'apply_status', render: ({rows}) => {
            const d = enabledOptions.filter(i => i.value === rows.apply_status)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        } },
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
				this.isEdit = false
				this.setState({ submit })
            } },
            { label:'返回', onClick:()=>{
				$fn.back(this)
            } },
		]
	}
	render(){
		const { data, pullLoading, pag, submit } = this.state
		return (
			<Page title='申请单列表' ButtonGroup={this.ButtonGroup()}>
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
								$http.submit(null, 'mt-apply-form/add', { param }).then(data => {
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