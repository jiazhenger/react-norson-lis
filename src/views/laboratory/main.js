import React from 'react'
// ===================================================================== private template
const Frame = window.$async(()=>import('#frame/frame'))
// ===================================================================== 目录
const data = [
	{ title: '工作台', path:'/laboratory/workbench', component: 'pages/workbench/main', root:'/laboratory' },
	{ title: '检测中心', path:'/laboratory/testing-center'},
	{ title: '实验室管理', path:'/laboratory/laboratory-manage'},
]
// ===================================================================== component
export default () => <Frame title='实验室系统' data={data} />