import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
const confirm = import('@antd/confirm')
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
// 联机状态
const relOptions = [
    { name: "切换",    value: '1' },
    { name: "启用",  value: '0' },
    { name: "停用",    value: '-1' }
]
const enabledOptions = [
    { name: "正常",    value: '1' },
    { name: "异常",  value: '-1' }
]
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		submit: [
			{ label: '设备名称',	name: 'device_id',		type: 'select',     data: [],       required: true, nameStr: 'title', idStr:'value'},
            { label: '设备编号',	name: 'device_number',	disabled: true },
			{ label: '单一项目',	name: 'kind_id',		type:'select',      data:[],        required: true, },
			{ label: '从属项目',	name: 'sub_kind_id',	type:'select',      data:[],        nameStr: 'kind_name',   idStr: 'uuid' },
			{ label: '通道号',		name: 'pass_num',		type:'select',	    data:[],        nameStr: 'title',		idStr: 'uuid' },
			{ label: '联机状态',	name: 'rel_status',     type:'select',	    data:[] },
		],
		// 编辑通道号
		submit1: [
			{ label: '设备名称',		name: 'device_name',	    disabled: true},
			{ label: '设备编号',		name: 'device_number',	    disabled: true},
			{ label: '通道号',			name: 'pass_num',		    required: true,		type: 'select',	data: [], nameStr: 'title', idStr: 'uuid'},
			{ label: '仪器项目名称',	name: 'device_pro_name',	disabled: true},
		]
	}
	forms = [
		{ label: '设备编号',        name:'device_number'},
		{ label: '设备名称',        name:'device_id',           type:'select', data: [], nameStr: 'title'},
		{ label: '设备型号',        name:'device_model'},
		{ label: '仪器通道号',      name:'pass_num'},
		{ label: '关联项目名称',    name:'sub_name'},
	]
    model = {device_id: $fn.query('id') || ''}
    getList({api, params, callback}) {
        $http.submit(null, api, {param: params}).then(data => {
            callback && callback(data)
        })
    }
	componentDidMount(){
        const { submit, submit1 } = this.state
        submit[5].data = relOptions
        $fn.dataSave('pass-num').then(local => {
            if ($fn.hasArray(local)) {
                submit1[2].data = local
            } else {
                $http.submit(null, 'de-pass-info/index').then(data => {
                  submit1[2].data = data  
                })
            }
            this.setState({submit1})
        })
        cacheApi.then(f => {
            const d = f.default
            // 单一项目
			$fn.getCache({
				cache: d.singleKindSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        submit[2].data = data
                    } else {
                        $http.submit(null, 'kind-info/kindSelect').then(data => {
                            submit[2].data = data
                            $fn.setCache()
                        })
                    }
				}
            })
            // 设备名称
            $fn.getCache({
                cache: d.deviceSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        data.forEach(v=> v.title = `${v.device_name}(${v.device_number}) - ${v.device_model}`)
                        submit[0].data = data
                        this.forms[1].data = data
                    } else {
                        $http.submit(null, 'device/select').then(data => {
                            data.forEach(v=> v.title = `${v.device_name}(${v.device_number}) - ${v.device_model}`)
                            submit[0].data = data
                            this.forms[1].data = data
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
	fetch = param => $fn.fetch.call(this,'de-rel-kind/index', param)
	// table
	cols = [
        { type:'checkbox' },
		{ title: '编号',		    field: 'device_number',		width: 100 },
		{ title: '设备型号', 		field: 'device_model',		width: 160 },
		{ title: '设备名称', 	    field: 'device_name',		width: 150 },
		{ title: '关联项目代码', 	field: 'sub_code',			width: 100 },
		{ title: '关联项目名称', 	field: 'sub_name',	        width: 130 },
		{ title: '自然项目代码', 	field: 'kind_code', 		width: 100 },
		{ title: '自然项目名称',	field: 'kind_name',			width: 130 },
		{ title: '仪器通道号',		field: 'pass_num',		    width: 100 },
		{ title: '联机状态',		field: 'rel_status',		width: 100, render: ({rows}) => {
            let d = relOptions.filter(i => i.value === rows.rel_status)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        } },
		{ title: '状态',		    field: 'enabled',		    width: 100, render: ({rows}) => {
            let d = enabledOptions.filter(i => i.value === rows.enabled)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        } },
		{ title: '操作', align:'tc', width:300, render:({rows})=>{
			return (
				<div className='plr5'>
                    <Button label='停用' ghost onClick={() => {
                        confirm.then(f => {
							f.default({
								msg: '是否确认停用?',
								onOk: close => {
									$http.submit(null, 'de-rel-kind/setStatus', { param: { uuid: [rows.uuid], rel_status: "-1" } }).then(data => {
										message.then(f => f.default.success('操作成功'))
										this.fetch(this.model)
										close()
									})
								}
							})
						})
                    }} />
                    <Button label={rows.rel_status === '-1' ? '正常' : '异常'} className='ml15' ghost onClick={() => {
                        confirm.then(f => {
							f.default({
								msg: `是否确认${rows.rel_status === '-1' ? '正常' : '异常'}?`,
								onOk: close => {
									$http.submit(null, 'de-rel-kind/abnormal', { param: { uuid: rows.uuid, rel_status: rows.rel_status === '-1' ? '0' : '-1' } }).then(data => {
										message.then(f => f.default.success('操作成功'))
										this.fetch(this.model)
										close()
									})
								}
							})
						})
                    }} />
					<Button label='编辑通道号' className='ml15' ghost onClick={e=>{
						const { submit1 } = this.state
						$http.submit(null, 'de-rel-kind/info', {param: {uuid: rows.uuid}}).then(data => {
							this.getList({api: 'de-pass-info/passInfo', params: {device_id: data.device_id}, callback: (res) => {
								const d = res.items
								d.forEach(v=> v.title = `${v.pass_num}(${v.device_pro_name})`)
								if ($fn.hasArray(d)) {
									submit1[2].data = d
								} else {
									submit1[2].data = []
								}
							}})
							this.refs.modal1.open()
							submit1[0].value = data['device_name']
							submit1[1].value = data['device_number']
							submit1[2].value = data['pass_num']
							submit1[3].value = data['device_pro_name']
							this.rows = data
							this.setState({submit1})
						})
					}}  />
				</div>
			)
		}},
	]
	ButtonGroup = () => {
		return [
            { label: '联机F1', code: 'F1', disabled: !this.state.selectedKeys.length, onClick: () => {
                confirm.then(f => {
                    f.default({
                        msg: '是否确认联机?',
                        onOk: close => {
                            const keys = this.state.selectedKeys.map(v=>v.uuid)
                            $http.submit(null, 'de-rel-kind/setStatus', { param: { uuid: keys, rel_status: "0" } }).then(data => {
                                message.then(f => f.default.success('联机成功'))
                                this.fetch(this.model)
                                close()
                            })
                        }
                    })
                })
            } },
			{ label:'添加 F2', code:'F2', onClick:()=>{
				this.refs.modal.open()
				const { submit } = this.state
				submit[0].value = ''
				submit[1].value = ''
				submit[2].value = ''
				submit[3].value = ''
				submit[4].value = ''
				submit[5].value = ''
				this.setState({ submit })
            } }
		]
	}
	render(){
		const { data, pullLoading, pag, submit, submit1 } = this.state
		return (
			<Page title='项目关联' ButtonGroup={this.ButtonGroup()}>
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
				<Modal ref='modal' title='添加' width={648} noFooter>
					<SubmitForm
						modal
                        data = { submit }
                        onChange    = {(v, press, { name, data }) => {
                            const { submit } = this.state;
                            if (name && name === 'kind_id') {
                                this.getList({api: 'kd-subordinate-set/subSelect', params: {kind_id: v}, callback: (res) => {
                                    if ($fn.hasArray(res.items)) {
                                        submit[3].data = res.items
                                    } else  {
                                        submit[3].data = []
                                    }
                                    this.submitVal2 = v
                                    this.submitVal3 = ''
                                    submit[0].value = this.submitVal0
                                    submit[2].value = this.submitVal2
                                    submit[1].value = this.submitVal1
                                    submit[3].value = this.submitVal3
                                    submit[4].value = this.submitVal4
                                    submit[5].value = this.submitVal5
                                    this.setState({submit})
                                }})
                            } 
                            if (name && name === 'device_id') {
                                this.getList({api: 'de-pass-info/select', params: {device_id: v}, callback: (res) => {
                                    res.forEach(v=> v.title = `${v.pass_num}(${v.device_pro_name})`)
                                    if ($fn.hasArray(res)) {
                                        submit[4].data = res
                                    } else {
                                        submit[4].data = []
                                    }
                                    this.submitVal0 = v
                                    const d = submit[0].data.filter(i => i.value === v)
                                    this.submitVal1 = d[0].device_number
                                    this.submitVal4 = ''
                                    submit[0].value = v
                                    submit[1].value = this.submitVal1
                                    submit[2].value = this.submitVal2
                                    submit[3].value = this.submitVal3
                                    submit[4].value = this.submitVal4
                                    submit[5].value = this.submitVal5
                                    this.setState({submit})
                                }})
                            }
                            if (name === 'sub_kind_id') {
                                this.submitVal3 = v
                            }
                            if (name === 'pass_num') {
                                this.submitVal4 = v
                            }
                            if (name === 'rel_status') {
                                this.submitVal5 = v
                            }
                        } } 
						onSubmit = { v => {
                            const param = { ...v }
                            $http.submit(null, 'de-rel-kind/add', { param }).then(data => {
                                message.then(f => f.default.success('添加成功'))
                                this.refs.modal.close()
                                this.fetch(this.model)
                            })
						}}
                        onClose = { ()=>this.refs.modal.close() }
                        init    = { form => form.setFieldsValue({rel_status: '0'}) }
					 />
				</Modal>
				<Modal ref='modal1' title='编辑通道号' width={648} noFooter>
					<SubmitForm
						modal
						data = { submit1 }
						onChange = { (v, press, { name, data }) => {
							if (name === 'pass_num') {
								const d = submit1[2].data.filter(i => i.uuid === v)
								submit1[2].value = d[0].pass_num
								submit1[3].value = d[0].device_pro_name
								this.setState({submit1})
							}
						} }
						onSubmit = { v => {
							const param = { ...this.rows, ...v}
							$http.submit(null,'de-rel-kind/edit',{ param }).then(data=>{
								message.then(f=>f.default.success('编辑成功'))
								this.refs.modal1.close()
								this.fetch(this.model)
							})
						}}
                        onClose = { ()=>this.refs.modal1.close() }
					 />
				</Modal>
			</Page>
		)
	}
}