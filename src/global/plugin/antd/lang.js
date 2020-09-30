/* ====================================== toast  ====================================== */
import React from 'react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
// ===================================================================== Select
export default ({children}) => <ConfigProvider locale={zhCN}>{children}</ConfigProvider>