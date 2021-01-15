import React from 'react'
// ===================================================================== private template
import Router from './router'
const Frame = window.$async(()=>import('#frame/frame'))
// ===================================================================== 目录
const data = [
	{ title: '工作台', path:'workbench'},
	{ title: '业务管理', path:'businessList/My-hospital-clients'},
]

// ===================================================================== component
export default () => <Frame title='业务管理' data={data} Router={Router} />