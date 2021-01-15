import React from 'react'
// ===================================================================== private template
const Menu = window.$async(()=>import('#frame/menu'))
// ===================================================================== 目录
let data = [
	{ title: '系统登录日志', path:'system-settings/login-log',	component:'administrators/system-settings/logs/login-log', root: 'system-settings', to: 'system-settings/login-log'},
	{
		title: '基础设置',
		children: [
			{ title: '列表模式', path:'system-settings/basic',	component:'administrators/system-settings/basic-settings/list-mode'},
		]
	},
	{
		title: '集团设置',
		children: [
			{ title: '集团设置',		path:'system-settings/group-settings',		component:'administrators/system-settings/group-settings/index'},
			{ title: '系统物价管理',	path:'system-settings/price-management',	component:'administrators/system-settings/group-settings/price-management'},
			{ title: '公司模板列表',	path:'system-settings/company-template',	component:'administrators/system-settings/group-settings/company-template'},
			{ title: '系统设置-源配置',	path:'system-settings/source-config',		component:'administrators/system-settings/group-settings/source-config'},
		]
	},
	{
		title: '项目设置',
		children: [
			{
				title: '检测项目',
				path:'system-settings/project-settings',
				component:'administrators/system-settings/project/index',
				child:[
					{ title: '设置单一项目',	path: 'single',				component:'administrators/system-settings/project/single',					cache:true },
					{ title: '新增从属项目',	path: 'subordinate',		component:'administrators/system-settings/project/subordinate',				cache:true},
					{ title: '设定组合项目',	path: 'combination',		component:'administrators/system-settings/project/combination',				cache:true },
					{ title: '设置营销项目',	path: 'marketing',			component:'administrators/system-settings/project/marketing',				cache:true },
					{ title: '参考范围',		path: 'reference-range',	component:'administrators/system-settings/project/tp/reference-range-form',	cache:true },
				]
			},
		]
	},
	{
		title: '导出规则管理',
		children: [
			{
				title: '导出规则设置',
				path: 'system-settings/export-rule',
				component: 'administrators/system-settings/export-rule/index',
				child:[
					{ title: '配置导出模板', path: 'template', component:'administrators/system-settings/export-rule/template', cache:true }
				]
			}
		]
	},
	{ title: '打印机管理',	path: 'system-settings/printer',	component: 'administrators/system-settings/printer/index' },
	{ title: '系统日志',	path: 'system-settings/system-log',	component: 'administrators/system-settings/logs/system-log' },
]
// ===================================================================== component
export default () => <Menu data={data} />