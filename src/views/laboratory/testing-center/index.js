import React from 'react'
// ===================================================================== private template
// import Menu from '#frame/menu'
const Menu = window.$async(()=>import('#frame/menu'))
// ===================================================================== 目录
const data = [
	{ 
		title: '血液室',
		root: 'testing-center',
		component: 'laboratory/testing-center/template',
		children: [
			{ title: '过敏原岗',	 id:'44028', pid:'302ff16a-7997-5c1b-4630-c132c13baafb' },
			{ title: '流式分析岗', id:'44014', pid:'2023d1a5-10aa-e2a1-7b88-9e933ef5a6be' },
			{ title: '血液杂项岗', id:'44017', pid:'67a5fd1c-8aeb-2ac9-8ce4-53cb9804809d' },
			{ title: '常规血液岗', id:'44014', pid:'fbbf64ee-21bb-fc4a-4a1a-2e6fbf020ab3' },
			{ title: '骨髓涂片岗', id:'44016', pid:'548f7cf9-2d53-1762-5861-6da8345a4285' },
		]
	},
	{
		title: '生化室',
		children: [
			{ title: '常规生化岗', id:'44014', pid:'a6890c25-3238-206f-38da-aa8b59657582' },
			{ title: '糖化岗', id:'44014', pid:'baeab0a5-0a02-870d-79d7-0f562ece48cf' },
		]
	},
]
const { root } = window.$fn.getRoot()
const _root = data[0].root
data.forEach((v,i)=>{
	const d = v.children[0]
	if(i === 0){
		v.to = v.root + '/' + d.id + '/' + d.pid
	}
	v.children.forEach((m,k)=>{
		const { id, pid } = m
		m.path = _root + '/' + id + '/' + pid
		m.url = root + _root
	})
})
// ===================================================================== component
export default () => <Menu data={data} />