/* ====================================== toast  ====================================== */
import React from 'react'
import { Table, Pagination } from 'antd'

const { $fn } = window
// ===================================================================== 
export default ({ col, data, loading, pag, onChange, onSizeChange, noPag, className, size, expandedRowRender, expandRowByClick, onExpand })=> {
	const p = { current:1, total:0, pageSize:10, ...pag}
	return <>
		<Table 
			className 	= {`x-table ${className||''}`}
			rowKey		= { r => r.key }
			columns		= { col }
			dataSource	= { data }
			loading 	= { loading } 
			scroll		= {{ x:1500 }}
			pagination	= { false }
			size		= { size }
			expandedRowRender 	= { expandedRowRender }
			expandRowByClick	= { expandRowByClick }
			onExpand			= { onExpand }
		/>
		{
			!noPag && $fn.hasArray(data) && (
				<div className='fxj' style={{padding:'20px 15px'}}>
					<div>共 {p.total} 条数据</div>
					<Pagination 
						current				= { p.current } 
						total				= { p.total }
						pageSize			= { p.pageSize }
						onChange			= { page =>{ onChange && onChange( page ) } }
						showQuickJumper		= { true }
						onShowSizeChange 	= { (current, size) =>{ onSizeChange && onSizeChange( current, size ) } }
						showSizeChanger 	= { true }
					/>
				</div>
			)
		}
	</>
}
