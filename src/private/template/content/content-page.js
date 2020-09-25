import React from 'react'
// ===================================================================== global template
const Content = window.$async(()=>import('@tp/content'))
// =====================================================================
export default ({ children, className, contentClassName, style }) => {
	return (
		<Content scrollXY className={className} style={style}>
			<section className={contentClassName||''} style={{minWidth:'1000px', minHeight:'600px' }}>
				{children}
			</section>
		</Content>
	)
}