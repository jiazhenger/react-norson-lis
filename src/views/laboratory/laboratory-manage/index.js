import React from 'react'
// ===================================================================== private template
const Menu = window.$async(()=>import('#frame/menu'))
// ===================================================================== 目录
const data = [
	{
		title: '设备管理',
		children: [
			{ title: '设备列表' },
			{ title: 'GPS设备' },
			{ title: '校准计划' },
			{ title: '校准记录' },
			{ title: '项目关联' },
			{ title: '仪器通道管理' },
			{ title: '设备维护' },
			{ title: '设备结果管理' },
		]
	},
	{
		title: '标签管理',
		children: [
			{ title: '实验号模板' },
			{ title: '标签模板' },
			{ title: '合并规则' },
		]
	},
]
// ===================================================================== component
export default () => {
	return <Menu data={data} />
}