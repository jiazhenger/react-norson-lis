/* ====================================== toast  ====================================== */
import React from 'react'
import Box from '@cpt/box'
import Button from '@cpt/antd/antd-button'
// ===================================================================== antd
import { Form } from 'antd'
// ===================================================================== compnent
export default ({ form, onFinish, loading, children }) => {
	return (
		<Box>
			<Form form={form} onFinish={onFinish} className='fxw search-form'>
				{children}
				<div className='sw'></div>
				<Form.Item noStyle><Button.Search loading={loading} size='large' /></Form.Item>
			</Form>
		</Box>
	)
}
