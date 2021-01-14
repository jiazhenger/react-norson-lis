/* ====================================== toast  ====================================== */
import React from 'react'
import { Pagination } from 'antd'
const { $fn } = window
// ===================================================================== Select
export default ({ pag, onChange, style, otherInfo })=>(
	<div className='fxj tbor1' style={{padding:'10px 0', ...style}}>
		<div className='g6 fxc'>
			<div>共 {pag.total} 条数据</div>
			{
				otherInfo && <div className='ml20'>{otherInfo}</div>
			}
		</div>
		
		<Pagination
			size				= 'small'
			current				= { pag.current } 
			total				= { pag.total }
			pageSize			= { pag.pageSize }
			onChange			= { (current, pageSize) =>{ onChange && onChange(current, pageSize) } }
			showQuickJumper		= { true }
			showSizeChanger 	= { true }
			hideOnSinglePage	= { pag.total <= pag.pageSize ? true : false }
			pageSizeOptions		= {[ 10, 20, 50, 100, 150, 200, 500, 1000]}
		/>
	</div>
)