// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== private template
const Menu = window.$async(()=>import('#frame/menu'))
// ===================================================================== 目录
const data = [
	{
		title: '标本信息录入',
		root: 'specimen-manage',
		to: 'specimen-manage/generate-barcode',
		children: [ 
            { title: '条码生成', path: 'specimen-manage/generate-barcode' }, // 已完成 2020-10-23
			{ 
				title: '基本资料录入', path: 'specimen-manage/basic-data-entry/index',  // 已完成 2020-12-4 | 自动跳下一行未完成
				child:[
					{ title: '双录入', path: 'doubleentry', component: 'administrators/specimen-manage/basic-data-entry/tp/doubleentry', cache:true }, // 薛玉梅 | 2020-12-28 14:33:05 | desc: 已完成
					{ title: '快捷录入', path: 'quickentry', component: 'administrators/specimen-manage/basic-data-entry/tp/quickentry', cache:true }, // 薛玉梅 | 2020-12-28 09:24:52 | desc: 已完成
				]
			},   
			{ 
				title: '项目清单', path: 'specimen-manage/project-list/index', // 已完成 2020-11-27 
				child:[
					{ title: '录入项目/审核项目', path: 'info-project', component: 'administrators/specimen-manage/project-list/tp/info-project', cache:true }, // 已完成 2020-12-2   
				]
			}, 
			{ 
				title: '待处理标本图片', path: 'specimen-manage/processed-image', // 已完成 2020-12-28 | 完成 
				child:[
					{ title: '图片上传', path: 'upload', component:'administrators/specimen-manage/processed-image-upload', cache:true }, // 已完成 2020-10-28
					{ title: '条码关联', path: 'relevance', component:'administrators/specimen-manage/processed-image-relevance', cache:true }, // 已完成 2020-10-28
					{ title: '图片审核', path: 'audit', component:'administrators/specimen-manage/processed-image-audit', cache:true }  // 已完成 2020-10-30
				]
			 },
			{ title: '标本日志', path: 'specimen-manage/specimen-log' }, // 已完成 2020-10-19
			{ title: '条码记录', path: 'specimen-manage/barcode-record' } // 已完成
		]
	},
	{
		title: '接收与分发',
		children: [
            { title: '接收标本箱', path: 'specimen-manage/receive-box' },  // 已完成 2020-10-20
			{ title: '标本箱接收记录', path: 'specimen-manage/receive-records' }, // 已完成
			{ title: '待分发', path: 'specimen-manage/to-be-distributed' }, // 已完成
			{ title: '标本上架', path: 'specimen-manage/specimen-shelves' }, // 已完成 2020-11-3 | 未打印，左右键盘事件
			{ title: '标本批量上架', path: 'specimen-manage/specimen-shelves-batch'}, // 已完成 2020-10-24 | ant多行文本框样式问题，上架完成参数提交问题
			{ title: '打印实验号', path: 'specimen-manage/print-expernum' }, // 已完成 2020-10-27 | 未打印
			{ 
				title: '标本领取', path: 'specimen-manage/specimens-receive', // 已完成 2020-11-5 
				child: [
					{ title: '快捷领取', path: 'quick', component:'administrators/specimen-manage/specimens-receive-quick', cache:true }  // 已完成 2020-11-5 
				]
			},
			{ title: '按条码打印实验号', path: 'specimen-manage/print-expernum-bycode' }, // 已完成 2020-10-27 | 未打印
			{ title: '标本领取记录', path: 'specimen-manage/specimen-collection-record' } // 已完成
		]
	},
	{
		title: '标本拆分管理',
		children: [
			{ title: '已拆分', path: 'specimen-manage/has-been-split' }, // 已完成(打印未完成) 2020-10-19
			{ title: '待拆分', path: 'specimen-manage/to-break-up' }, // 已完成(打印未完成) 2020-10-19
			{ title: '禁止拆分', path: 'specimen-manage/ban-split' } // 已完成
		]
    },
    { title: '标本查询', path: 'specimen-manage/specimens-query' }, // 已完成 2020-11-5
	{
		title: '容器管理', 
		children: [
			{ title: '分拣管理', path: 'specimen-manage/sorting-manage' }, // 已完成
			{ title: '标本架管理', path: 'specimen-manage/specimen-shelf-manage' }, // 已完成(打印未完成) 2020-10-19
			{ title: '领用记录', path: 'specimen-manage/recipients-records' } // 已完成
		]
    },
    { title: '标本作废记录', path: 'specimen-manage/specimen-invalidation-records' }, // 已完成
    { title: '标本异常管理', path: 'specimen-manage/specimen-anomaly-manage' } // 已完成
] 
// ===================================================================== component
export default () => {
	return <Menu data={data} />
}