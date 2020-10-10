import React from 'react'
// ===================================================================== global template
const { $fn, $async } = window
const Title = $async(()=>import('#tp/title'))
const Button = $async(()=>import('@antd/button'))
// =====================================================================
export default ({ children, className, title, ButtonGroup, style, titleChildren, onSetHeader }) => {
	return (
		<div className={`bcf r5px ${className||''}`} style={style}>
			{
				title && (
					<Title title={title} onSetHeader={onSetHeader}>
						{/* 添加、删除按钮组 */}
						{
							$fn.hasArray(ButtonGroup) && ButtonGroup.map((v,i)=><Button className='ml10' key={i} label={v.label} disabled={v.disabled} loading={v.loading} ghost={v.ghost} onClick={v.onClick} />)
						}
						{ titleChildren }
					</Title>
				)
			}
			{children}
		</div>
	)
}