import React from 'react'
// ===================================================================== private template
import Router from './router'
const Frame = window.$async(()=>import('#frame/frame'))
// ===================================================================== 目录
const data = [
	{ title: '工作台', path:'workbench'},
	{ title: '财务管理', path:'finance-page/control'},
]

// ===================================================================== component
export default () => <Frame title='财务系统' data={data} Router={Router} />