import React from 'react'
// =====================================================================
export default ({ id, className, style, children, onClick, scrollX, scrollY, scrollXY }) => {
	let scroll = ''
	if(scrollX){ scroll = 'oxs' }
	if(scrollY){ scroll = 'oys' }
	if(scrollXY){ scroll = 'oxys' }
	scroll = scroll === '' ? scroll : scroll + ' scrollbar'
	return (
		<div
			id 			={ id }
			className	={ `abs_full ${scroll} ${ window.$fn.css(className) }` }
			style		={ style } 
			onClick		={ onClick }
		>
			{children}
		</div>
	)
}