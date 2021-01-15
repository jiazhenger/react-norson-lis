import React from 'react'
// ===================================================================== private template
import Router from './router'
const Frame = window.$async(()=>import('#frame/frame'))
// ===================================================================== 目录
const data = [
	{ title: '工作台', path:'workbench'},
	{ title: '系统管理', path:'system-manage/process-list'},
]

// ===================================================================== component
export default () => <Frame title='系统管理' data={data} Router={Router} />