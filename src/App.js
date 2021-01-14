import React from 'react'
import { HashRouter  } from 'react-router-dom'
// ===================================================================== router
import AppRouter from './router'
import Toast from '@tp/toast'
import DataLoading from '@tp/data-loading'
// ===================================================================== antd 汉化

// ===================================================================== 二级路由
 const  Index = () => (
	<>
		<HashRouter children={<AppRouter />}/>
		<Toast />
		<DataLoading />
	</>
)

export default Index