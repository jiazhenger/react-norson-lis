import React from 'react'
// ===================================================================== private template
// import Menu from '#frame/menu'
const Menu = window.$async(()=>import('#frame/menu'))
// ===================================================================== 目录
const data = [     
	{ title: '录入条码', path:'lgistics-page/enter-barcode',	component:'lgistics/lgistics-page/enter-barcode/index', root: 'lgistics-page', to: 'lgistics-page/enter-barcode'}, // 已完成 
	{
		title: '标箱管理',
		children: [
			{ title: '物流办事处',	path: 'lgistics-page/teus/logistics-office',	component:'lgistics/lgistics-page/teus/logistics-office' }, // 已完成 2020-12-10 | 省市区联动未完成
            { title: '标箱管理',		path: 'lgistics-page/teus/index',				component:'lgistics/lgistics-page/teus/index' },  // 已完成 2020-12-8 
            { title: '标箱使用记录',	path: 'lgistics-page/teus/use-record',			component:'lgistics/lgistics-page/teus/use-record' },  // 已完成 2020-12-8 
		]
	}, 
	{ 
		title: '基本资料录入', path: 'lgistics-page/basic-data-entry/index',  component: 'administrators/specimen-manage/basic-data-entry/index',
		child:[
			{ title: '双录入', path: 'doubleentry', component: 'administrators/specimen-manage/basic-data-entry/tp/doubleentry' }, 
			{ title: '快捷录入', path: 'quickentry', component: 'administrators/specimen-manage/basic-data-entry/tp/quickentry' }, 
		]
	},  
	{ 
		title: '项目信息', path: 'lgistics-page/project-list/index',  component: 'administrators/specimen-manage/project-list/index',
		child:[
			{ title: '录入项目/审核项目', path: 'info-project', component: 'administrators/specimen-manage/project-list/tp/info-project' }, 
		]
	},   
	{ 
		title: '待处理标本图片', path: 'lgistics-page/processed-image',  component: 'administrators/specimen-manage/processed-image',
		child:[
			{ title: '图片上传', path: 'upload', component:'administrators/specimen-manage/processed-image-upload' }, 
			{ title: '条码关联', path: 'relevance', component:'administrators/specimen-manage/processed-image-relevance' }, 
			{ title: '图片审核', path: 'audit', component:'administrators/specimen-manage/processed-image-audit' }  
		]
	 },
	{ title: '条码管理', 		path: 'lgistics-page/generate-barcode',			component:'administrators/specimen-manage/generate-barcode' }, 
	{ title: '条码生成记录',	path: 'lgistics-page/generate-barcode-record',	component:'lgistics/lgistics-page/generate-barcode-record' }, // 已完成 2020-12-7
	{ title: '我的标箱',		path: 'lgistics-page/my-teu',					component:'lgistics/lgistics-page/my-teu/index' }, // 已完成 2020-12-8 
	{ 
		title: '标本箱转移',		path: 'lgistics-page/box-transfer',				component:'lgistics/lgistics-page/box-transfer/index', // 已完成 2020-12-10
		child: [
			{ title: '整箱转箱', path: 'full-transfer', component: 'lgistics/lgistics-page/box-transfer/full-transfer' },  // 已完成 2020-12-15
			{ title: '部分转箱', path: 'part-transfer', component: 'lgistics/lgistics-page/box-transfer/part-transfer' }  // 已完成 2020-12-15
		]
	},
	{ title: '我的申请单',		path: 'lgistics-page/my-application',			component:'lgistics/lgistics-page/my-application/index',  // 已完成 2020-12-9
		child: [
			{ title: '详细信息', path: 'detail', component: 'lgistics/lgistics-page/my-application/detail' },  // 已完成 2020-12-9
		]
	}, 
	{ title: '报告单派送',		path: 'lgistics-page/reports-delivered',		component:'lgistics/lgistics-page/reports-delivered' },   // 已完成 2020-12-9 | 预览未完成
	{ title: '物流跟踪',		path: 'lgistics-page/logistics-tracking',		component:'lgistics/lgistics-page/logistics-tracking/index' }, // 已完成 2020-12-9 | 手动录入未完成
	{ 
		title: '我的医院',		path: 'lgistics-page/my-hospital',				component:'lgistics/lgistics-page/my-hospital/index',  // 已完成 2020-12-9
		child: [
			{ title: '查看报告', path: 'report', component: 'lgistics/lgistics-page/my-hospital/report' },  // 已完成 2020-12-9 | 预览未完成
		]
	}, 
	{ title: '我的外包清单',	path: 'lgistics-page/my-outsourcing-list',		component:'lgistics/lgistics-page/my-outsourcing-list' }, // 已完成 2020-12-9
]
// ===================================================================== component
export default () => <Menu data={data} />