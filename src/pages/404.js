import React from 'react'
// ===================================================================== antd
import { Result, Button } from 'antd'
// ===================================================================== public component
import Content from '@cpx/content'
// ===================================================================== page component
export default ({ history }) => {
	return (
		<Content>
			<Result
				status='404'
				title='404'
				subTitle='哦呵, 页面未找到'
				extra={<Button onClick={()=>history.goBack()} size='large' type='primary' style={{width:'120px'}}>返回</Button>}
			/>
		</Content>
	)
}
