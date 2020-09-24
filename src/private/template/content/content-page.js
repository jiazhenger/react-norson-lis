import React from 'react'
// ===================================================================== global template
const Content = window.$async(()=>import('@tp/content'))
// =====================================================================
export default ({ children, className, style }) => {
	return (
		<Content scrolXY style={style}>
			<section className={className||''} style={{minWidth:'1000px', minHeight:'600px' }}>
				{children}
			</section>
		</Content>
	)
}