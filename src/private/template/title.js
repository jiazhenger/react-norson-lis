import React from 'react'
// =====================================================================
export default ({ title, children }) => (
	<header className='h40 bbor1 xplr fx'>
		<h2 className='b fxm ex'>
			<i className='bcm r10px mr5 rel' style={{width:4,height:12}}></i>
			<span>{title}</span>
		</h2>
		<div>
			{children}
		</div>
	</header>
)