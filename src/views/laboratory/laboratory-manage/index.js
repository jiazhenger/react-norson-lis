import React from 'react'
// ===================================================================== private template
const Menu = window.$async(()=>import('#frame/menu'))
// ===================================================================== 目录
const data = [
	{
		title: '设备管理',
		root: 'laboratory-manage',
		to: 'laboratory-manage/equipment-list',
		children: [
			{ 
				title: '设备列表', 
				path: 'laboratory-manage/equipment-list',
				component:'laboratory/laboratory-manage/device/equipment-list',
				child:[
					{ title: '添加设备', path: 'add', component:'laboratory/laboratory-manage/device/equipment-list-add', cache:true }
				]
			},
			{ title: 'GPS设备',			path: 'laboratory-manage/equipment-gps',		component:'laboratory/laboratory-manage/device/equipment-gps', },
			{ title: '校准计划',		path: 'laboratory-manage/calibration-plan',		component: 'laboratory/laboratory-manage/device/calibration-plan' },
			{ title: '校准记录',		path: 'laboratory-manage/calibration-record',	component: 'laboratory/laboratory-manage/device/calibration-record' },
			{ title: '项目关联',		path: 'laboratory-manage/project-related',		component: 'laboratory/laboratory-manage/device/project-related' },
			{ title: '仪器通道管理',	path: 'laboratory-manage/instrument-manage',	component: 'laboratory/laboratory-manage/device/instrument-manage' },
			{
				title: '设备维护',
				path: 'laboratory-manage/equipment-maintain',
				component: 'laboratory/laboratory-manage/device/equipment-maintain',
				child:[
					{ title: '设备维修', path: 'repair',		component:'laboratory/laboratory-manage/device/equipment-repair',	cache:true },
					{ title: '维修记录', path: 'repair-record', component:'laboratory/laboratory-manage/device/repair-record',		cache:true }
				]
			},
			{ title: '设备结果管理',	path: 'laboratory-manage/equipment-result-manage',	component: 'laboratory/laboratory-manage/device/equipment-result-manage' },
		]
	},
	{
		title: '标签管理',
		children: [
			{
				title: '实验号模板',
				path: 'laboratory-manage/expno-template',
				component: 'laboratory/laboratory-manage/label/expno-template',
				child:[
					{ title: '实验号模板-设置规则', path: 'add', component:'laboratory/laboratory-manage/label/expno-template-add', cache:true }
				]
			},
			{ title: '标签模板',		path: 'laboratory-manage/label-template',	component: 'laboratory/laboratory-manage/label/label-template' },
			{ title: '合并规则',		path: 'laboratory-manage/merge-rules',		component: 'laboratory/laboratory-manage/label/merge-rules' },
			{ title: '合并项目列表',	path: 'laboratory-manage/merge-project',	component: 'laboratory/laboratory-manage/label/merge-project' },
		]
	},
	{
		title: '物料管理',
		children: [
			{ title: '物料管理列表',	path: 'laboratory-manage/material-list',	component: 'laboratory/laboratory-manage/material/material-list' },
			{ title: '入库',			path: 'laboratory-manage/material-import',	component: 'laboratory/laboratory-manage/material/material-import' },
			{
				title: '出库',
				path: 'laboratory-manage/material-export',
				component: 'laboratory/laboratory-manage/material/material-export',
				child:[
					{ title: '申请单列表', path: 'application', component:'laboratory/laboratory-manage/material/application-list', cache:true }
				]
			},
			{ title: '库存警告',		path: 'laboratory-manage/stock-warning',	component: 'laboratory/laboratory-manage/material/stock-warning' },
		]
	},
	{
		title: '报告单管理',
		children: [
			{ title: '未发报告清单',	path: 'laboratory-manage/undelivered-report',	component: 'laboratory/laboratory-manage/report/undelivered-report' },
			{
				title: '报告单管理',
				path: 'laboratory-manage/report-manage',
				component: 'laboratory/laboratory-manage/report/report-manage',
				child:[
					{ title: '查看报告单', path: 'info', component:'laboratory/laboratory-manage/report/view-report', cache:true }
				]
			},
			{
				title: '报告单模板',
				path: 'laboratory-manage/report-template',
				component: 'laboratory/laboratory-manage/report/report-template',
				child:[
					{ title: '版本管理', path: 'version', component:'laboratory/laboratory-manage/report/version-manage', cache:true }
				]
			},
			{ title: '报告单抬头',			path: 'laboratory-manage/report-title',	component: 'laboratory/laboratory-manage/report/report-title' },
		]
	},
	{ title: '实验室设置',	path: 'laboratory-manage/rules-setting',	component: 'laboratory/laboratory-manage/laboratory-settings/rule-setting' },
	{ title: '实验号管理',	path: 'laboratory-manage/experiment-num',	component: 'laboratory/laboratory-manage/experiment-num/index' },
	{
		title: '微生物设置',
		children: [
			{ title: '药敏',		path: 'laboratory-manage/drug-sensitivity',			component: 'laboratory/laboratory-manage/microorganism/drug-sensitivity' },
			{ title: '药敏组合',	path: 'laboratory-manage/drug-sensitivity-comb',	component: 'laboratory/laboratory-manage/microorganism/drug-sensitivity-comb' },
		]
	},
	{ title: '荒谬值',			path: 'laboratory-manage/absurdity-value',			component: 'laboratory/laboratory-manage/absurdity-value/index' },
	{ title: '项目结果清单',	path: 'laboratory-manage/project-result',			component: 'laboratory/laboratory-manage/project-result/index' },
	{ title: '项目统计单',		path: 'laboratory-manage/project-statistics',		component: 'laboratory/laboratory-manage/project-statistics/index' },
	{ title: '外包管理',		path: 'laboratory-manage/outsourcing-management',	component: 'laboratory/laboratory-manage/outsourcing/index' },
	{
		title: '轮转管理',
		children: [
			{
				title: '轮转规则列表',
				path: 'laboratory-manage/rotation-rule',
				component: 'laboratory/laboratory-manage/rotation-manage/index',
				child:[
					{ title: '轮转绑定', path: 'bind', component:'laboratory/laboratory-manage/rotation-manage/bind-rotation', cache:true }
				]
			},
		]
	},
	{
		title: '病理设置',
		children: [
			{ title: 'TCT规则设置',		path: 'laboratory-manage/tct-settings',			component: 'laboratory/laboratory-manage/pathological/tct' },
		]
	},
	{
		title: '实验报表统计',
		children: [
			{ title: '采样时间录入',		path: 'laboratory-manage/sampling-time-in',		component: 'laboratory/laboratory-manage/statistics/sampling-time-in' },
			{ title: '测试数统计',			path: 'laboratory-manage/test-data',			component: 'laboratory/laboratory-manage/statistics/test-data' },
			{ title: '实验室迟发统计',		path: 'laboratory-manage/delay',				component: 'laboratory/laboratory-manage/statistics/delay' },
			{ title: '实验室退单统计',		path: 'laboratory-manage/chargeback',			component: 'laboratory/laboratory-manage/statistics/chargeback' },
			{ title: '实验室标本量',		path: 'laboratory-manage/sample',				component: 'laboratory/laboratory-manage/statistics/sample' },
			{ title: '实验室危急值统计',	path: 'laboratory-manage/critical-value',		component: 'laboratory/laboratory-manage/statistics/critical-value' },
			{ title: 'TAT统计',				path: 'laboratory-manage/tat',					component: 'laboratory/laboratory-manage/statistics/tat' },
		]
	},
]
// ===================================================================== component
export default () => {
	return <Menu data={data} />
}