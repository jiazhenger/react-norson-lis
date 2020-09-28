import React from 'react'
// ===================================================================== global template
const Content = window.$async(()=>import('@tp/content'))
// =====================================================================
export default ({ children }) => {
	return (
		<Content>
			<section className='wh' style={{padding:10,minWidth:600,minHeight:200}}>
				{children}
			</section>
		</Content>
	)
}