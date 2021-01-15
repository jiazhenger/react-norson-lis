import { Checkbox } from 'antd'
import React from 'react'
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const message = import('@antd/message')
// ===================================================================== private template
const Page = $async(() => import('#tp/page-container'))
const Button = $async(() => import('@antd/button'))
const Table = $async(() => import('#cpt/table'))
const SubmitForm = $async(() => import('#cpt/submit-form'))
// ===================================================================== private component
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== component
const HospChildTable = $async(()=>import('./hosp-child-table'))

export default class extends React.Component {
	state = {
		data: [],
		pag: {},
		data1: [],
		pag1: {},
		deviceStadius: [],
		department: [],
		submit: [
			{ label: '医院编码', name: 'hosp_code', title: '医院基础信息', disabled: true },
			{ label: '医院条码', name: 'hosp_spec', required: true, },
			{ label: '医院全称', name: 'hosp_name', required: true, },
			{ label: '医院别称', name: 'hosp_other_name', },
			{ label: '英文名称', name: 'hosp_english_name', },
			{ label: '医院级别', name: 'level', type: 'select', data: [], },
			{ label: '医院性质', name: 'nature', required: true, type: 'select', data: [], },
			{ label: '医院电话', name: 'telephone', },
			{ label: '医院传真', name: 'fax', },
			{ label: '法人代表', name: 'legal_person', },
			{ label: '社会统一信用代码', name: 'social_credit_code', },
			{ label: '银行账号', name: 'bank_account', },
			{ label: '银行账号名称', name: 'bank_account_name', },
			{ label: '开户行', name: 'opening_bank', },
			{ label: '开户行地址', name: 'opening_address', width: '480px', },
			{ label: '医院地址信息', name: 'areaData', type: 'address', data: [], width: '480px', },
			{ label: '开票单位名称', name: 'organization_name', },
			{ label: '开票单位编码', name: 'organization_code', },
			{ label: '医院联系人', name: 'hospital_contacts', },
			{ label: '联系人电话', name: 'hospital_phone', },
			{ label: '医院详细地址', name: 'address', width: '480px', },
			{ label: '医院logo', name: 'logo', type: 'upload', params: { modular: 124 }, },
		],
		submit1 : [
			{ label: '业务区域', 		name: 'region', 		type: 'select', 	data: [], required: true, width: '500px', title: '业务信息', },
			{ label: '客户等级', 		name: 'customer_level', type: 'select', 	data: [], },
			{ label: '区域经理', 		name: 'regional_super_id',type: 'select', 	data: [], disabled: true, },
			{ label: '大区经理', 		name: 'serial_user', 	type: 'select', 	data: [], required: true, },
			{ label: '业务员', 	 		name: 'salesman', 		type: 'select', 	data: [], mode: 'multiple',required: true, width: '500px', },
			{ label: '回款方式', 		name: 'back_money', 	type: 'select', 	data: [], },
			{ label: '结算单打印要求', 	name: 'printing', 		type: 'textarea', 	full: true, width: '100%', },
			{ label: '特别注意事项', 	name: 'need_matter', 	type: 'textarea', 	full: true, width: '100%', },
		],
		submit2: [
			{ label: '标本收取人', 		name: 'collector', type: 'select', mode: 'multiple', width: '480px', required: true, title: '物流信息', },
			{ label: '物流区域主管', 	name: 'logistics_area_super_id',   type: 'select',   data: [],		 required: true, },
		],
		submit3: [
			{ label: '报告单大小要求', 		name: 'report_size', 			type: 'select', data: [], required: true, title: '客户报告单要求信息', },
			{ label: '报告单主标题', 		name: 'report_rise', },
			{ label: '报告单副标题', 		name: 'custom_report_rise', },
			{ label: '报告单二级标题', 		name: 'custom_report_rise_sub', },
			{ label: '报告单是否加盖印章', 	name: 'is_stamp', 				type: 'select', data: [], nameStr: 'label', idStr: 'value', },
			{ label: '报告单是否显示网页', 	name: 'is_display_web', 		type: 'select', data: [], nameStr: 'label', idStr: 'value', },
			{ label: '客服热线', 			name: 'service_hotline', },
			{ label: '是否显示客服热线', 	name: 'is_cust_service_hotline',type: 'select', data: [], nameStr: 'label', idStr: 'value', },
			{ label: '物流是否配送', 		name: 'is_delivery', 			type: 'select', data: [], nameStr: 'label', idStr: 'value', },
			{ label: '报告单配送份数', 		name: 'delivery_fraction', },
			{ label: '报告单检测方地址', 	name: 'custom_report_rise_path', type: 'textarea', full: true, width: '100%', },
			{ label: '公章', 				name: 'official_seal', 			type: 'upload', params: { modular: 124 }, },
			{ label: '病人资料特殊要求', 	name: 'patient_special_request', type: 'textarea', full: true, width: '100%', },
			{ label: '检测项目特殊要求', 	name: 'project_special_request', type: 'textarea', full: true, width: '100%', },
			{ label: '客户其他特殊要求', 	name: 'customer_special_request', type: 'textarea', full: true, width: '100%', },
		],
		submit4: [
			{ label: '联络人名称', 		name: 'critical_user',},
			{ label: '危急值联络科室', 	name: 'project_id', type: 'select', data: [], required: true, },
			{ label: '联系电话', 		name: 'critical_phone', },
			{ label: '危急值联络人邮箱',name: 'critical_email', },
			{ label: '备注', 		   name: 'remark', type: 'textarea', full: true, width: '100%', },
		],
		id: $fn.query('id'),
	}
	model= {
		hosp_id: $fn.query('id'),
	}
	showEdit = $fn.query('isEdit')
	isStampList = [{ value: "0", label: "否" }, { value: "1", label: "是" }]
	async getDataAsync() {
		const { submit, submit1, submit2, submit3, id } = this.state
		$fn.getDisItem({ // 医院级别
			code: 39000,
			callback: (data) => {
				submit[5].data = data
				this.setState({ deviceStadius: data, submit })
			}
		})
		$fn.getDisItem({ // 医院性质
			code: 44100,
			callback: (data) => {
				submit[6].data = data
				this.setState({ deviceStadius: data, submit })
			}
		})
		$fn.getDisItem({ // 客户等级
			code: 45100,
			callback: (data) => {
				submit1[1].data = data
				this.setState({ deviceStadius: data, submit1 })
			}
		})
		$fn.getDisItem({ // 回款方式
			code: 45200,
			callback: (data) => {
				submit1[5].data = data
				this.setState({ deviceStadius: data, submit1 })
			}
		})
		$fn.getDisItem({ // 报告单大小要求
			code: 38000,
			callback: (data) => {
				submit3[0].data = data
				this.setState({ deviceStadius: data, submit3 })
			}
		})
		$fn.getDisItem({ // 报告单大小要求
			code: 38000,
			callback: (data) => {
				submit3[0].data = data
				this.setState({ deviceStadius: data, submit3 })
			}
		})
		// 科室
		$fn.dataSave('project-team').then(local => {
			if ($fn.hasArray(local)) {
				submit[7].data = local
				this.setState({ department: local, submit: this.state.submit })
			} else {
				$http.pull(null, 'project-team/select').then(data => {
					submit[7].data = data
					this.setState({ department: data, submit: this.state.submit })
					$fn.dataSave('project-team', data)
				})
			}
		})
	}
	componentDidMount() {
		const { submit, submit1, submit2, submit3, submit4, showEdit } = this.state
		$http.submit(null, 'bs-hospital/add').then(data => {
			console.log(data);
			this.setState({id: data.uuid})
			this.hospInfo()
		})
		if (this.showEdit == 0) {
			submit.map(item =>  { item.disabled = true })
			submit1.map(item => { item.disabled = true })
			submit2.map(item => { item.disabled = true })
			submit3.map(item => { item.disabled = true })
		}
		cacheApi.then(f => {
			$fn.getCache({ // 业务区域
				cache: f.default.bsareaSelect, name: 'name', id: 'uuid', callback: (data) => {
					if ($fn.hasArray(data)) {
						submit1[0].data = data
					} else {
						$http.submit(null, 'bs-area/select').then(data => {
							submit1[0].data = data
							$fn.setCache()
						})
					}
					this.setState({ submit1 })
				}
			})
			$fn.getCache({ // 区域经理
				cache: f.default.employeeSelect, name: 'name', id: 'uuid', callback: (data) => {
					if ($fn.hasArray(data)) {
						submit1[2].data = data
						submit2[0].data = data
						submit2[1].data = data
					} else {
						$http.submit(null, 'employee/select').then(data => {
							submit1[2].data = data
							submit2[0].data = data
							submit2[1].data = data
							$fn.setCache()
						})
					}
					this.setState({ submit1 })
				}
			})
			$fn.getCache({ // 大区经理
				cache: f.default.bssalesmanSelect, name: 'name', id: 'uuid', callback: (data) => {
					if ($fn.hasArray(data)) {
						submit1[3].data = data
					} else {
						$http.submit(null, 'bs-salesman/select').then(data => {
							submit1[3].data = data
							$fn.setCache()
						})
					}
					this.setState({ submit1 })
				}
			})
			$fn.getCache({ // 科室
				cache: f.default.ProjectTeamSelect, name: 'name', id: 'uuid', callback: (data) => {
					if ($fn.hasArray(data)) {
						submit4[1].data = data
					} else {
						$http.submit(null, 'project-team/select').then(data => {
							submit4[1].data = data
							$fn.setCache()
						})
					}
					this.setState({ submit1 })
				}
			})
		})
		submit3[4].data = this.isStampList
		submit3[5].data = this.isStampList
		submit3[7].data = this.isStampList
		submit3[8].data = this.isStampList
		this.getDataAsync()
		this.hospInfo()
		this.fetch()
	}
	hospInfo() { // 请求详情
		const { submit, submit1, submit2, submit3, id } = this.state
		$http.submit(null, 'bs-hospital/info', { param: { uuid: id } }).then(data => {
			$fn.setSubmitValues(submit, data, () => { this.setState({ submit }) })
			$fn.setSubmitValues(submit1, data, () => { this.setState({ submit1 }) })
			$fn.setSubmitValues(submit2, data, () => { this.setState({ submit2 }) })
			$fn.setSubmitValues(submit3, data, () => { this.setState({ submit3 }) })
			const param = {area_id:submit1[0].value} // 业务员
			$http.submit(null, 'bs-salesman/select', { param }).then(data => {
				submit1[4].data = data.items
				this.forceUpdate()
				$fn.setCache()
			})
		})
	}
	fetch = param => $fn.fetch.call(this, 'bs-critical-value/index', {...this.model})
	cols = [
		{ type: 'checkbox' },
		{ title: '序号', field: 'id', width: 120 },
		{ title: '危急值联络人', field: 'critical_user', width: 120 },
		{ title: '危急值联络科室', field: 'project_name', width: 120 },
		{ title: '危急值联络电话', field: 'critical_phone', width: 120 },
		{ title: '危急值联络Email', field: 'critical_email', width: 120 },
		{ title: '备注', field: 'remark', width: 120 },
		{
			title: '操作', width: 120, render: ({ rows }) => {
				return (
					<div className='plr5'>
						<Button label='编辑' ghost className='ml15' onClick={() => {
							const { submit4 } = this.state
							this.refs.modal.open()
							$http.submit(null,'bs-critical-value/info', { param: { uuid: rows.uuid } } ).then(data=>{
								this.rows = data
								this.isEdit = true
								this.model.comp_id = data.comp_id
								this.model.uuid = data.uuid
								this.model.id = data.id
								this.model.enabled = 1
								$fn.setSubmitValues(submit4, data, ()=>{this.setState({submit4})})
							})
						}} />
					</div>
				)
			}
		},
	]
	validateServiceName = (text, value, callback) => {
		const { submit1 } = this.state
		submit1.map(item => {
			if (item.name === callback.name) {
				item.value = text
			}
		})
		submit1[0].data.map(item =>{
			if (submit1[0].value === item.value) {
				submit1[2].value = item.leader_id
				submit1[3].value = item.leader_id;
				this.forceUpdate()
			}
		})
		const param = {area_id:submit1[0].value}
		$http.submit(null, 'bs-salesman/select', { param }).then(data => {
			submit1[4].data = data.items
			this.forceUpdate()
			$fn.setCache()
		})
	}
	submitForms() {
		const { submit, submit1, submit2, submit3, id } = this.state
		let obj = {}
		submit.map(v => { obj[v.name] = v.value })
		submit1.map(v =>{ obj[v.name] = v.value })
		submit2.map(v =>{ obj[v.name] = v.value })
		submit3.map(v =>{ obj[v.name] = v.value })
		if(id) { // 编辑
			const param = {
				uuid: id,
				...obj
			}
			$http.submit(null, 'bs-hospital/edit',{ param }).then(data => {
				message.then(f=>f.default.success('操作成功'))
				$fn.back(this)
			})
		} else { // 新增
			const param = { ...obj }
			$http.submit(null, 'bs-hospital/add',{ param }).then(data => {
				message.then(f=>f.default.success('操作成功'))
				$fn.back(this)
			})
		}
	}
	render() {
		const { data, pullLoading, pag, submit, selectedKeys, submit1, submit2, submit3, submit4, id } = this.state
		return (
			<Page title={id ? '医院客户编辑' : '医院客户新增'}>
				<div className='oxys'>
					<Button label='返回' size='small' className='dkm ml30 mt10' onClick={() => $fn.back(this)} />
					<Button label='保存' size='small' disabled={this.showEdit == 1?false:true}  className='dkm ml30 mt10' onClick={() => {
						this.submitForms()
					}} />
					<div className='mb20 p20'>
						<SubmitForm
							modal
							display={true}
							data={submit}
							onChange={(v, press, { name, data }) => { 
								submit.map(item => {
									if (item.name === name) {
										item.value = v
									}
								})
							 }}
							onSubmit={v => { }}
							onClose={() => this.refs.modal.close()}
							init={form => this.form = form}
						/>
					</div>
					<div className='fxbc fxmj'>
						<h6 className="w xmlr pl20 h40 b">危急值联络人</h6>
						<div className='fxbc fxmj mb10' >
							<Button label='新增' size='small' className='dkm' onClick={() => {
								this.refs.modal.open()
								this.isEdit = false
							 }} />
							<Button label='删除' disabled={selectedKeys?false:true} size='small' className='dkm ml15 mr10' onClick={() => {
								console.log(selectedKeys);
								const uuid = []
								selectedKeys.map(item => {
									uuid.push(item.uuid)
								})
								const param={
									uuid:uuid
								}
								$http.submit(null, 'bs-critical-value/del', {param}).then(data => {
									message.then(f => f.default.success('删除成功'))
									this.fetch()
								})
							}} />
						</div>
					</div>
					<Table
						className='xplr'
						cols={this.cols}
						data={data}
						loading={pullLoading}
						onRow={current => { this.setState({selectedKeys:current}) }}
						pag={pag}
						onChange={(current, pageSize) => $fn.pageChange.call(this, { current, pageSize })}
						onSort={v => $fn.onSort.call(this, v)}
					/>
					<div className='ex fv xplr pt10'>
						<SubmitForm
							modal
							display={true}
							data={submit1}
							onChange={(v, press, { name, data }) => this.validateServiceName(v, press, { name, data })}
							init={form => this.form = form}
						/>
					</div>
					<div className='ex fv xplr pt10'>
						<SubmitForm
							modal
							display={true}
							data={submit2}
							onChange={(v, press, { name, data }) => { 
								submit2.map(item => {
									if (item.name === name) {
										item.value = v
									}
								})
							 }}
							init={form => this.form = form}
						/>
					</div>
					<HospChildTable ID={ id || '' }  />
					<div className='ex fv xplr pt10'>
						<SubmitForm
							modal
							display={true}
							data={submit3}
							onChange={(v, press, { name, data }) => { 
								submit3.map(item => {
									if (item.name === name) {
										item.value = v
									}
								})
							 }}
							init={form => this.form = form}
						/>
					</div>
				</div>
				<Modal ref='modal' title={this.isEdit?'编辑':'添加'} width={648} noFooter>
					<SubmitForm
						modal
						data = { submit4 }
						onChange    = {(v, press, { name, data }) => { } } 
						onSubmit = { v => { 
							const param={
								...v,
								...this.model
							}
							if (this.isEdit) {
								$http.submit(null, 'bs-critical-value/edit', { param }).then(data => {
									this.refs.modal.close()
									message.then(f => f.default.success('编辑成功'))
									this.fetch()
								})
							}else {
								$http.submit(null, 'bs-critical-value/add', { param }).then(data => {
									this.refs.modal.close()
									message.then(f => f.default.success('添加成功'))
									this.fetch()
								})
							}
						}}
						onClose = { ()=>this.refs.modal.close() }
						init    = { form => this.formSubmit = form }
					/>
					</Modal>
			</Page>
		)
	}
}