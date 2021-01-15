import React from 'react'
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
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
const compleOptions = [
    { name: "已完成", value: "1" },
    { name: "未完成", value: "2" }
]
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		submit: [
            { label: '设备名称',	    name: 'device_id',		    required: true,     type: 'select',     data: [],       nameStr: 'title', idStr:'value'},
            { label: '设备编号',	    name: 'device_number',      disabled: true },
            { label: '设备型号',	    name: 'device_model',	    disabled: true },
            { label: '生产厂家',	    name: 'serial_man',         disabled: true },
			{ label: '维护周期',		name: 'imple_cycle',        required: true },
			{ label: '执行方',		    name: 'imple_party' },
			{ label: '维护内容',	    name: 'repair_content',     type:'textarea' },
        ],
        submit1: [
            { label: '设备名称',	    name: 'device_id',		    required: true,     type: 'select',     data: [],       nameStr: 'title', idStr:'value'},
            { label: '设备编号',	    name: 'device_number',      disabled: true },
            { label: '设备型号',	    name: 'device_model',	    disabled: true },
            { label: '生产厂家',	    name: 'serial_man',         disabled: true },
			{ label: '维护周期',		name: 'imple_cycle',        required: true },
			{ label: '执行方',		    name: 'imple_party' },
			{ label: '维护内容',	    name: 'repair_content' },
			{ label: '执行情况',	    name: 'imple_sit',     type:'select', data: [] },
			{ label: '备注',	        name: 'remark' },
		],
	}
	forms = [
		{ label: '设备名称',        name:'device_id',           type:'select', data: [], nameStr: 'title'},
		{ label: '设备编号',        name:'device_number'}
	]
    model = {device_id: $fn.query('id') || ''}
	componentDidMount(){
        const { submit, submit1 } = this.state
        submit1[7].data = compleOptions
        cacheApi.then(f => {
            const d = f.default
            // 设备名称
            $fn.getCache({
                cache: d.deviceSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        data.forEach(v=> v.title = `${v.device_name}(${v.device_number}) - ${v.device_model}`)
                        submit[0].data = data
                        submit1[0].data = data
                        this.forms[0].data = data
                    } else {
                        $http.submit(null, 'device/select').then(data => {
                            data.forEach(v=> v.title = `${v.device_name}(${v.device_number}) - ${v.device_model}`)
                            submit[0].data = data
                            submit1[0].data = data
                            this.forms[0].data = data
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
	fetch = param => $fn.fetch.call(this,'de-device-repair/index', param)
	// table
	cols = [
        { type:'checkbox' },
		{ title: '设备名称', 	    field: 'device_name',		width: 150 },
		{ title: '设备编号',		field: 'device_number',		width: 100 },
		{ title: '设备型号', 		field: 'device_model',		width: 160 },
		{ title: '生产厂家', 	field: 'serial_man',			width: 100 },
		{ title: '维护周期',		field: 'imple_cycle',		    width: 100 },
		{ title: '执行方', 	field: 'imple_party',	        width: 130 },
		{ title: '执行人', 	field: 'imple_user',	        width: 130 },
		{ title: '维护时间', 	field: 'repair_at',	        width: 150, align: 'tc' },
		{ title: '执行情况', 	field: 'imple_sit',	        width: 130, render: ({rows}) => {
            const d = compleOptions.filter(i => i.value === rows.imple_sit)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        } },
		{ title: '维护内容', 	field: 'repair_content',	        width: 130 },
		{ title: '备注', 	field: 'remark',	        width: 130 },
		{ title: '操作', align:'tc', width:150, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='维护登记' className='ml15' ghost onClick={e=>{
                        const { submit1 } = this.state
						$http.submit(null, 'de-device-repair/info', {param: {uuid: rows.uuid}}).then(data => {
							this.refs.modal1.open()
							this.rows = data
                            this.isEdit = true
                            $fn.setSubmitValues(submit1, data, ()=>{this.setState({submit1})})
						})
					}}  />
				</div>
			)
		}},
	]
	ButtonGroup = () => {
		return [
            { label:'维护计划 F2', code:'F2', onClick:()=>{
				this.refs.modal.open()
				const { submit } = this.state
				submit[0].value = ''
				submit[1].value = ''
				submit[2].value = ''
				submit[3].value = ''
				submit[4].value = ''
				submit[5].value = ''
				submit[6].value = ''
				this.setState({ submit })
            } },
            { label:'设备维修', onClick:()=>{
				$fn.push(this, $fn.getRoot().root + 'laboratory-manage/equipment-maintain/repair')
            } },
            { label:'维修记录', onClick:()=>{
				$fn.push(this, $fn.getRoot().root + 'laboratory-manage/equipment-maintain/repair-record')
			} }
		]
	}
	render(){
		const { data, pullLoading, pag, submit, submit1 } = this.state
		return (
			<Page title='设备维护' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
                    onChange    = {(v, press, { name, data }) => {
						$fn.onChange.call(this, v, press, () => {
							if (name && name === 'device_id') {
								return { device_name: data.device_name }
							}
						})
					} } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onAdd		= { this.onAdd } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
					init        = { form => form.setFieldsValue({device_id: this.model.device_id}) }
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
				<Modal ref='modal' title='计划新增' width={648} noFooter>
					<SubmitForm
						modal
                        data = { submit }
                        onChange    = {(v, press, { name, data }) => {
                            const { submit } = this.state;
                            if (name === 'device_id') {
                                this.deviceInfo = submit[0].data.filter(i => i.value === v)
                                if ($fn.hasArray(this.deviceInfo)) {
                                    const d = this.deviceInfo[0]
                                    const form = {
                                        device_name: d.device_name,
                                        device_number: d.device_number,
                                        device_model: d.device_model,
                                        serial_man: d.serial_man
                                    }
                                    this.formSubmit.setFieldsValue({...form})
                                }
                            }
                        } } 
						onSubmit = { v => {
                            const param = { ...v }
                            $http.submit(null, 'de-device-repair/add', { param }).then(data => {
                                message.then(f => f.default.success('添加成功'))
                                this.refs.modal.close()
                                this.fetch(this.model)
                            })
						}}
                        onClose = { ()=>this.refs.modal.close() }
                        init    = { form => this.formSubmit = form }
					 />
				</Modal>
                <Modal ref='modal1' title='维护登记' width={648} noFooter>
					<SubmitForm
						modal
                        data        = { submit1 }
                        onChange    = {(v, press, { name, data }) => {
                            if (name === 'device_id') {
                                this.deviceInfo = submit1[0].data.filter(i => i.value === v)
                                if ($fn.hasArray(this.deviceInfo)) {
                                    const d = this.deviceInfo[0]
                                    const form = {
                                        device_name: d.device_name,
                                        device_number: d.device_number,
                                        device_model: d.device_model,
                                        serial_man: d.serial_man
                                    }
                                    this.formSubmit.setFieldsValue({...form})
                                }
                            }
                        } } 
						onSubmit     = { v => {
                            const param = { ...this.rows, ...v }
                            $http.submit(null, 'de-device-repair/edit', { param }).then(data => {
                                message.then(f => f.default.success('编辑成功'))
                                this.refs.modal1.close()
                                this.fetch(this.model)
                            })
						}}
                        onClose     = { ()=>this.refs.modal1.close() }
                        init        = { form => this.formSubmit = form }
					 />
				</Modal>
			</Page>
		)
	}
}