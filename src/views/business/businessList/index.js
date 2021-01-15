import React from 'react'
// ===================================================================== private template
// import Menu from '#frame/menu'
const Menu = window.$async(()=>import('#frame/menu'))
// ===================================================================== 目录
const data = [
	{ 
		title: '医院管理',
		root: 'businessList',
		to: 'businessList/My-hospital-clients',
		children: [
			{ 	title: '我的医院客户',path: 'businessList/My-hospital-clients', 		 
				component: 'business/businessList/My-hospital-clients'}, 		 // 表格的查看和编辑未做
			{ 	title: '下级医院客户',
				path: 'businessList/LowerLevel-hospital-clients',
				component: 'business/businessList/LowerLevel-hospital-clients',
				child:[
					{ title: '医院客户编辑', path: 'add', component:'business/businessList/child/my-hospital-child', cache:true }
				]}, // 表格的查看和编辑未做
		]
	},
	{ 
		title: '合同管理',
		children: [
			{ title: '我的合同管理',path: 'businessList/My-contract-manage',	     
				component: 'business/businessList/My-contract-manage'},			// 表格操作未做
			{ title: '下级合同管理',path: 'businessList/LowerLevel-contract-manage', 
				component: 'business/businessList/LowerLevel-contract-manage'},	// 表格操作未做
		]
	},
	{ title: '我的下级业务员',	  	path: 'businessList/My-lowerLevel-salesman',	 
		component: 'business/businessList/My-lowerLevel-salesman'},
	{ 
		title: '账单管理',
		children: [
			{ title: '我的财务账单',path: 'businessList/My-finance-bill',	      	 
				component: 'business/businessList/My-finance-bill'},
			{ title: '下级财务账单',path: 'businessList/LowerLevel-finance-bill',    
				component: 'business/businessList/LowerLevel-finance-bill'},
		]
	},
	{ title: '待确认账单',			path:'businessList/bill-ToBeConfirmed',  		 
		component: 'business/businessList/bill-ToBeConfirmed'},
	
	{ 
		title: '业务管理',
		children: [
			{ title: '业务员管理',  path: 'businessList/salesman-manage',  			 
				component: 'business/businessList/salesman-manage'}, // 已完成
			{ title: '业务区域',    path: 'businessList/salesman-region',  			 
				component: 'business/businessList/salesman-region'},  // 已完成
			{ title: '修改项目价格',path: 'businessList/Modify-project-price',	    
				component: 'business/businessList/Modify-project-price'}, // 已完成
		]
	},
	{ 
		title: '客户管理',
		children: [
			{ title: '医院客户',	path: 'businessList/hospital-clients',	         
				component: 'business/businessList/hospital-clients',
				child:[
					{ title: '物价管理', path: 'clients', component:'business/businessList/child/price-control', cache:true },
				]},
			{ 	title: '合同管理',    
				path: 'businessList/contract-manage',  			 
				component: 'business/businessList/contract-manage',
				child:[
					{ title: '合同签订记录', path: 'record', component:'business/businessList/child/contract-signing-record', cache:true },
					{ title: '合同签订记录', path: 'edit',	 component:'business/businessList/child/contract-signing-edit',   cache:true }
				]},
		]
	},
]
// ===================================================================== component
export default () => <Menu data={data} />