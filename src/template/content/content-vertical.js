import React from 'react'
// =====================================================================
const Content = window.$async(()=>import('@cpx/content'))
// =====================================================================
export default ({ header, footer, children }) => (
	<Content className='fv'}>
	
		{ header && header }
		
		<section className='rel ex'>
			<Content scrollY>
				{ children }
			</Content>
		</section>
		
		{ footer && footer }
	</Content>
)