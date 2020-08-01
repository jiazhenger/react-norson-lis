/* ====================================== toast  ====================================== */
import React from 'react'
import { Card, Empty } from 'antd'
// ===================================================================== 
export default ({ className, title, children, size, hover })=> {
	return <div className={className}>
		<Card title={title} bordered={false} size={size} style={{borderRadius:'6px',color:'#333'}} hoverable={ hover === false ? false : true}>
			{
				children ?　children　:　<div className='g9 fxmc pb20'><Empty /></div>
			}
		</Card>
	</div>
}
