/* ====================================== toast  ====================================== */
import React from 'react'
import { Empty } from 'antd'
// ===================================================================== 
export default ({ data, text, image, loading, className, simple }) => {
	const _image = simple ? Empty.PRESENTED_IMAGE_SIMPLE : Empty.PRESENTED_IMAGE_DEFAULT
	return (
		data.length === 0 ? (
			<div className={`fxmc abs_full ${className||''}`}>
				<Empty image={_image} description={text} style={{margin:0, color:'#999', fontSize:'12px'}} />
			</div>
		) : null
	)
}