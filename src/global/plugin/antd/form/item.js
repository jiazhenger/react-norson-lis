import React from 'react'
import { Form } from 'antd'
// ===================================================================== 按钮集合
export default ({ children, name, label, className, rules, mt, ml, mr, mb, full, width}) => (
	<Form.Item 
		name	= { name }
		label	= { label } 
		rules	= { rules }
		style	= {{ width:full?'100%':(width||'auto'), marginBottom:mb || 0, marginTop: mt, marginLeft:ml, marginRight:mr }}
		className = {className}
	>
		{ children }
	</Form.Item>
)