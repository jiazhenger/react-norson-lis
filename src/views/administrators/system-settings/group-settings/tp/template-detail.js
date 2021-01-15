import React from 'react'
import Modal from '@antd/modal'
import Input from '@antd/form/input'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// ===================================================================== global template
const Text = $async(()=>import('@tp/text'))
// ===================================================================== private template
// ===================================================================== private component
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== 页面常量
const statusOption = [
    { name: '启用', value: '1' },
    { name: '待启用', value: '0' },
    { name: '禁用', value: '-1' }
]
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
        selectedKeys:[],
        submit: [
            { label: '物价',    name:'price',       required: true, full: true, width: '100%'},
		    { label: '状态',    name: 'enabled',    required: true, full: true, width: '100%',  type: 'select', data: []},
        ],
        item_name: ''
	}
	model = {}
	componentDidMount(){
		const { submit } = this.state
        submit[1].data = statusOption.filter(i => i.value !== '-1')
    }
    componentWillReceiveProps(props) {
        this.model = {qt_temp_id: props.qt_temp_id}
        if (props.qt_temp_id) {
            this.fetch(this.model)
        }
    }
	// paging
	fetch = param => $fn.fetch.call(this,'qt-comp-item/index', param)
	// table
	cols = [
		{ title: '物价代码',    field: 'price_code',				width: 100 },
		{ title: '关联物价',	field: 'price_rel_codes',			width: 100 },
		{ title: '中文简称',	field: 'item_name_sort',			width: 180 },
		{ title: '项目名称',	field: 'item_name',				    width: 180 },
		{ title: '英文简称',	field: 'item_name_en_sort',			width: 100 },
		{ title: '英文名称',	field: 'item_name_en',				width: 220 },
		{ title: '检测方法',	field: 'detection_method_name',		width: 180 },
		{ title: '标准价格',	field: 'price',				        width: 90 },
		{ title: '结算价格',	field: 'contract_price',			width: 90 },
		{ title: '助记码',      field: 'qt_item_code',				width: 90 },
		{ title: '备注',        field: 'remark',				    width: 120 },
		{ title: '状态',        field: 'enabled',				    width: 80,		render: ({rows}) => {
            let d = statusOption.filter(i => i.value === rows.enabled)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
		{ title: '操作',    align:'tc',   width: 200, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button className='mr10' label='编辑' ghost onClick={e=>{
                        this.refs.modal.open()
                        const { submit } = this.state
						$http.submit(null,'qt-comp-item/info',{ param:{qt_temp_id: this.props.qt_temp_id, source_item_id: rows.uuid} }).then(data=>{
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
        const { data, pullLoading, pag, submit } = this.state
        const { qt_temp_id } = this.props
		return (
			<>
				{/* 搜索 */}
                <div className='fxmj mb10'>
                    <Input size='middle' p='请输入项目名称' ref='restItem' width={190} bordered={false} onChange={v=> this.state.item_name = v}  />
                    <div>
                        <Button label='查询' size='small' className='mr15 dkm' disabled={!qt_temp_id} onClick={() => {
                            this.fetch({...this.model, item_name: this.state.item_name})
                        }} />
                        <Button label='重置' size='small' className='mr15 dkm' disabled={!qt_temp_id} onClick={(v) => {
                            this.refs.restItem.clear()
                            this.setState({item_name: ''})
                            this.fetch(this.model)
                        }} />
                    </div>
                </div>
                
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
                <Modal ref='modal' title={this.isEdit ? '编辑' : '添加'} width={500} noFooter>
                    <SubmitForm
                        modal
                        data = { submit }
                        onSubmit = { v => {
                            if (this.isEdit) {
                                const param = { ...this.rows, ...v}
                                $http.submit(null,'qt-comp-item/edit',{ param }).then(data=>{
                                    message.then(f=>f.default.success('编辑成功'))
                                    this.refs.modal.close()
                                    this.fetch(this.model)
                                })
                            } else {}
                            
                        }}
                        onClose = { ()=>this.refs.modal.close() }
                        init    = { form => this.form = form }
                    />
                </Modal>
			</>
		)
	}
}