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
const Table = $async(()=>import('#cpt/table'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
// ===================================================================== 页面常量
const statusOption = [
    { name: "启用", value: "1" },
    { name: "未启用", value: "0" }
]
const conditionOption = [
    { name: "必须", value: "1" },
    { name: "非必须", value: "0" }
]
const ruleOption = [
    { name: "<", value: "1" },
    { name: "=", value: "2" },
    { name: "<=", value: "3" },
    { name: ">", value: "4" },
    { name: ">=", value: "5" },
    { name: "≠", value: "6" },
    { name: "包含", value: "7" },
    { name: "等于", value: "8" }
  ]
// ===================================================================== component
export default class extends React.Component{
	state = {
        data:[],
        pag: {},
        selectedKeys:[],
        submit: [
            { label: '键',      name: 'absurd_key',         required: true },
            { label: '条件',    name: 'absurd_condition',   required: true,     type: 'select',     data: [] },
            { label: '规则',    name: 'absurd_rule',        required: true,     type: 'select',     data: [] },
            { label: '值',      name: 'absurd_value',       required: true },
            { label: '状态',    name: 'enabled',            type: 'select',     data: [] },
            { label: '排序',    name: 'sort' },
            { label: '说明',    name: 'absurd_description', type: 'textarea',   full: true,         width: '100%' },
        ],
        
    }
    model = {}
	componentDidMount(){
        const { submit } = this.state
        submit[1].data = conditionOption
        submit[2].data = ruleOption
        submit[4].data = statusOption
    }
    componentWillReceiveProps(props) {
        if (props.uuid) {
            this.model = {absurd_id: props.uuid}
            this.fetch(this.model)
        }
    }
    // paging
    fetch = param => $fn.fetch.call(this,'lis-absurd-data-config/index', param)
    // table
	cols = [
		{ type:'checkbox' },
		{ title: '键',      field: 'absurd_key' },
		{ title: '规则',    field: 'absurd_rule',       render: ({rows}) => {
            let d = ruleOption.filter(i => i.value === rows.absurd_rule)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
        { title: '值',      field: 'absurd_value' },
        { title: '条件',    field: 'absurd_condition',  render: ({rows}) => {
            let d = conditionOption.filter(i => i.value === rows.absurd_condition)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
        { title: '说明',    field: 'absurd_description' },
        { title: '状态',    field: 'enabled',           render: ({rows}) => {
            let d = statusOption.filter(i => i.value === rows.enabled)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
		{ title: '操作', align:'tc', render:({rows})=>{
			return (
				<div className='plr5'>
					<Button className='mr10' label='编辑' ghost onClick={e=>{
						this.refs.modal.open()
						const { submit } = this.state
						$http.submit(null,'lis-absurd-data-config/info',{ param:{uuid: rows.uuid} }).then(data=>{
                            this.rows = data
                            this.isEdit = true
                            $fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
                        })
					}}  />
				</div>
			)
		}},
	]
	render(){
        const { submit, pullLoading, data, pag } = this.state
		return (
            <>
                <div className='fxmj'>
                    <h6 className="w xmlr pl20 h40 b">列表明细</h6>
                    <div className='fxm'>
                        <Button label='添加' size='small' disabled={!this.props.uuid} className='mr15 dkm' onClick={() => {
                            this.refs.modal.open()
                            const { submit } = this.state
                            submit.map(item => {
                                item.value = ''
                                if (item.name === 'sort') {
                                    item.value = '50'
                                }
                                if (item.name === 'enabled') {
                                    item.value = '1'
                                }
                            })
                            this.isEdit = false
                            this.setState({ submit })
                        }} />
                        <Button label='删除' ghost size='small' disabled={this.state.selectedKeys.length===0} className='mr15 dkm' onClick={(v) => {
                            const param = {uuid: this.state.selectedKeys.map(v=>v.uuid)} 
                            coms.interfaceConfirm('lis-absurd-data-config/del', '删除', param, () => { 
                                this.fetch(this.model)
                                this.setState({selectedKeys: []})
                             })
                        }} />
                    </div>
                </div>
                <Table
                    className		= 'xplr'
                    cols			= { this.cols }
                    data 			= { data }
                    loading 		= { pullLoading }
                    onRow			= { (v) => this.setState({ selectedKeys: v }) }
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
								const param = { absurd_id: this.props.uuid, ...v, uuid: this.rows.uuid}
								$http.submit(null,'lis-absurd-data-config/edit',{ param }).then(data=>{
									message.then(f=>f.default.success('编辑成功'))
									this.refs.modal.close()
									this.fetch(this.model)
								})
							} else {
								const param = { absurd_id: this.props.uuid, ...v }
								$http.submit(null, 'lis-absurd-data-config/add', { param }).then(data => {
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
            </>
		)
	}
}