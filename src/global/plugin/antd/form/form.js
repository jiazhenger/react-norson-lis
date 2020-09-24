import React from 'react'
import { Form } from 'antd'
// ===================================================================== 按钮集合
export default class extends React.Component{
	FormComponent = ()=>{
		const [ form ] = Form.useForm()
		const { children, onSubmit, name, init } = this.props
		
		React.useEffect(()=>{
			init && init(form)
		}, [ init, form ])
		// 提交登录
		const onFinish = param　=> {
			onSubmit && onSubmit(param)
		}
		
		return (
			<Form name={name} form={form} onFinish={onFinish}>{ children }</Form>
		)
	}
	render(){
		return <this.FormComponent />
	}
}
