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
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== 页面常量
const enabledOptions = [
    { name: "启用", value: "1" },
    { name: "禁用", value: "0" }
]
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		submit: [
			{ label: '名称',        name: 'report_name',    required: true},
			{ label: '英文名称',    name: 'report_en'},
			{ label: '路径',        name: 'route',          type:'select',      data:[]},
			{ label: '类型',        name: 'type',           required: true,     type:'select',      data:[]},
			{ label: '数据格式',    name: 'json_data',      type: 'textarea',   full: true,     width: '100%'},
			{ label: '说明',        name: 'remark',         type: 'textarea',   full: true,     width: '100%'},
        ],
	}
	forms = [
        { label: '模板名称',        name:'report_name'},
        { label: '模板编号',        name:'report_num'},
		{ label: '模板英文名称',    name:'report_en'},
        { label: '创建时间',        name:'date',			type:'date-range',	names:['created_at_start_date','created_at_end_date'], value:[] },
        { label: '状态',            name:'enabled',         type:'select',      data:[]},
	]
    model = {}
	componentDidMount(){
        const { submit } = this.state
        this.forms[4].data = enabledOptions
        // 报告单模板类型
        $fn.getDisItem({
            code: 61950,
            callback: (data) => {
                submit[3].data = data
            }
        })
        // 报告单路径
        $fn.getDisItem({
            code: 41000,
            callback: (data) => {
                submit[2].data = data
            }
        })
        this.setState({submit})
        this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'kd-report-from/index', param)
	// table
	cols = [
        { type: 'checkbox' },
		{ title: '模板名称',        field: 'report_name' },
		{ title: '模板编号',        field: 'report_num'},
		{ title: '模板英文名称',    field: 'report_en'},
		{ title: '状态',            field: 'enabled',       render: ({ rows }) => {
            const d = enabledOptions.filter(i => i.value === rows.enabled)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
		{ title: '路径',            field: 'route_name' },
		{ title: '模板版本',        field: 'version_num'},
		{ title: '说明',            field: 'remark'},
		{ title: '类型',            field: 'type_name'},
		{ title: '更新时间',        field: 'created_at',    width: 160,     align: 'tc'},
		{ title: 'token',           field: 'token',         width: 260},
		{ title: '操作', width: 200, align: 'tc', render: ({rows}) => {
            return (
				<div className='plr5'>
					<Button label='编辑' className='' ghost onClick={e=>{
						const { submit } = this.state
						$http.submit(null, 'kd-report-from/info', {param: {uuid: rows.uuid}}).then(data => {
							this.rows = data
                            this.isEdit = true
                            $fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
                            this.refs.modal.open()
						})
					}}  />
                    <Button label='查看版本' ghost className='mlr5' onClick={()=>{
                        const str = `report_name=${rows.report_name}&report_num=${rows.report_num}&report_en=${rows.report_en}&enabled=${rows.enabled}&route_name=${rows.route_name}`
						$fn.push(this, $fn.getRoot().root + 'laboratory-manage/report-template/version?id=' + rows.uuid + '&' + str)
					}} />
				</div>
			)
        }},
	]
	ButtonGroup = () => {
        const { selectedKeys } = this.state
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
            { label:'删除', disabled:selectedKeys.length === 0, onClick:()=>{
                const param = selectedKeys.map(i => i.uuid)
				coms.interfaceConfirm('kd-report-from/del', '删除', {uuid: param}, () => {
					this.fetch(this.model)
					this.setState({selectedKeys: []})
				})
            } },
		]
	}
	render(){
		const { data, pullLoading, pag, submit } = this.state
		return (
			<Page title='报告单模板' ButtonGroup={this.ButtonGroup()}>
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
								$http.submit(null, 'kd-report-from/edit', { param }).then(data => {
									message.then(f => f.default.success('编辑成功'))
									this.refs.modal.close()
									this.fetch(this.model)
								})
							} else {
                                const param = { ...v }
								$http.submit(null, 'kd-report-from/add', { param }).then(data => {
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