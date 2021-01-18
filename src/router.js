/* ====================================== 模块子路由配置  ====================================== */
import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
// ===================================================================== 异步加载
import Import from '@com/bundle'
// ===================================================================== 路由配置
const router = [
	{ path:'/', 				component: 'index', exact:true },
	{ path:'/login', 			component: 'login', exact:true },
	{ path:'/laboratory', 		component: 'laboratory/main' },
	{ path:'/lgistics', 		component: 'lgistics/main' },
	{ path:'/administrators', 	component: 'administrators/main' },
	{ path:'/business', 		component: 'business/main' },
	{ path:'/service', 			component: 'service/main' },
	{ path:'/finance', 			component: 'finance/main' },
]
// ===================================================================== 同步路由
export default () => (
	<Switch>
		{
			router.map((v,i)=> <Route key={i} path={v.path} component={ Import(v.component)  } exact={v.exact} />)
		}
		{/* 重定向 */}
		<Route path='/index' children={<Redirect to='/' />}  />
		{/* 404 */}
		<Route component={ Import('404') } />
	</Switch>
)