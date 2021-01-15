/* ====================================== 模块子路由配置  ====================================== */
import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
// ===================================================================== 异步加载
import Import from '@com/bundle'
// ===================================================================== 路由配置
import Workbench from '@views/workbench/main'
import BusinessList from '@views/business/businessList'
// ===================================================================== 同步路由
export default () => (
	<Switch>
		<Route 	path='/business/workbench' 			component={ Workbench }  />
		<Route 	path='/business/businessList' 		component={ BusinessList }  /> 
		{/* 重定向 */}
		<Route path='/business' children={<Redirect to='/business/workbench/index' />}  />
		{/* 404 */}
		<Route component={ Import('404') } />
	</Switch>
)