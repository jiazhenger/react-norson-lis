import React from 'react'
// =====================================================================
const Content = window.$async(()=>import('@base/content'))
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