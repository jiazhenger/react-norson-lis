import React from 'react'
// ===================================================================== private template
// import Menu from '#frame/menu'
const Menu = window.$async(()=>import('#frame/menu'))
// ===================================================================== 目录
const data = [
	{
		title: '流程管理',
		root: 'system-manage',
		to: 'system-manage/process-list',
		children: [
			{ title: '流程列表',		path:'system-manage/process-list',			component:'administrators/system-settings/process/process-list'},
			{ title: '节点列表',		path:'system-manage/node-list',				component:'administrators/system-settings/process/node-list'},
			{
				title: '流程授权列表',
				path:'system-manage/process-authorization',
				component:'administrators/system-settings/process/process-authorization',
				child: [
					{ title: '关联权限库', path: 'associated', component:'administrators/system-settings/authority/associated', cache:true }
				]
			},
		]
	},
	{
		title: '组织管理',
		children: [
			{ title: '公司管理',		path:'system-manage/company',			component:'administrators/system-settings/organization/company'},
			{ title: '部门管理',		path:'system-manage/department',		component:'administrators/system-settings/organization/department'},
			{ title: '科室管理',		path:'system-manage/office',			component:'administrators/system-settings/organization/office'},
			{ title: '岗位管理',		path:'system-manage/post',			component:'administrators/system-settings/organization/post'},
			{
				title: '员工管理',
				path:'system-manage/staff',
				component:'administrators/system-settings/organization/staff',
				child: [
					{ title: '关联权限库', path: 'associated', component:'administrators/system-settings/authority/associated', cache:true }
				]
			},
		]
	},
	{
		title: '权限管理',
		children: [
			{ title: '权限库',			path:'system-manage/permission',	component:'administrators/system-settings/authority/permission'},
			{
				title: '分组列表',
				path:'system-manage/group',
				component:'administrators/system-settings/authority/group',
				child: [
					{ title: '关联权限库', path: 'associated', component:'administrators/system-settings/authority/associated', cache:true }
				]
			},
			{
				title: '职位列表',
				path:'system-manage/position',
				component:'administrators/system-settings/authority/position',
				child: [
					{ title: '关联权限库', path: 'associated', component:'administrators/system-settings/authority/associated', cache:true }
				]
			},
			{
				title: '角色列表',
				path:'system-manage/role',
				component:'administrators/system-settings/authority/role',
				child: [
					{ title: '关联权限库', path: 'associated', component:'administrators/system-settings/authority/associated', cache:true }
				]
			},
			{ title: '菜单列表',		path:'system-manage/menu',			component:'administrators/system-settings/authority/menu'},
			{ title: '系统配置',		path:'system-manage/system-config',	component:'administrators/system-settings/authority/system-config'},
		]
	},
	{
		title: '字典维护',
		children: [
			{ title: '字典分类',		path:'system-manage/dictionary-classify',			component:'administrators/system-settings/dictionary/dictionary-classify'},
			{ title: '数据字典',		path:'system-manage/dictionary-data',				component:'administrators/system-settings/dictionary/dictionary-data'},
		]
	},
	{ 
		title: '消息列表',
		children: [
			{ title: '系统公告',	path: 'system-manage/system-notice',	  
				component:'systemManagement/system-manage/MessageList/system-notice',  },
		]
	},
]
// ===================================================================== component
export default () => <Menu data={data} />