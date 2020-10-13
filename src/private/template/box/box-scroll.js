import React from 'react'
// ===================================================================== global template
const { $fn, $async } = window
const Box = $async(()=>import('#tp/box/box'))
// =====================================================================
export default ({ children, scrollClassName, className, title, ButtonGroup, style, titleChildren, onSetHeader }) => {
	return (
		<Box
			className	= {`fv ${className||''}`} 
			title		= {title}
			style		= {style}
			titleChildren = {titleChildren}
		>
			<div className='ex rel'>
				<div className={`abs_full xplr oys scrollbar ${scrollClassName||''}`}>
					{children}
				</div>
			</div>
		</Box>
	)
}