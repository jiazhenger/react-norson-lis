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
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
const enabledOptions = [
    { name: "未执行", value: "1" },
    { name: "已执行", value: "2" }
]
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		submit: [
			{ label: '设备名称',	    	name: 'device_id',		    required: true,     type: 'select',     data: [],       nameStr: 'title', idStr:'value'},
            { label: '设备编号',	    	name: 'device_number',      disabled: true },
            { label: '设备型号',	    	name: 'device_model',	    disabled: true },
            { label: '所属科室',			name: 'project_name',       disabled: true },
			{ label: '维修总时长',			name: 'repair_time' },
			{ label: '总故障时间',			name: 'total_time' },
			{ label: '维修后确认方式',	    name: 'con_mode' },
			{ label: '故障日期',	    	name: 'fault_time',			type:'date-time', after:true },
			{ label: '厂商维修人员',	    name: 'repair_user' },
			{ label: '故障原因',	    	name: 'fault_reason',		type: 'textarea' },
			{ label: '修理情况概述',	    name: 'reason',				type: 'textarea' },
			{ label: '对病人结果的影响',	name: 'result_infl',		type: 'textarea' },
			{ label: '操作人员',			name: 'operator_user' },
			{ label: '操作日期',			name: 'operator_time',		type:'date-time', after:true },
			{ label: '审核人员',			name: 'auditor' },
			{ label: '审核日期',			name: 'auditor_time',		type:'date-time', after:true },
        ],
	}
	componentDidMount(){
        const { submit } = this.state
        cacheApi.then(f => {
            const d = f.default
            // 设备名称
            $fn.getCache({
                cache: d.deviceSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        data.forEach(v=> v.title = `${v.device_name}(${v.device_number}) - ${v.device_model}`)
                        submit[0].data = data
                    } else {
                        $http.submit(null, 'device/select').then(data => {
                            data.forEach(v=> v.title = `${v.device_name}(${v.device_number}) - ${v.device_model}`)
                            submit[0].data = data
                            $fn.setCache()
                        })
                    }
                }
            })
            this.setState({submit})
        })

		this.fetch()
	}
	// paging
	fetch = param => $fn.fetch.call(this,'de-repair-log/index', param)
	// table
	cols = [
		{ title: '设备名称', 	    field: 'device_name',		width: 150 },
		{ title: '设备型号', 		field: 'device_model',		width: 160 },
		{ title: '故障日期', 		field: 'fault_time',		width: 150 },
		{ title: '故障原因',		field: 'fault_reason',		width: 100 },
		{ title: '厂家维修人员', 	field: 'repair_user',	     width: 130 },
		{ title: '状态', 			field: 'enabled',        	width: 130, render: ({rows}) => {
            const d = enabledOptions.filter(i => i.value === rows.imple_sit)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        } },
		{ title: '操作', align:'tc', width:150, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='故障设备明细' className='ml15' ghost onClick={e=>{
						const { submit } = this.state
						$http.submit(null, 'de-repair-log/info', {param: {uuid: rows.uuid}}).then(data => {
							this.refs.modal.open()
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
            { label:'维修记录新增 F2', code:'F2', onClick:()=>{
				const { submit } = this.state
				this.refs.modal.open()
				submit[0].value = ''
				submit[1].value = ''
				submit[2].value = ''
				submit[3].value = ''
				submit[4].value = ''
				submit[5].value = ''
				submit[6].value = ''
				submit[7].value = ''
				submit[8].value = ''
				submit[9].value = ''
				submit[10].value = ''
				submit[11].value = ''
				submit[12].value = ''
				submit[13].value = ''
				submit[14].value = ''
				submit[15].value = ''
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
			<Page title='维修记录' ButtonGroup={this.ButtonGroup()}>
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
				<Modal ref='modal' title={this.isEdit ? '故障设备明细' : '维修记录新增'} width={648} noFooter>
					<SubmitForm
						modal
                        data		= { submit }
                        onChange    = {(v, press, { name, data }) => {
                            const { submit } = this.state;
                            if (name === 'device_id') {
                                this.deviceInfo = submit[0].data.filter(i => i.value === v)
                                if ($fn.hasArray(this.deviceInfo)) {
									const d = this.deviceInfo[0]
									$http.submit(null, 'project-team/info', { param: {uuid: d.pgroup_id} }).then(data => {
										this.form = {
											project_id: data.uuid || ''
										}
										const form = {
											device_name: d.device_name,
											device_number: d.device_number,
											device_model: d.device_model,
											project_name: data.project_name || ''
										}
										this.formSubmit.setFieldsValue({...form})
									})
                                }
                            }
                        } } 
						onSubmit	= { v => {
                            if (this.isEdit) {
								const param = { ...this.rows, ...v }
								$http.submit(null, 'de-repair-log/editNew', { param }).then(data => {
									message.then(f => f.default.success('修改成功'))
									this.refs.modal.close()
									this.fetch()
								})
							} else {
								const param = { ...v, ...this.form }
								$http.submit(null, 'de-repair-log/add', { param }).then(data => {
									message.then(f => f.default.success('添加成功'))
									this.refs.modal.close()
									this.fetch()
								})
							}
						}}
                        onClose		= { ()=>this.refs.modal.close() }
                        init    	= { form => this.formSubmit = form }
					 />
				</Modal>
			</Page>
		)
	}
}