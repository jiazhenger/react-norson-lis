import React from 'react'
import { Link } from 'react-router-dom'
// ===================================================================== private component
const Page = window.$async(()=>import('#tp/content/content-page'))
// ===================================================================== antd

// ===================================================================== image

// ===================================================================== declare

// ===================================================================== component
const Index = () => {
	return (
		<Page>
			<Link to='/login'>首页</Link>
		</Page>
	)
}

export default Index