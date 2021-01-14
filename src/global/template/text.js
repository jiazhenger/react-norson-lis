import React from 'react'
// ===================================================================== 添加内部样式
export default ({ value, color }) => (
	<>
		{
			window.$fn.isValid(value) ? value : <span className='g9' style={{color}}>--</span>
		}
	</>
)
