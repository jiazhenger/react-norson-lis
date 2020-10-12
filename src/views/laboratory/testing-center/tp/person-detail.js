import React from 'react'
// ===================================================================== antd

// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== component
const SubmitForm = $async(()=>import('#cpt/submit-form'))
// ===================================================================== private template
const Box = $async(()=>import('#tp/box/box'))
// ===================================================================== template
const submit = [
	{ label:'标本条码', 		name:'device_name' },
	{ label:'实验号', 		name:'device_number'},
	{ label:'姓名', 		name:'device_number'},
	{ label:'年龄', 		name:'device_number'},
	{ label:'性别', 		name:'device_number'},
	{ label:'送检科室', 		name:'device_number'},
	{ label:'床号', 		name:'device_number'},
	{ label:'送检医生', 		name:'device_number'},
	{ label:'联系电话', 		name:'device_number'},
	{ label:'采集日期', 		name:'device_number'},
	{ label:'送检单位', 		name:'device_number'},
	{ label:'单位标识', 		name:'device_number'},
	{ label:'标本性状', 		name:'device_number'},
	{ label:'备注', 		name:'device_number', type:'textarea', rows:2},
]
// ===================================================================== component
export default () => {
	
	return (
		<Box className='mlr10 fv' title='人员详情' style={{width:250}}>
			<SubmitForm
				className 	= 'person-form'
				scrollClassName	= 'pt10'
				data 		= { submit }
				width 		= { 150 }
				mb			= { 10 }
				readOnly
				disabled
				display
				noholder
			/>
		</Box>
	)
}