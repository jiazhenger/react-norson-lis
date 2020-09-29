/* ====================================== toast  ====================================== */
import React from 'react'
import { Pagination } from 'antd'
// ===================================================================== Select
export default ({ pag, onChange, style })=>(
	<div className='fxj tbor1' style={{padding:'10px 0', ...style}}>
		<div className='g6'>共 {pag.total} 条数据</div>
		<Pagination
			size				= 'small'
			current				= { pag.current } 
			total				= { pag.total }
			pageSize			= { pag.pageSize }
			onChange			= { (current, pageSize) =>{ onChange && onChange(current, pageSize) } }
			showQuickJumper		= { true }
			showSizeChanger 	= { true }
			hideOnSinglePage	= { true }
			pageSizeOptions		= {[ 10, 20, 50, 100, 150, 200, 500]}
		/>
	</div>
)