/* ====================================== toast  ====================================== */
import React from 'react'
import { Button } from 'antd'
// ===================================================================== 按钮集合
export default ({ type, size, icon, children, label, width, minWidth, boxClassName, className, onClick, loading, htmlType, disabled, style, ghost, round, full })=>{
	let height = {}
	let radius = round ? {borderRadius:'100px'} : {borderRadius: '3px'}
	if(size === 'x'){
		height = { height:'44px', fontSize:'16px'}
	}else if( size === 'small'){
		height = { height:'30px', fontSize:'13px'}
	}
	
	const MyButton = ( ) => (
		<Button
			className	= {`${className||''} ${full?'ex':''}`} 
			style		= {{ width, minWidth, ...height, ...radius,  ...style }} 
			size		= { size || 'small' } 
			type		= { type || 'primary' } 
			loading		= { loading } 
			disabled	= { disabled } 
			onClick		= { e=>{
				e.stopPropagation()
				onClick && onClick()
			} }
			htmlType 	= { htmlType }
			ghost 		= { ghost }
			icon 		= { icon }
		>
			{label||children}
		</Button>
	)
	
	return (
		full ? <div className={`fxmc ${boxClassName||''}`}><MyButton/></div> : <MyButton />
	)
}