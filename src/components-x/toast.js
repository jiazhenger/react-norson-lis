import React from 'react'
import AddLast from './add-last'
// ===================================================================== toast
export default () => (
	<AddLast name='toast'>
		<div id='jzer-toast' className='fix_lt wh tc dn' style={{zIndex:2000}}>
			<div className='fxmc wh xplr'>
				<p className='jzer-toast-msg r5px cf p10 f13' style={{background:'rgba(0,0,0,0.6)'}}></p>
			</div>
		</div>
	</AddLast>
)
