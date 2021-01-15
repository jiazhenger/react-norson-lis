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
// ===================================================================== private component
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== 页面常量
const statusOption = [
    { name: "显示", value: "1" },
    { name: "不显示", value: "2" }
]
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
        selectedKeys:[],
        uuid: '',
		submit: [
			{ label: '字段名称',    name: 'label_field',         required: true},
			{ label: '导出名称',        name: 'label_name', required: true},
			{ label: '排序',        name: 'sort'},
			{ label: '导出是否显示',	name: 'display',     type: 'select',     data: [] },
			{ label: '处理方式',	name: 'label_format_type',     type: 'select',     data: [], nameStr: 'label', onChange: (v) => {
                this.handleTypeChange(v)
            } },
			{ label: '',	name: 'label_format_value1',    disabled: true },
			{ label: '',	name: 'label_format_value2',     type: 'select',     data: [], visible: false },
        ],
    }
    model_code= $fn.query('id') || ''
    model = {model_code: this.model_code, limit: 100}
    handleTypeChange(v) {
        const { submit } = this.state
        if (v !== '3') {
            submit.forEach(item=>{
                if (item.name === 'label_format_value2') {
                    item.value = ''
                    item.visible = false
                }
                if (item.name === 'label_format_value1') {
                    item.value = ''
                    item.visible = true
                    if (v === '0') {
                            item.disabled = true
                    } else {
                            item.disabled = false
                    }
                }
            })
        }
        if (v === '3') {
            submit.forEach(item=>{
                if (item.name === 'label_format_value1') {
                    item.value = ''
                    item.visible = false
                }
                if (item.name === 'label_format_value2') {
                    item.value = ''
                    item.visible = true
                    item.disabled = false
                }
            })
        }
        this.setState({submit})
      }
	componentDidMount(){
        const { submit } = this.state
        submit[3].data = statusOption
        cacheApi.then(f => {
            const d = f.default
            // 模板处理方式
			$fn.getCache({
				cache: d.labelFormatType, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        submit[4].data = data
                        this.setState({submit})
                    } else {
                        $http.submit(null, 'settings/getLabelFormatType').then(data => {
                            submit[4].data = data
                            this.setState({submit})
                            $fn.setCache()
                        })
                    }
				}
            })
        })
        // 格式
        $fn.getDisItem({
            code: 66000,
            callback: data=>{
                submit[6].data = data
                this.formatList = data
            }
        })
        this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'settings/getExportModelConfig', param)
	// table
	cols = [
		{ type:'checkbox' },
		{ title: '字段名称',    field: 'label_field' },
		{ title: '导出名称',    field: 'label_name'},
		{ title: '处理方式',    field: 'label_format',      render: ({rows})=>{
            let str = rows.label_format_value
            if (rows.label_format_type === '3') {
                let d = $fn.hasArray(this.formatList) && this.formatList.filter(i=>i.value === rows.label_format_value)
                str = $fn.hasArray(d) && d[0].name
            }
            return rows.label_format_type === '0' ? rows.label_format_type_name : `${rows.label_format_type_name}：${str}`
        }},
		{ title: '排序',        field: 'sort'},
		{ title: '导出是否显示',        field: 'display',   render:({rows}) => {
            let d = statusOption.filter(i => i.value === rows.display)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
		{ title: '操作',        align:'tc',     render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='编辑' ghost onClick={e=>{
						const { submit } = this.state
                        submit.forEach(item=>{
                            if(item.name === 'copy_model_code'){
                                item.disabled = true
                            }
                            if (item.name === 'copy_model_code') {
                                item.visible = false
                            }
                            if (item.name === 'label_format_value1' || item.name === 'label_format_value2') {
                                item.value = rows.label_format_value || ''
                                if (rows.label_format_type !== '0') {
                                    item.disabled = false
                                } else {
                                    item.disabled = true
                                }
                            }
                        })
						this.refs.modal.open()
                        this.rows = rows
                        this.isEdit = true
                        $fn.setSubmitValues(submit, rows, ()=>{this.setState({submit})})
					}}  />
				</div>
			)
		}},
	]
	ButtonGroup = () => {
		return [
			{ label:'添加 F2', code:'F2', onClick:()=>{
				this.refs.modal.open()
				const { submit, data } = this.state
				submit.forEach(item => {
                    item.value = ''
                    if (item.name === 'label_format_value1') {
                        item.visible = true
                        item.disabled = true
                    }
                    if (item.name === 'label_format_value2') {
                        item.visible = false
                    }
                    if (item.name === 'label_format_type') {
                        item.value = '0'
                    }
                    if (item.name === 'sort') {
                        item.value = `${data.length + 1}`
                    }
                    if (item.name === 'display') {
                        item.value = '1'
                    }
                })
				this.isEdit = false
				this.setState({ submit })
            } },
			{ label:'删除', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				confirm.then(f=>{
					f.default({
						msg:'是否确认删除?',
						onOk: close => {
							const keys = this.state.selectedKeys.map(v=>v.uuid)
							$http.submit(null,'settings/delExportModelConfig',{ param:{uuids: keys} }).then(data=>{
								message.then(f=>f.default.success('删除成功'))
								this.fetch(this.model)
								this.setState({selectedKeys: []})
								close()
							})
						}
					})
				})
            } },
            { label:'返回', ghost:true, onClick:()=>{
				$fn.back(this)
			} },
		]
	}
	render(){
		const { data, pullLoading, submit } = this.state
		return (
			<Page title='配置导出模板' ButtonGroup={this.ButtonGroup()}>
				{/* 表格 */}
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { v => this.setState({ selectedKeys: v }) }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
				/>
				<Modal ref='modal' title={this.isEdit ? '编辑' : '添加'} width={648} noFooter>
					<SubmitForm
						modal
                        data = { submit }
                        onChange = { (v, press, {name})=>{
                            submit.forEach(item=>{
                                if (item.name === name) {
                                    item.value = v
                                }
                            })
                        } }
						onSubmit = { v => {
                            const data = {
                                model_code: this.model_code,
                                label_format_value: v.label_format_type !== '3' ? v.label_format_value1 : v.label_format_value2
                            }
							if (this.isEdit) {
								const param = { ...v, uuid: this.rows.uuid, ...data}
								$http.submit(null,'settings/editExportModelConfig',{ param }).then(data=>{
									message.then(f=>f.default.success('编辑成功'))
									this.refs.modal.close()
									this.fetch(this.model)
								})
							} else {
								const param = { ...v, ...data }
								$http.submit(null, 'settings/addExportModelConfig', { param }).then(data => {
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