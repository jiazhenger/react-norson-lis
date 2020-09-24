import React from 'react'
import { Form } from 'antd'
// ===================================================================== 按钮集合
export default ({ children, name, rules, mt }) => (
	<Form.Item 
		name	= { name } 
		rules	= { rules }
		style	= {{ marginBottom:0, marginTop: mt }}
	>
		{ children }
	</Form.Item>
)