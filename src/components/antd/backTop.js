/* ====================================== toast  ====================================== */
import React from 'react'
import { BackTop } from 'antd'
// ===================================================================== 
export default ({ className, title, children, size })=> (
	<BackTop target={()=>document.querySelector('#content')}>
		<div className='fxmc bcm cf ar r5px' style={{width:'40px',height:'40px'}}>Top</div>
	</BackTop>
)

 