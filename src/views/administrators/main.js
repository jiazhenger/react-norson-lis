import React from 'react'
// ===================================================================== private template
import Router from './router'
const Frame = window.$async(()=>import('#frame/frame'))
// ===================================================================== 目录
const data = [
	{ title: '工作台', path:'workbench'},
	{ title: '标本管理', path:'specimen-manage'},
	{ title: '检测中心', path:'testing-center'},
	{ title: '委托检验中心', path:'entrust-testing-center'},
	{ title: '实验室管理', path:'laboratory-manage'},
	
	{ title: '系统设置', path:'system-settings'},
	{ title: '系统管理', path:'system-manage'},
	{ title: '财务管理', path:'finance-page'},
	{ title: '业务系统', path:'businessList'},
	{ title: '客服系统', path:'service-page'},
	{ title: '物流系统', path:'lgistics-page'},
]
// ===================================================================== component
export default () => <Frame title='管理员系统' data={data} Router={Router} />