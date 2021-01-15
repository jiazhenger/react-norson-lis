import React from 'react'
// ===================================================================== private template
// import Menu from '#frame/menu'
const Menu = window.$async(()=>import('#frame/menu'))
// ===================================================================== 目录
const data = [
	{ 
		title: '账单统计',
		root: 'finance-page',
		to: 'finance-page/control',
		children: [
			{ title: '收入成本汇总统计',path: 'finance-page/control',	      component:'finance/finance-page/tp/control',  },
			{ title: '收入成本明细',    path: 'finance-page/cost-breakdown',  component: 'finance/finance-page/cost-breakdown' },
			{ title: '总外包清单管理',  path: 'finance-page/outsourcing-list',component: 'finance/finance-page/outsourcing-list' },
			{ title: '自然项目统计',  	path: 'finance-page/natural-projects',component: 'finance/finance-page/tp/natural-projects' },
		]
	},
	{ title: '账单明细',	  path: 'finance-page/finance-list/bill-details',		component: 'finance/finance-page/finance-list/bill-details' },
	{ title: '财务待确认账单',path:'finance-page/finance-list/finance-confirm',		component: 'finance/finance-page/finance-list/finance-confirm' },
	{ title: '账单结算-明细', path:'finance-page/finance-list/settlement-details',	component: 'finance/finance-page/finance-list/settlement-details' },
	{ title: '账单结算-医院', path:'finance-page/finance-list/settlement-hospital',	component: 'finance/finance-page/finance-list/settlement-hospital' },
	{ title: '已结算账单查询',path:'finance-page/finance-list/bill-inquiry',		component: 'finance/finance-page/finance-list/bill-inquiry' },
]
// ===================================================================== component
export default () => <Menu data={data} />