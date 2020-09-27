import React from 'react'
// ===================================================================== private template
import Router from './router'
const Frame = window.$async(()=>import('#frame/frame'))
// ===================================================================== 目录
const data = [
	{ title: '工作台', path:'workbench'},
	{ title: '检测中心', path:'testing-center'},
	{ title: '实验室管理', path:'laboratory-manage'},
]

// ===================================================================== component
export default () => <Frame title='实验室系统' data={data} Router={Router} />