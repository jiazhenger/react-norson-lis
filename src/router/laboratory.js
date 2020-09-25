/**
 * 实验室
 * */
moudule.export = [
	{ 	title: '工作台', path:'/laboratory/workbench', component: 'pages/workbench/index',
		children:[
			{ title: '首页', path:'/laboratory/workbench/index' },
			{ title: '消息', path:'/laboratory/workbench/info' },
			{ title: '设置', path:'/laboratory/workbench/set' },
		]
	},
	{ 	title: '检测中心', path:'/laboratory/testing-center',
		children:[
			{ 
				title: '血液室',
				children: [
					{ title: '过敏原岗' },
					{ title: '流式分析岗' },
					{ title: '血液杂项岗' },
					{ title: '常规血液岗' },
					{ title: '骨髓涂片岗' },
				]
			},
			{
				title: '生化室',
				children: [
					{ title: '常规生化岗' },
					{ title: '糖化岗' },
				]
			},
		]
	},
	{  title: '实验室管理', path:'/laboratory/laboratory-manage',
		children:[
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
	},
]