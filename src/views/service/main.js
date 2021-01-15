import React from 'react'
// ===================================================================== private template
import Router from './router'
const Frame = window.$async(()=>import('#frame/frame'))
// ===================================================================== 目录
const data = [
	{ title: '工作台', path:'workbench'},
	{ title: '客服系统', path:'service-page'},
]

// ===================================================================== component
export default () => <Frame title='客服系统' data={data} Router={Router} />