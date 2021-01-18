import React from 'react'
// ===================================================================== private template
// import Menu from '#frame/menu'
const Menu = window.$async(()=>import('#frame/menu'))
// ===================================================================== 目录
const data = [
	{ 
		title: '血液室',
		root: 'testing-center', 
		to: 'testing-center',
		component: 'laboratory/testing-center',
		children: [
			// 44008  液基细胞病理岗
			{ title: '血培养岗44011', 		component: 'laboratory/testing-center/result44011', path: 'testing-center/result44011/44011/1bcaf6fb-cda6-1a8f-481f-8417e03bb099/0' }, 
			{ title: '支原体岗44012', 		component: 'laboratory/testing-center/result44012', path: 'testing-center/result44012/44012/6375f08f-02ad-9805-6a5e-801afe188844/0' }, 
			{ title: '特殊染色岗44013', 	component: 'laboratory/testing-center/result44013', path: 'testing-center/result44013/44013/64ee74bc-1247-e85b-f15c-22c8ba77c798/0' }, 
			{ title: '常规生化岗44014', 	component: 'laboratory/testing-center/result44014', path: 'testing-center/result44014/44014/a6890c25-3238-206f-38da-aa8b59657582/0' }, 
			{ title: '细胞遗传岗44015', 	component: 'laboratory/testing-center/result44015', path: 'testing-center/result44015/44015/9394162e-208f-b8e7-5c81-c18c1edaa749/0' }, 
			{ title: '骨髓涂片岗44016', 	component: 'laboratory/testing-center/result44016', path: 'testing-center/result44016/44016/548f7cf9-2d53-1762-5861-6da8345a4285/0' }, 
			{ title: '血液杂项岗44017', 	component: 'laboratory/testing-center/result44014', path: 'testing-center/result44017/44017/67a5fd1c-8aeb-2ac9-8ce4-53cb9804809d/0' }, 
			{ title: '荧光原位杂交岗44018',	component: 'laboratory/testing-center/result44018', path: 'testing-center/result44018/44018/4c61ed22-06c6-92f4-b996-ab09af26fe30/0' }, 
			{ title: '院感岗44019', 		component: 'laboratory/testing-center/result44014', path: 'testing-center/result44019/44019/235a168d-9f16-3e1a-87b3-2eadf6325e56/0' }, 
			{ title: '培养鉴定药敏岗44020', component: 'laboratory/testing-center/result44020', path: 'testing-center/result44020/44020/11dd6fde-8aa0-857f-a88f-0c5009862069/0' }, 
			{ title: '组织病理岗44021', 	component: 'laboratory/testing-center/result44021', path: 'testing-center/result44021/44021/39c1b0fd-0515-7f73-3da7-d7ea7a6a0269/0' }, 
			{ title: '免疫组化岗44022', 	component: 'laboratory/testing-center/result44022', path: 'testing-center/result44022/44022/fd5ec2e5-5caa-1c44-2ee1-72bfd29849c3/0' }, 
			{ title: '常规涂片岗44024', 	component: 'laboratory/testing-center/result44014', path: 'testing-center/result44024/44024/7e8a74bb-b6fc-50cc-dfc0-d2ab25747552/0' }, 
			{ title: 'T-SPOT岗44025', 		component: 'laboratory/testing-center/result44014', path: 'testing-center/result44025/44025/529c051b-df10-e54a-5d32-59b8cec4b72c/0' }, 
			{ title: 'HPV分型岗44027', 		component: 'laboratory/testing-center/result44014', path: 'testing-center/result44027/44027/529c051b-df10-e54a-5d32-59b8cec4b72c/0' }, 
			{ title: '过敏原岗44028', 		component: 'laboratory/testing-center/result44014', path: 'testing-center/result44028/44028/302ff16a-7997-5c1b-4630-c132c13baafb/0' }, 
			{ title: '细胞涂片岗44029', 	component: 'laboratory/testing-center/result44029', path: 'testing-center/result44029/44029/f61d71d3-337c-0155-85a9-1c52964fee1f/0' }, 
			{ title: '非妇科液基岗44030', 	component: 'laboratory/testing-center/result44030', path: 'testing-center/result44030/44030/24bb0bcf-a7e0-9ee6-a6af-e9a8dffd6a5b/0' },
			{ title: 'CTC岗44031', 			component: 'laboratory/testing-center/result44031', path: 'testing-center/result44031/44031/5ab013ad-385a-5f71-6d5c-eb2cf574f34b/0' },
		]
	}, 
	// {
	// 	title: '生化室',
	// 	children: [
	// 		{ title: '常规生化岗', id:'44014', pid:'a6890c25-3238-206f-38da-aa8b59657582' },
	// 		{ title: '糖化岗', id:'44014', pid:'baeab0a5-0a02-870d-79d7-0f562ece48cf' },
	// 	]
	// },
]
// const { root } = window.$fn.getRoot()
// const _root = data[0].root
// data.forEach((v,i)=>{
// 	const d = v.children[0]
// 	if(i === 0){
// 		v.to = v.root + '/' + d.id + '/' + d.pid
// 	}
// 	v.children.forEach((m,k)=>{
// 		const { id, pid } = m
// 		m.component = `laboratory/testing-center/result${id}`
// 		m.path = _root + '/' + id + '/' + pid
// 		m.url = root + _root
// 	})
// })
// ===================================================================== component
export default () => <Menu data={data} />