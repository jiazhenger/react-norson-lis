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
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		deviceStadius:[],
		submit: [
			{ label: '报告单模板',              name: 'tmpl_id',        required: true,        type:'select',      data:[],    onChange: (v, press, { name, data }) => {
                this.tmpl_id = v
                this.getTemplateVer({report_tpl_id: v})
            } },
			{ label: '模板版本号',              name: 'tmpl_vs_id',     required: true,        type:'select',       data:[]},
        ],
        submit1: [{ label:'原因',               name:'reason',          type: 'textarea',      full: true,          width: '100%'}],
        submit2: [
            { checkLabel: '是否生成终止报告单',  name:'termination',    full: true,             width: '100%',      type: 'checkbox',   onChange: (v, press, {name}) => {
                this.termination = v ? '1' : '0'
            } },
            { label: '异常原因类型',            name: 'abnormal_type',  full: true,             width: '100%',     type:'select',       data:[],    onChange: (v, press, { name, data }) => {
                this.changeType(v)
            } },
            { label: '原因',                    name: 'reason',         full: true,             width: '100%',     type:'textarea',     required: true, onChange: (v, press, {name}) => {
                this.abnormal_reason = v
            } },
        ],
        submit3: [{ label:'标本条码',           name:'spec_code',       type: 'textarea',       full: true,         width: '100%'}]
	}
	forms = [
        { label:'编号',             name:'spec_num'},
        { label:'标本条码',         name:'spec_code'},
		{ label:'状态',             name:'status',          type:'select',      data:[]},
        { label:'医院',             name:'hosp_id',         type:'select',      data:[]},
        { label:'姓名',             name:'patient_name'},
        { label: '生成时间',        name:'date',			type:'date-range',	names:['start_date','end_date'], value:[] },
	]
    model = {}
    // 获取版本号
    getTemplateVer(param) {
        const { submit } = this.state
        $http.submit(null, 'kd-report-from-version/select', {param}).then(data => {
            submit[0].value = this.tmpl_id
            submit[1].data = data.items
        })
        this.setState({submit})
    }
    // 异常原因类型
    changeType(val) {
        const { submit2 } = this.state
        let d = submit2[1].data.filter(i => {
          return String(i.value) === String(val);
        });
        if ($fn.hasArray(d)) {
            submit2[2].value = d[0].value !== '62051' ? d[0].name : (this.abnormal_reason || '')
        }
        submit2[0].value = this.termination
        submit2[1].value = val
        this.setState({submit2})
      }
	componentDidMount(){
        const { submit, submit2 } = this.state
        // 状态
        $fn.getDisItem({
            code: 90,
            callback: (data) => {
                this.forms[2].data = data
            }
        })
        // 异常原因类型
        $fn.getDisItem({
            code: 62050,
            callback: (data) => {
                submit2[1].data = data
                this.setState({submit2})
            }
        })
		cacheApi.then(f => {
            const d = f.default
            // 报告单模板
            $fn.getCache({
                cache: d.reportTemplate, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        submit[0].data = data
                    } else {
                        $http.submit(null, 'kd-report-from/select').then(data => {
                            submit[0].data = data
                            $fn.setCache()
                        })
                    }
                }
            })
            // 医院名称
            $fn.getCache({
                cache: d.BsHospitalSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        this.forms[3].data = data
                    } else {
                        $http.submit(null, 'bs-hospital/select').then(data => {
                            this.forms[3].data = data
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
	fetch = param => $fn.fetch.call(this,'kd-report-spec/index', param)
	// table
	cols = [
        { type: 'checkbox' },
		{ title: '编号',            field: 'spec_num' },
		{ title: '标本条码',        field: 'spec_code'},
		{ title: '姓名',            field: 'patient_name'},
		{ title: '版本号',          field: 'tmpl_vs'},
		{ title: '报告单模板',      field: 'report_form',   width: 200, render: ({ rows }) => {
            return `${rows.report_name}-${rows.report_form}`
        }},
		{ title: '所属医院',        field: 'hosp_name' },
		{ title: '所属派送人',      field: 'salesman'},
		{ title: '生成时间',        field: 'created_at',  align: 'tc'},
		{ title: '派送完成时间',    field: 'update_at',  align: 'tc'},
		{ title: '报告单状态',      field: 'status_name'},
		{ title: '操作',    width: 200, align: 'tc', render: ({rows}) => {
            return (
				<div className='plr5'>
					<Button label='编辑' className='' ghost onClick={e=>{
						const { submit } = this.state
						$http.submit(null, 'kd-report-spec/info', {param: {uuid: rows.uuid}}).then(data => {
                            this.getTemplateVer({report_tpl_id: data.tmpl_id})
                            setTimeout(() => {
                                this.editForm.setFieldsValue({...data})
                            },  200)
                            this.isEdit = true
                            this.rows = data
                            this.refs.modal.open()
						})
					}}  />
                    <Button label='查看' ghost className='mlr5' onClick={()=>{
                        $fn.push(this, $fn.getRoot(2).root + 'report-manage/info?id=' + rows.uuid) 
					}} />
					<Button label='预览' ghost onClick={()=>{
						
					}} />
				</div>
			)
        }},
	]
	ButtonGroup = () => {
        const { selectedKeys } = this.state
		return [
            { label:'打印', onClick:()=>{
				
            } },
			{ label:'补报告单', onClick:()=>{
				this.refs.modal3.open()
                const { submit3 } = this.state
                submit3[0].value = ''
                this.setState({ submit3 })
            } },
            { label:'推送到查询平台', disabled:selectedKeys.length === 0, onClick:()=>{
                const params = selectedKeys.map(i=>{
                    return {
                        spec_num: i.spec_num,
                        status: i.status,
                        spec_code: i.spec_code
                    }
                })
                const param = { params }
				coms.interfaceConfirm('kd-report-spec/supplementrep', '推送到查询平台', param, () => { this.fetch(this.model) })
            } },
            { label:'报告单删除', disabled:selectedKeys.length === 0, onClick:()=>{
                this.refs.modal1.open()
                const { submit1 } = this.state
                submit1[0].value = ''
                this.params = selectedKeys.map(i=>{
                    return {
                        spec_num: i.spec_num,
                        kind_id: i.kind_id
                    }
                })
                this.setState({ submit1 })
            } },
            { label:'报告单终止', disabled:selectedKeys.length === 0, onClick:()=>{
				this.refs.modal2.open()
                const { submit2 } = this.state
                submit2[0].value = this.termination = false
                submit2[1].value = ''
                submit2[2].value = this.abnormal_reason = ''
                this.setState({ submit2 })
            } },
		]
	}
	render(){
		const { data, pullLoading, pag, submit, submit1, submit2, submit3, selectedKeys } = this.state
		return (
			<Page title='报告单管理' ButtonGroup={this.ButtonGroup()}>
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
								$http.submit(null, 'kd-report-spec/edit', { param }).then(data => {
									message.then(f => f.default.success('编辑成功'))
									this.refs.modal.close()
									this.fetch(this.model)
								})
							}
						}}
                        onClose = { ()=>this.refs.modal.close() }
                        init    = { form => this.editForm = form }
					 />
				</Modal>
                <Modal ref='modal1' title='报告单删除' width={500} noFooter>
					<SubmitForm
						modal
						data = { submit1 }
						onSubmit = { v => {
                            const param = { params: this.params, ...v }
                            console.log(param)
							$http.submit(null, 'kd-report-spec/recallReport', { param }).then(data => {
                                message.then(f => f.default.success('操作成功'))
                                this.refs.modal1.close()
                                this.fetch(this.model)
                            })
						}}
                        onClose = { ()=>this.refs.modal1.close() }
					 />
				</Modal>
                <Modal ref='modal2' title='报告单终止' width={500} noFooter>
					<SubmitForm
                        modal
						data = { submit2 }
						onSubmit = { v => {
                            const data = {
                                abnormal_type: v.abnormal_type || '',
                                termination: v.termination ? '1' : '0',
                                reason: v.reason
                            }
                            const param = { ids: selectedKeys.map(i => i.uuid), ...data }
							$http.submit(null, 'kd-report-spec/abortReport', { param }).then(data => {
                                message.then(f => f.default.success('操作成功'))
                                this.refs.modal2.close()
                                this.fetch(this.model)
                            })
						}}
                        onClose = { ()=>this.refs.modal2.close() }
					 />
				</Modal>
                <Modal ref='modal3' title='补打报告单' width={500} noFooter>
					<SubmitForm
                        modal
						data = { submit3 }
						onSubmit = { v => {
                            const param = { ...v }
							$http.submit(null, 'kd-report-spec/createreport', { param }).then(data => {
                                message.then(f => f.default.success('操作成功'))
                                this.refs.modal3.close()
                                this.fetch(this.model)
                            })
						}}
                        onClose = { ()=>this.refs.modal3.close() }
					 />
				</Modal>
			</Page>
		)
	}
}