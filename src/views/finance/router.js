/* ====================================== 模块子路由配置  ====================================== */
import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
// ===================================================================== 异步加载
import Import from '@com/bundle'
// ===================================================================== 路由配置
import Workbench from '@views/workbench/main'
import finance from '@views/finance/finance-page'
// ===================================================================== 同步路由
export default () => (
	<Switch>
		<Route 	path='/finance/workbench' 			component={ Workbench }  />
		<Route 	path='/finance/finance-page' 		component={ finance }  />
		{/* 重定向 */}
		<Route path='/finance' children={<Redirect to='/finance/workbench/index' />}  />
		{/* 404 */}
		<Route component={ Import('404') } />
	</Switch>
)