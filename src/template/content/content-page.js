/* ====================================== 滚动条  ====================================== */
import React from 'react'
const Content = window.$async(()=>import('@cpx/content'))
// =====================================================================
export default ({ children }) => {
	return (
		<Content xy>
			<section style={{minWidth:'1000px', minHeight:'600px' }}>
				{children}
			</section>
		</Content>
	)
}