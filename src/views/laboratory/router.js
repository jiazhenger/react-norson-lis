/* ====================================== 模块子路由配置  ====================================== */
import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
// ===================================================================== 异步加载
import Import from '@com/bundle'
// ===================================================================== 路由配置
import Workbench from '@views/workbench/main'
import LaboratoryManage from '@views/laboratory/laboratory-manage'
import TestingCenter from '@views/laboratory/testing-center'
// ===================================================================== 同步路由
export default () => (
	<Switch>
		<Route 	path='/laboratory/workbench' 			component={ Workbench }  />
		<Route 	path='/laboratory/laboratory-manage' 	component={ LaboratoryManage }  />
		<Route 	path='/laboratory/testing-center' 		component={ TestingCenter }  />
		{/* 重定向 */}
		<Route path='/laboratory' children={<Redirect to='/laboratory/workbench/index' />}  />
		{/* 404 */}
		<Route component={ Import('404') } />
	</Switch>
)