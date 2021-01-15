import React from 'react'
// =====================================================================
export default ({ title, children, onSetHeader, noPadding, style }) => (
	<header className={`h40 bbor1 fxm ${noPadding?'':'xplr'}`} style={style}>
		<h2 className='b fxm ex'>
			<i className='bcm r10px mr5 rel' style={{width:4,height:12}}></i>
			<span>{title}</span>
			{
				onSetHeader && <span className='f12 c0 n' onClick={onSetHeader}>(设置表头)</span>
			}
		</h2>
		<div>
			{children}
		</div>
	</header>
)