import React from 'react'
import Async from '@com/async'
// =====================================================================
const Content  =  Async(()=>import('@cpx/content'))
const { $fn } = window
// =====================================================================
export default ({ className, header, footer, contentClassName, children }) => (
	<Content scrollY={false} className={`fv ${ $fn.css(className) }`}>
	
		{ header && header }
		
		<section className='rel ex'>
			<Content className={ $fn.css(contentClassName) }>
				{ children }
			</Content>
		</section>
		
		{ footer && footer }
	</Content>
)