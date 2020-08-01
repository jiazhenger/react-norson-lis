import React from 'react'
import { HashRouter  } from 'react-router-dom'
// ===================================================================== router
import AppRouter from './router'
import Toast from '@tp/toast'
import DataLoading from '@tp/data-loading'
// ===================================================================== antd 汉化

// ===================================================================== 二级路由
export default ( ) => (
	<>
		<HashRouter children={<AppRouter />}/>
		<Toast />
		<DataLoading />
	</>
)