// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'  
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd 
const message = import('@antd/message') 
// ===================================================================== private component
const SubmitForm = $async(()=>import('#cpt/submit-form'))
// ===================================================================== 缓存
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== component
export default class extends React.Component{
	statusOptions = [
        { label: "是", value: "1" },
        { label: "否", value: "2" },
        { label: "不需要", value: "3" }
    ]
    typeOptions = [
        { label: "样本信息和结果沟通", value: "1" },
        { label: "样本危急值通知", value: "2" },
        { label: "咨询通知", value: "3" },
        { label: "其他", value: "4" }
    ]
	state = {
		submit: [
			{ label:'标本条码',			name:'spec_code',		required:true, disabled: true }, 
			{ label:'送检单位', 		name:'inspec_unit_id',	type: 'select', data: [], nameStr:'name', idStr:'value', required:true },
			{ label:'自然项目',			name:'kind_name',		type: 'textarea', full:true, width:'100%', disabled: true }, 
			{ label:'送检科室', 		name:'depart_name', 	required:true },
			{ label:'岗位', 			name:'major_group',		type: 'select', data: [], nameStr:'name', idStr:'value' },
			{ label:'回顾', 			name:'look_back',		type: 'select', data: this.statusOptions, nameStr:'label', idStr:'value' },
			{ label:'沟通类型', 		name:'type',			type: 'select', data: this.typeOptions, nameStr:'label', idStr:'value', required:true },
			{ label:'反馈人',			name:'contact_user', 	required:true }, 
			{ label:'联系电话',			name:'phone', 			required:true }, 
            { label:'联系日期',			name:'contact_at',		type:'date-time', required:true },
			{ label:'反馈内容', 		name:'inspec_content',	type: 'textarea', full:true, width:'100%'},
			{ label:'反馈原因', 		name:'contact_reason',	type: 'textarea', full:true, width:'100%'},
		]
	}  
	model = {} 
	componentDidMount(){  
		this.props.onRef(this)   
		const { submit } = this.state
		cacheApi.then(f => { 
			$fn.getCache({
				cache: f.default.BsHospitalSelect, name: 'name', id: 'value', callback: (data) => {
					if ($fn.hasArray(data)) { 
						submit[1].data = data
						this.setState({submit: submit})
                    } else {
                        $http.submit(null, 'bs-hospital/select').then(data => {
                            submit[1].data = data
							this.setState({submit: submit}) 
                            $fn.setCache()
                        })
                    }
				}
			}) 
			$fn.getCache({
				cache: f.default.laboratoryselect, name: 'name', id: 'value', callback: (data) => {
					if ($fn.hasArray(data)) { 
						submit[4].data = data
						this.setState({submit: submit})
					} else {
                        $http.submit(null, 'project-team/laboratoryselect').then(data => {
                            submit[4].data = data
							this.setState({submit: submit})
							$fn.setCache()
                        })
                    }
				}
			}) 
		}) 
		this.changeInfo(this.props)
	}   
    componentWillReceiveProps(props) {  
		if (props.rows !== this.props.rows) {  
			this.changeInfo(props)
		} 
    }
	changeInfo = (props) => { 
		console.log('客户反馈赋值') 
		this.clears()
		const { submit } = this.state
		if (props.type){
			submit[0].value = props.rows.spec_code
			submit[1].value = props.rows.inspec_unit_id
			submit[2].value = props.rows.kind_name
			submit[3].value = props.rows.depart_name
			submit[4].value = props.rows.major_group
			submit[5].value = props.rows.look_back
			submit[6].value = props.rows.type
			submit[7].value = props.rows.contact_user
			submit[8].value = props.rows.phone
			submit[9].value = props.rows.contact_at
			submit[10].value = props.rows.inspec_content
			submit[11].value = props.rows.contact_reason
			this.setState({ submit: submit })
		} else if (props.rows.spec_code) {
			$http.pull(this,'sp-customer-log/getInfoBySpec', {dataName:null, param: {spec_code: props.rows.spec_code}}).then(res=>{ 
				const data = res.spec_info 
				submit[0].value = data.spec_code
				submit[4].value = data.major_group_id
				submit[1].value = data.inspec_unit_id // 送检单位id
				submit[3].value = data.depart_name
				// submit[].value = data.inspec_unit // 送检单位name
				submit[2].value = data.kind_name
				this.setState({ submit: submit })
			}) 
		} 
	}
	submits = () => {
		console.log('客户反馈提交')
		this.form.submit()
	}
	clears = () => {
		console.log('客户反馈清空') 
		// this.form.resetFields(['inspec_unit_id', 'depart_name', 'major_group', 'look_back', 'type', 'contact_user', 'phone', 'contact_at', 'inspec_content', 'contact_reason'])
		const { submit } = this.state 
		submit.forEach(i => {
			if (this.props.type) {
				i.value = ''
			} else if (i.name === 'spec_code' || i.name === 'kind_name') { 
			} else {i.value = ''}
		})
		this.setState({ submit: submit}) 
	}  
	render(){  
		const { submit } = this.state
		return ( 
			<div> 
				<SubmitForm 
					modal
					data 		= { submit }
					display 	= { true } 
					onChange    = { (v,press,{name})=> {
						submit.forEach(i => {
							if (i.name === name) {
								i.value = v 
							}
						})
					} }
					onSubmit    = { v => { 
						let param = {...v}
						let api ='sp-customer-log/add' 
						let info = '添加'  
						if (this.props.type) {
							param = { ...v, uuid: this.props.rows.uuid, inspec_unit: window.$fn.filterSelect(this.state.submit[1].data, v.inspec_unit_id, 'name', 'value')}
							api = 'sp-customer-log/edit' 
							info = '编辑'
						} 
						$http.submit(null, api, { param: param, submitLoading:'infoLoading' }).then(data=>{
							message.then(f=>f.default.success(`${info}成功`))
							this.clears() 
							this.props.close && this.props.close()
						}) 
					}}
					init    = { form => this.form = form }
				/>
			</div>
		)
	}
}