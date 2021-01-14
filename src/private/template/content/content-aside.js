import React from 'react'
// ===================================================================== global template
const Content = window.$async(()=>import('@tp/content'))
// =====================================================================
const Index = ({ children, className }) => {
	return (
		<Content>
			<section className={`wh ${className||''}`} style={{padding:10,minWidth:1100,minHeight:200}}>
				{children}
			</section>
		</Content>
	)
}

export default Index