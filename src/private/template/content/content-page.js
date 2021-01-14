import React from 'react'
// ===================================================================== global template
const Content = window.$async(()=>import('@tp/content'))
// =====================================================================
const Index = ({ children, className, contentClassName, style }) => {
	return (
		<Content scrollXY className={className} style={style}>
			<section className={`h ${contentClassName||''}`} style={{minWidth:1000, minHeight:600 }}>
				{children}
			</section>
		</Content>
	)
}

export default Index