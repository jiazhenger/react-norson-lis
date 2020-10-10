/* ====================================== toast  ====================================== */
import React from 'react'
import { Tabs as AntdTabs } from 'antd'
// ===================================================================== Select

export const Tabs = ({ children, defaultActiveKey, onChange }) => <AntdTabs onChange={onChange} defaultActiveKey={defaultActiveKey} size='small'>{children}</AntdTabs>
export const Pane = ({ children, tab, key }) => <AntdTabs.TabPane tab={tab} key={key}>{children}</AntdTabs.TabPane>