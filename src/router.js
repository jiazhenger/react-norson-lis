/* ====================================== 模块子路由配置  ====================================== */
import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { CacheSwitch, CacheRoute } from 'react-cache-router'
// ===================================================================== 异步加载
import Import from '@com/bundle'
// ===================================================================== 同步路由
const Index = () => (
	<CacheSwitch>
		<CacheRoute path='/' component={ Import('index') } exact />
		<CacheRoute path='/login' component={ Import('login') } exact />
		{/* 重定向 */}
		<Route path='/index' children={<Redirect to='/' />} exact />
		{/* 404 */}
		<Route component={ Import('404') } />
	</CacheSwitch>
)
export default Index