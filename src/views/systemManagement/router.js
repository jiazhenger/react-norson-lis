/* ====================================== 模块子路由配置  ====================================== */
import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
// ===================================================================== 异步加载
import Import from '@com/bundle'
// ===================================================================== 路由配置
import Workbench from '@views/workbench/main'
import systemManage from '@views/systemManagement/system-manage'
// ===================================================================== 同步路由
export default () => (
	<Switch>
		<Route 	path='/systemManagement/workbench' 			component={ Workbench }  />
		<Route 	path='/systemManagement/system-manage' 		component={ systemManage }  />
		{/* 重定向 */}
		<Route path='/systemManagement' children={<Redirect to='/systemManagement/workbench/index' />}  />
		{/* 404 */}
		<Route component={ Import('404') } />
	</Switch>
)