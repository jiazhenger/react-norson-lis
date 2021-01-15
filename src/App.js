import React from 'react'
import { HashRouter  } from 'react-router-dom'
// ===================================================================== router
// import AppRouter from './router'
// ===================================================================== antd 汉化
const { $async } = window
const AppRouter = $async(()=>import('./router'))
const Lang = $async(()=>import('@antd/lang'))
const Toast = $async(()=>import('@tp/toast'))
const DataLoading = $async(()=>import('@tp/data-loading'))
// ===================================================================== 二级路由
export default ( ) => (
	<>
		<Lang>
			<HashRouter children={<AppRouter />}/>
		</Lang>
		<Toast />
		<DataLoading />
	</>
)