import React from 'react'
// ===================================================================== private template
const Menu = window.$async(()=>import('#frame/menu'))
// ===================================================================== 目录
const data = [
	{
		title: '设备管理',
		root: '/laboratory/laboratory-manage',
		to:'/laboratory/laboratory-manage/equipment-list',
		children: [
			{ title: '设备列表', path: '/laboratory/laboratory-manage/equipment-list' },
			{ title: 'GPS设备', path: '/laboratory/laboratory-manage/equipment-gps' },
			{ title: '校准计划', path: '/laboratory/laboratory-manage/calibration-plan' },
			{ title: '校准记录', path: '/laboratory/laboratory-manage/calibration-record' },
			{ title: '项目关联', path: '/laboratory/laboratory-manage/project-related' },
			{ title: '仪器通道管理', path: '/laboratory/laboratory-manage/instrument-manage' },
			{ title: '设备维护', path: '/laboratory/laboratory-manage/equipment-maintain' },
			{ title: '设备结果管理', path: '/laboratory/laboratory-manage/equipment-result-manage' },
		]
	},
	{
		title: '标签管理',
		children: [
			{ title: '实验号模板', path: '/laboratory/laboratory-manage/expno-template' },
			{ title: '标签模板', path: '/laboratory/laboratory-manage/label-template' },
			{ title: '合并规则', path: '/laboratory/laboratory-manage/merging-rules' },
		]
	},
]
// ===================================================================== component
export default () => {
	return <Menu data={data} />
}