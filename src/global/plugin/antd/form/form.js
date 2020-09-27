import React from 'react'
import { Form as AntdForm } from 'antd'
// ===================================================================== 按钮集合
export const Form = ({ children, onSubmit, name, init, layout, className, style })=>{
	const [ form ] = AntdForm.useForm()
	
	React.useEffect(()=>{
		init && init(form)
	}, [ init, form ])
	
	// 提交登录
	const onFinish = React.useCallback(function(param){
		onSubmit && onSubmit(param)
	},[ onSubmit ])
	
	return <AntdForm name={name} form={form} className={className} style={style} layout={layout||'vertical'} onFinish={onFinish}>{ children }</AntdForm>
}

export const Item = ({ children, name, label, rules, mt, ml}) => (
	<AntdForm.Item 
		name	= { name }
		label	= { label } 
		rules	= { rules }
		style	= {{ marginBottom:0, marginTop: mt, marginLeft:ml }}
	>
		{ children }
	</AntdForm.Item>
)

export default Form