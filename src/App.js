import React from 'react'
import { HashRouter  } from 'react-router-dom'
// ===================================================================== router
import AppRouter from './router'
import Toast from '@tp/toast'
import DataLoading from '@tp/data-loading'
// ===================================================================== antd 汉化
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
// ===================================================================== 二级路由
export default ( ) => (
	<>
		<ConfigProvider locale={zhCN}>
			<HashRouter children={<AppRouter />}/>
		</ConfigProvider>
		<Toast />
		<DataLoading />
	</>
)