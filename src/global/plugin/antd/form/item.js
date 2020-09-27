import React from 'react'
import { Form } from 'antd'
// ===================================================================== 按钮集合
export default ({ children, name, label, className, rules, mt, ml, mr}) => (
	<Form.Item 
		name	= { name }
		label	= { label } 
		rules	= { rules }
		style	= {{ marginBottom:0, marginTop: mt, marginLeft:ml, marginRight:mr }}
		className = {className}
	>
		{ children }
	</Form.Item>
)