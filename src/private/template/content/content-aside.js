import React from 'react'
// ===================================================================== global template
const Content = window.$async(()=>import('@tp/content'))
// =====================================================================
export default ({ children }) => {
	return (
		<Content>
			<section style={{padding:'15px',minWidth:'1000px',minHeight:'500px'}}>
				{children}
			</section>
		</Content>
	)
}