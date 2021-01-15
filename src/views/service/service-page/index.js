import React from 'react'
// ===================================================================== private template
const Menu = window.$async(()=>import('#frame/menu'))
// ===================================================================== 目录
const data = [ 
	{
		title: '报告单管理',
		path: 'service-page/report-manage',
		component: 'laboratory/laboratory-manage/report/report-manage',
		root: 'service-page', 
		to: 'service-page/report-manage',
		child:[ 
			{ title: '查看报告单', path: 'info', component:'laboratory/laboratory-manage/report/view-report', cache:true },  // 已完成
		]
	}, 
	{ title: '报告单终止记录',			path: 'service-page/report-termination-record',				component: 'service/service-page/report-termination-record' }, // 已完成 2020-12-23
    { title: '标本查询', 				path: 'service-page/specimens-query',						component: 'administrators/specimen-manage/specimens-query'  }, // 已完成
	{ title: '统计', 					path: 'service-page/statistics',							component: 'service/service-page/statistics/index'  }, // 薛玉梅 | 2020-12-23 14:31:33 | desc: 已完成页面 
	{ title: '加减项', 					path: 'service-page/addsubtract',							component: 'service/service-page/addsubtract'  }, // 薛玉梅 | 2020-12-23 17:09:49 | desc: 已完成页面 
	{ title: '客户反馈', 				path: 'service-page/customer-feedback',						component: 'service/service-page/customer-feedback'  }, // 薛玉梅 | 2020-12-23 18:04:07 | desc: 已完成页面
	{ title: '信息修改', 				path: 'service-page/infochange',							component: 'service/service-page/infochange'  },  // 薛玉梅 | 2020-12-25 14:27:09 | desc: 已完成页面 
]
// ===================================================================== component
export default () => <Menu data={data} />