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
	typeOptions = [
        { label: "修改病人资料", value: "1" },
        { label: "修改医院信息", value: "2" },
        { label: "其他类型", value: "3" }
      ]
	state = {
		data:[], 
		submit: [
			{ label:'标本条码',			name:'spec_code',		required:true, disabled: true }, 
			{ label:'类型', 			name:'type',			type: 'select', data: this.typeOptions, nameStr:'label', idStr:'value' },
			{ label:'姓名',				name:'patient_name', 	required:true }, 
			{ label:'医院', 			name:'hosp_id',			type: 'select', data: [], nameStr:'name', idStr:'value', required:true },
			{ label:'内容', 			name:'content',			type: 'textarea', full:true, width:'100%'},
			{ label:'备注', 			name:'remark',			type: 'textarea', full:true, width:'100%'},
			{ label:'图片', 			name:'img',				type: 'upload', params: {modular: 130}}
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
						submit[3].data = data
						this.setState({submit: submit})
                    } else {
                        $http.submit(null, 'bs-hospital/select').then(data => {
                            submit[3].data = data
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
		console.log('信息修改赋值') 
		this.clears()
		const { submit } = this.state 
		if (props.type){
			submit[0].value = props.rows.spec_code || ''
			submit[1].value = props.rows.type || ''
			submit[2].value = props.rows.patient_name || ''
			submit[3].value = props.rows.hosp_id || ''
			submit[4].value = props.rows.content || ''
			submit[5].value = props.rows.remark || '' 
			submit[6].value = props.rows.img || '' 
		} else {
			submit[0].value = props.rows.spec_code
			submit[2].value = props.rows.patient_name
			submit[3].value = props.rows.hosp_id 
		}
		this.setState({ submit: submit })
	}
	submits = () => {
		console.log('信息修改提交')
		this.form.submit()
	}
	clears = () => {
		console.log('信息修改清空')
		// this.form.resetFields(['type', 'patient_name', 'hosp_id', 'content', 'remark', 'img'])
		const { submit } = this.state 
		submit.forEach(i => {
			if (this.props.type) {
				i.value = ''
			} else if (i.name !== 'spec_code') {
				i.value = ''
			}
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
						let api ='sp-info-modify/add' 
						let info = '添加'  
						console.log(this.props.type)
						if (this.props.type) {
							param = { ...v, uuid: this.props.rows.uuid}
							api = 'sp-info-modify/edit' 
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