import React from 'react'
// ===================================================================== private template
import Router from './router'
const Frame = window.$async(()=>import('#frame/frame'))
// ===================================================================== 目录
const data = [
	{ title: '工作台', path:'workbench'}, 
	{ title: '物流系统', path:'lgistics-page'}, 
]

// ===================================================================== component
export default () => <Frame title='物流系统' data={data} Router={Router} />