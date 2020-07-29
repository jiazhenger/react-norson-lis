/* ====================================== 滚动条  ====================================== */
import React from 'react'
const Content = window.$async(()=>import('@cpx/content'))
// =====================================================================
export default ({ children }) => {
	return (
		<Content xy>
			<section style={{padding:'15px',minWidth:'1000px',minHeight:'800px'}}>
				{children}
			</section>
		</Content>
	)
}