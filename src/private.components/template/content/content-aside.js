import React from 'react'
// ===================================================================== global template
const Content = window.$async(()=>import('@tp/content'))
// =====================================================================
export default ({ children }) => {
	return (
		<Content scrollXY>
			<section style={{padding:'15px',minWidth:'1000px',minHeight:'800px'}}>
				{children}
			</section>
		</Content>
	)
}