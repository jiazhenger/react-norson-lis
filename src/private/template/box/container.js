import React from 'react'
// ===================================================================== global template
const { $async } = window
const Title = $async(()=>import('#tp/title'))
const Button = $async(()=>import('@antd/button'))
// =====================================================================
export default ({ children, title, titleChildren, ButtonGroup }) => {
	return (
		<div className={`bcf wh fv r5px`}>
			{
				title && (
					<Title title={title}>
						{/* 添加、删除按钮组 */}
						{
							ButtonGroup.map((v,i)=><Button className='ml10' key={i} label={v.label} disabled={v.disabled} loading={v.loading} ghost={v.ghost} onClick={v.onClick} />)
						}
					</Title>
				)
			}
			{children}
		</div>
	)
}