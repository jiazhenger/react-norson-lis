/* ====================================== 模块子路由配置  ====================================== */
import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
// ===================================================================== 异步加载
import Import from '@com/bundle'
// ===================================================================== 路由配置
import Workbench from '@views/workbench/main'
import LaboratoryManage from '@views/laboratory/laboratory-manage'
import TestingCenter from '@views/laboratory/testing-center'
import SpecimenManage from '@views/administrators/specimen-manage'
import BusinessList from '@views/business/businessList'
import Finance from '@views/finance/finance-page'
import SystemSettings from '@views/administrators/system-settings'
import Lgistics from '@views/lgistics/lgistics-page' 
import Service from '@views/service/service-page' 
import SystemManage from '@views/systemManagement/system-manage' 
// ===================================================================== 同步路由
export default () => (
	<Switch>
		<Route 	path='/administrators/workbench' 			component={ Workbench }  />
		<Route 	path='/administrators/laboratory-manage' 	component={ LaboratoryManage }  />
		<Route 	path='/administrators/testing-center' 		component={ TestingCenter }  />
		{/* 薛玉梅 | 2020-10-13 | 添加：标本管理 */}
		<Route 	path='/administrators/specimen-manage' 		component={ SpecimenManage }  /> 
		<Route 	path='/administrators/finance-page' 		component={ Finance }  />
		<Route 	path='/administrators/businessList' 		component={ BusinessList }  />
		<Route 	path='/administrators/system-settings' 		component={ SystemSettings }  />
		<Route 	path='/administrators/lgistics-page' 		component={ Lgistics }  />
		<Route 	path='/administrators/service-page' 		component={ Service }  />
		<Route 	path='/administrators/system-manage' 		component={ SystemManage }  />
		{/* 重定向 */}
		<Route path='/administrators' children={<Redirect to='/administrators/workbench/index' />} exact  />
		{/* 404 */}
		<Route component={ Import('404') } />
	</Switch>
)