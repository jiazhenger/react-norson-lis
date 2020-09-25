import React from 'react'
// ===================================================================== 添加内部样式
export default ({ value }) => (
	<>
		{
			window.$fn.isValid(value) ? value : <span className='g9'>--</span>
		}
	</>
)
