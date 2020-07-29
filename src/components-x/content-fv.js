import React from 'react'
import Async from '@com/async'
// =====================================================================
const Content  =  Async(()=>import('@cpt/content'))
// =====================================================================
export default ({ className, header, footer, contentClassName, children }) => (
	<Content scrollY={false} className={`fv ${ window.$fn.css(className) }`}>
	
		{ header && header }
		
		<section className='rel ex'>
			<Content className={ window.$fn.css(contentClassName) }>
				{ children }
			</Content>
		</section>
		
		{ footer && footer }
	</Content>
)