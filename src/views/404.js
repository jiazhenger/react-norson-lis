import React from 'react'
// ===================================================================== antd
import { Result, Button } from 'antd'
// ===================================================================== private template
const Page = window.$async(()=>import('#tp/content/content-page'))
// ===================================================================== page component
export default ({ history }) => {
	return (
		<Page contentClassName='fxmc'>
			<Result
				status='404'
				title='404'
				subTitle='哦呵, 页面未找到'
				extra={<Button onClick={()=>history.goBack()} size='large' type='primary' style={{width:'120px'}}>返回</Button>}
			/>
		</Page>
	)
}