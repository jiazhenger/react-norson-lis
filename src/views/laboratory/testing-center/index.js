import React from 'react'
// ===================================================================== private template
const Menu = window.$async(()=>import('#frame/menu'))
// ===================================================================== 目录
const data = [
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
// ===================================================================== component
export default () => {
	return <Menu data={data} />
}