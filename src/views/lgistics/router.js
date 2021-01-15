/* ====================================== 模块子路由配置  ====================================== */
import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
// ===================================================================== 异步加载
import Import from '@com/bundle'
// ===================================================================== 路由配置
import Workbench from '@views/workbench/main'
import Lgistics from '@views/lgistics/lgistics-page'
// ===================================================================== 同步路由
export default () => (
	<Switch>
		<Route 	path='/lgistics/workbench' 			component={ Workbench }  />
		<Route 	path='/lgistics/lgistics-page' 		component={ Lgistics }  />
		{/* 重定向 */}
		<Route path='/lgistics' children={<Redirect to='/lgistics/workbench/index' />}  />
		{/* 404 */}
		<Route component={ Import('404') } />
	</Switch>
)