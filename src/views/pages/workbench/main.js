import React from 'react'
// ===================================================================== private template
const Menu = window.$async(()=>import('#frame/menu'))
// ===================================================================== 目录
const root = window.$fn.getRoot()
const data = [
	{ title: '首页', path: root + '/workbench/index', component:'pages/workbench/index', root: root + '/workbench'},
	{ title: '消息', path: root + '/workbench/info', component:'pages/workbench/info' },
	{ title: '设置', path: root + '/workbench/set', component:'pages/workbench/set' },
]
// ===================================================================== component
export default () => <Menu data={data} />