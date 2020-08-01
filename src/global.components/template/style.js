import React from 'react'
import AddLast from '@cpt/add-last'
// ===================================================================== 添加内部样式
export default ({ children, name }) => (
	<AddLast name={ name || 'ub-style'} el='head' tag='style'>
		{ children }
	</AddLast>
)
