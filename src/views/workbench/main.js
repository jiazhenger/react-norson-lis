import React from 'react'
// ===================================================================== private template
const Menu = window.$async(()=>import('#frame/menu'))
// ===================================================================== 目录
const root = window.$fn.getRoot()
let data = [
	{ title: '首页', path:'workbench/index', component:'workbench/index', root: 'workbench', to: 'workbench/index'},
	{ title: '消息', path:'workbench/info', component:'workbench/info' },
	{ title: '设置', path:'workbench/set', component:'workbench/set' },
]
// ===================================================================== component
export default () => <Menu data={data} />