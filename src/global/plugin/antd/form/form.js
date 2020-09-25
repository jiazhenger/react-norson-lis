import React from 'react'
import { Form as AntdForm } from 'antd'
// ===================================================================== 按钮集合
export const Form = ({ children, onSubmit, name, init })=>{
	const [ form ] = AntdForm.useForm()
	
	React.useEffect(()=>{
		init && init(form)
	}, [ init, form ])
	
	// 提交登录
	const onFinish = React.useCallback(function(param){
		onSubmit && onSubmit(param)
	},[ onSubmit ])
	
	return <AntdForm name={name} form={form} onFinish={onFinish}>{ children }</AntdForm>
}

export const Item = ({ children, name, rules, mt }) => (
	<AntdForm.Item 
		name	= { name } 
		rules	= { rules }
		style	= {{ marginBottom:0, marginTop: mt }}
	>
		{ children }
	</AntdForm.Item>
)

export default Form