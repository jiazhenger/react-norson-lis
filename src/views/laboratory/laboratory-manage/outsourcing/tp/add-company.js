import React from 'react'
// ===================================================================== global declare
const { $fn, $http, $async } = window
// ===================================================================== antd
const message = import('@antd/message')
// ===================================================================== private component
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== component
export default class extends React.Component{
	state = {
		submit: [
            { label: '单位名称',    name: 'company_name',                   required: true},
			{ label: '单位简称',    name: 'company_short_name',             required: true},
			{ label: '联系人',      name: 'company_employee' },
			{ label: '联系电话',    name: 'company_mobile'},
			{ label: '地址',		name: 'company_address'},
			{ label: '主检实验室',  name: 'company_laboratory'},
			{ label: '导出模板',    name: 'company_export_template_code',   type: 'select',     data: [],   nameStr: 'model_name',  idStr: 'uuid'},
        ],
    }
	model = {}
	
    componentDidMount(){
        const { submit } = this.state
        const { rows } = this.props
		cacheApi.then(f => {
            const d = f.default
            // 导出模板
			$fn.getCache({
				cache: d.exportTemplate, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        submit[6].data = data
                    } else {
                        $http.submit(null, 'lis-outsourcing-company/getExportModel4Select').then(data => {
                            submit[6].data = data
                            $fn.setCache()
                        })
                    }
				}
            })
            this.setState({submit})
        })
        if (rows && Object.keys(rows).length) {
            setTimeout(() => {
                this.form.setFieldsValue({...rows})
            }, 200)
        }
    }
	render(){
        const { submit } = this.state
        const { type, rows, onClose, fetch } = this.props
		return (
            <SubmitForm
                modal
                data = { submit }
                onSubmit = { v => {
                    if (type === 'add') {
                        const param = { ...v }
                        $http.submit(null,'lis-outsourcing-company/add',{ param }).then(data=>{
                            message.then(f=>f.default.success('添加成功'))
                            onClose && onClose()
                            fetch && fetch()
                        })
                    } else {
                        const param = { ...v, uuid: rows.uuid}
                        $http.submit(null, 'lis-outsourcing-company/edit', { param }).then(data => {
                            message.then(f => f.default.success('编辑成功'))
                            onClose && onClose()
                            fetch && fetch()
                        })
                    }
                }}
                onClose = { ()=>onClose && onClose() }
                init    = { form => this.form = form }
            />
		)
	}
}