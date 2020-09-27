import React from 'react'
// ===================================================================== global template
const Content = window.$async(()=>import('@tp/content'))
// =====================================================================
export default ({ children }) => {
	return (
		<Content>
			<section className='wh' style={{padding:10,minWidth:1000,minHeight:500}}>
				{children}
			</section>
		</Content>
	)
}