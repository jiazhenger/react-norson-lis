/* ====================================== toast  ====================================== */
import React from 'react'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
// ===================================================================== 选择字典表数据
export default ({ msg, okText, cancelText, onOk, onCancel  }) => {
	return Modal.confirm({
		title: '提示',
		icon: <ExclamationCircleOutlined />,
		content: msg || '确认删除？',
		okText: okText || '确认',
		cancelText: cancelText || '取消',
		onOk: onOk,
		centered: false,
		className: 'confirm',
		onCancel: close => {
			onCancel && onCancel()
			close()
		}
	});
}