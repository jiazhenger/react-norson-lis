/* ====================================== toast  ====================================== */
import React from 'react'
import { Spin } from 'antd'
// ===================================================================== function
// ===================================================================== 
export default ({ loading, size })=>  loading ? (
	<div className='abs_full fxmc' style={{background:'rgba(255,255,255,.5)'}}>
		<Spin size={size || 'large'} />
	</div>
) : null
