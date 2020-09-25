/* ====================================== 模块子路由配置  ====================================== */
import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
// ===================================================================== 异步加载
import Import from '@com/bundle'
// ===================================================================== 同步路由
export default ({ data, root }) => (
	<Switch>
		{
			data.map((v,i)=> {
				if(v.path){
					var file = v.component ? v.component : v.path.replace('/','')
					return <Route key={i} path={v.path} component={ Import( file ) } />
				}else{
					return <Route component={ Import('404') } />
				}
			})
		},
		{/* 重定向 */}
		<Route path={data[0].root} children={<Redirect to={data[0].path} />}  />
		{/* 404 */}
		<Route component={ Import('404') } />
	</Switch>
)