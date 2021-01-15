/* ====================================== 模块子路由配置  ====================================== */
import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
// ===================================================================== 异步加载
import Import from '@com/bundle'
// ===================================================================== 路由配置
import Workbench from '@views/workbench/main'
import Service from '@views/service/service-page'
// ===================================================================== 同步路由
export default () => (
	<Switch>
		<Route 	path='/service/workbench' 			component={ Workbench }  />
		<Route 	path='/service/service-page' 		component={ Service }  /> 
		{/* 重定向 */}
		<Route path='/service' children={<Redirect to='/service/workbench/index' />}  />
		{/* 404 */}
		<Route component={ Import('404') } />
	</Switch>
)