import React from 'react'
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
const typeOption = [
    { name: '开始', value: '1' },
    { name: '结束', value: '2' },
    { name: '普通', value: '3' }
]
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
        selectedKeys:[],
        submit: [
            { label: '节点类型',    name:'node_type',   required: true,     type: 'select', data: []},
            { label: '节点名称',    name: 'node_name',  required: true},
            { label: '所属流程',    name:'process_id',  required: true,     type: 'select', data: []},
            { label: '节点排序',    name: 'sort'},
        ],
        forms: [
            { label: '节点名称', name:'node_name'},
            { label: '节点代码', name:'node_code'},
            { label: '节点类型', name:'node_type',  type: 'select', data: []},
            { label: '流程名称', name:'process_id', type: 'select', data: []},
        ]
	}
    id = $fn.query('id') || ''
	model = {process_id: this.id}
	componentDidMount(){
        const { submit, forms } = this.state
        cacheApi.then(f => {
            const d = f.default
            // 流程名称
			$fn.getCache({
				cache: d.flProSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        submit[2].data = data
                        forms[3].data = data
                        this.setState({forms, submit})
                    } else {
                        $http.submit(null, 'fl-process/select').then(data => {
                            submit[2].data = data
                            forms[3].data = data
                            this.setState({forms, submit})
                            $fn.setCache()
                        })
                    }
				}
            })
		})
        forms[2].data = typeOption
        submit[0].data = typeOption
		this.fetch(this.model)
    }
	// paging
	fetch = param => $fn.fetch.call(this,'fl-process-node/index', param)
	// table
	cols = [
        { type: 'checkbox',     width: 50 },
		{ title: '节点代码',    field: 'node_code',     width: 120 },
		{ title: '节点名称',	field: 'node_name',     width: 120 },
		{ title: '所属流程',	field: 'process_name',  width: 120 },
		{ title: '排序',        field: 'sort',          width: 120 },
		{ title: '节点类型',    field: 'node_type',     width: 80,		render: ({rows}) => {
            let d = typeOption.filter(i => i.value === rows.node_type)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
        { title: '创建时间',    field: 'created_at',    width: 160 },
		{ title: '操作',    align:'tc',   width: 200, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button className='mr10' label='编辑' ghost onClick={e=>{
						this.refs.modal.open()
                        const { submit } = this.state
						$http.submit(null,'fl-process-node/info',{ param:{uuid: rows.uuid} }).then(data=>{
                            this.rows = data
                            this.isEdit = true
                            $fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
                        })
					}}  />
                    <Button className='mr10' label='查看授权' ghost onClick={e=>{
						$fn.push(this, $fn.getRoot().root + 'system-settings/process-authorization?id=' + rows.uuid)
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
                    if (this.id && item.name === 'process_id') {
                        item.value = this.id
                    }
				})
				this.isEdit = false
				this.setState({ submit })
			} },
			{ label:'删除', disabled:this.state.selectedKeys.length===0, onClick:()=>{
				const param = {uuid: this.state.selectedKeys.map(v=>v.uuid)} 
				coms.interfaceConfirm('fl-process-node/del', '删除', param, () => {
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
			<Page title='节点名称列表' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onAdd		= { this.onAdd } 
					onReset		= { $fn.onReset.bind(this,forms) }
                    loading		= { pullLoading }
                    init        = { form => form.setFieldsValue({process_id: this.model.process_id}) }
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
                                const param = { ...this.rows, ...v, sort: v.sort || ''}
                                $http.submit(null,'fl-process-node/edit',{ param }).then(data=>{
                                    message.then(f=>f.default.success('编辑成功'))
                                    this.refs.modal.close()
                                    this.fetch(this.model)
                                })
                            } else {
                                const param = { ...v, sort: v.sort || '' }
                                console.log(param)
                                $http.submit(null, 'fl-process-node/add', { param }).then(data => {
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