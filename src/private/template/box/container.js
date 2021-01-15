import React from 'react'
// ===================================================================== global template
const { $fn, $async } = window
const Title = $async(()=>import('#tp/title'))
const Button = $async(()=>import('@antd/button'))
// =====================================================================
export default ({ children, title, titleChildren, ButtonGroup, nobc, noBtGroup, className }) => {
	return (
		<div className={`wh fv r5px ${ nobc?'':'bcf'} ${className || ''}`}>
			{
				title && (
					<Title title={title}>
						{/* 添加、删除按钮组 */}
						{/* {
							$fn.hasArray(ButtonGroup) && ButtonGroup.map((v,i)=><Button className='ml10' key={i} label={v.label} disabled={v.disabled} loading={v.loading} ghost={v.ghost} onClick={v.onClick} />)
						} */}
						{noBtGroup ? ButtonGroup :  
							$fn.hasArray(ButtonGroup) && ButtonGroup.map((v,i)=><Button className='ml10' key={i} label={v.label} disabled={v.disabled} loading={v.loading} ghost={v.ghost} onClick={v.onClick} />)
						}
					</Title>
				)
			}
			{children}
		</div>
	)
}