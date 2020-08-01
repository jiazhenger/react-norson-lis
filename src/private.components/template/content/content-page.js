import React from 'react'
// ===================================================================== global template
const Content = window.$async(()=>import('@tp/content'))
// =====================================================================
export default ({ children }) => {
	return (
		<Content scrolXY>
			<section style={{minWidth:'1000px', minHeight:'600px' }}>
				{children}
			</section>
		</Content>
	)
}