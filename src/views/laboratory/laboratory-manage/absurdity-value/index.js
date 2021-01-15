import React from 'react'
import coms from '@/private/js/common.js'
// ===================================================================== antd
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
const Table = $async(()=>import('#cpt/table'))
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
// ===================================================================== 页面常量
const relateOption = [
    { name: "同时满足", value: "1" },
    { name: "满足一条", value: "2" },
    { name: "满足多条", value: "3" },
    { name: "都不满足", value: "4" }
] // 关系
const statusOption = [
    { name: "启用", value: "1" },
    { name: "禁用", value: "0" }
] // 状态
const typeOption = [
    { name: "默认", value: "0" }
] // 类型
// ===================================================================== component
const DetailTable = $async(() => import('./tp/detail-table'))
export default class extends React.Component{
	state = {
        data:[],
        pag: {},
        selectedKeys:[],
        submit: [
            { label: '编号',    name: 'absurd_number',      required: true },
            { label: '名称',    name: 'absurd_name',        required: true },
            { label: '类型',    name: 'absurd_type',        required: true,     type: 'select',     data: [] },
            { label: '关系',    name: 'absurd_relation',    required: true,     type: 'select',     data: [] },
            { label: '状态',    name: 'enabled',            required: true,     type: 'select',     data: [] },
            { label: '备注',    name: 'absurd_remark',      type: 'textarea',   full: true,         width: '100%' },
        ],
        uuid: ''
    }
    forms = [
		{ label:'编号',     name:'absurd_number'},
		{ label:'名称',     name:'absurd_name'},
		{ label:'类型',     name:'absurd_type',         type:'select',      data:[]},
		{ label:'关系',     name:'absurd_relation',     type:'select',      data:[]},
		{ label:'状态',     name:'enabled',             type:'select',      data:[]},
    ]
    model = {}
	componentDidMount(){
        const { submit } = this.state
        this.forms[2].data = submit[2].data = typeOption
        this.forms[3].data = submit[3].data = relateOption
        this.forms[4].data = submit[4].data = statusOption
		this.fetch(this.model)
    }
    // paging
    fetch = param => $fn.fetch.call(this,'lis-absurd-data/index', param)
    // table
	cols = [
		{ type:'checkbox' },
		{ title: '编号',    field: 'absurd_number' },
		{ title: '名称',    field: 'absurd_name'},
		{ title: '类型',    field: 'absurd_type',       render: ({rows}) => {
            let d = typeOption.filter(i => i.value === rows.absurd_type)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
        { title: '关系',    field: 'absurd_relation',   render: ({rows}) => {
            let d = relateOption.filter(i => i.value === rows.absurd_relation)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
        { title: '状态',    field: 'enabled',           render: ({rows}) => {
            let d = statusOption.filter(i => i.value === rows.enabled)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
        { title: '备注',    field: 'absurd_remark'},
		{ title: '操作', align:'tc', render:({rows})=>{
			return (
				<div className='plr5'>
					<Button className='mr10' label='编辑' ghost onClick={e=>{
						this.refs.modal.open()
						const { submit } = this.state
						$http.submit(null,'lis-absurd-data/info',{ param:{uuid: rows.uuid} }).then(data=>{
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
			{ label:'删除', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				const param = {uuid: this.state.selectedKeys.map(v=>v.uuid)} 
				coms.interfaceConfirm('lis-absurd-data/del', '删除', param, () => {
                    this.fetch(this.model)
                    this.setState({selectedKeys: []})
                })
			} },
		]
	}
	render(){
        const { submit, pullLoading, data, pag } = this.state
		return (
			<Page title='荒谬值' ButtonGroup={this.ButtonGroup()}>
                {/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onAdd		= { this.onAdd } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
				/>
                <div className='fx ex'>
                    <div className='bor1 r4px mr15 ex fv'>
                        <h6 className="w xmlr pl20 h40 b">项目列表</h6>
                        <Table
                            className		= 'xplr'
                            cols			= { this.cols }
                            data 			= { data }
                            loading 		= { pullLoading }
                            onRow			= { (v, rows) => {
                                this.setState({ selectedKeys: v, uuid: rows.uuid })
                            } }
                            pag				= { pag }
                            onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
                            onSort			= { v => $fn.onSort.call(this, v) }
                        />
                        <Modal ref='modal' title={this.isEdit ? '编辑' : '添加'} width={648} noFooter>
                            <SubmitForm
                                modal
                                data = { submit }
                                onSubmit = { v => {
                                    if (this.isEdit) {
                                        const param = { ...v, uuid: this.rows.uuid}
                                        $http.submit(null,'lis-absurd-data/edit',{ param }).then(data=>{
                                            message.then(f=>f.default.success('编辑成功'))
                                            this.refs.modal.close()
                                            this.fetch(this.model)
                                        })
                                    } else {
                                        const param = { ...v }
                                        $http.submit(null, 'lis-absurd-data/add', { param }).then(data => {
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
                    </div>
                    <div className='bor1 r4px ex fv'>
                        <DetailTable uuid={this.state.uuid} />
                    </div>
                </div>
			</Page>
		)
	}
}