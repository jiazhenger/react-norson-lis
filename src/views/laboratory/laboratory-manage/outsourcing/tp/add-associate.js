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
            { label: '科室',        name: 'project_pid',    type: 'select', data: [],   full: true, width: '100%',  required: true, idStr: 'uuid'},
			{ label: '物流人员',    name: 'empl_id',        type: 'select', data: [],   full: true, width: '100%',  required: true},
        ],
    }
	model = {}
	
    componentDidMount(){
        const { submit } = this.state
        const { rows } = this.props
        // 科室
        $http.submit(null, 'project-team/select', { param: {type: '2'}}).then(data => {
            submit[0].data = data
            this.setState({submit})
        })
		cacheApi.then(f => {
            const d = f.default
            // 物流人员
			$fn.getCache({
				cache: d.employeeSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        submit[1].data = data
                    } else {
                        $http.submit(null, 'employee/select').then(data => {
                            submit[1].data = data
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
                        $http.submit(null,'specimen/addOutsourcingEmployee',{ param }).then(data=>{
                            message.then(f=>f.default.success('添加成功'))
                            onClose && onClose()
                            fetch && fetch()
                        })
                    } else {
                        const param = { ...v, uuid: rows.uuid}
                        $http.submit(null, 'specimen/editOutsourcingEmployee', { param }).then(data => {
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