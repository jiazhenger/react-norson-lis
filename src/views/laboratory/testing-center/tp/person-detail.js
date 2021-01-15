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
	{ label:'标本条码', 	name:'spec_code' },
	{ label:'实验号', 		name:'experiment_num'},
	{ label:'姓名', 		name:'patient_name'},
	{ label:'年龄', 		name:'newAges'},
	{ label:'性别', 		name:'sex_name'},
	{ label:'送检科室', 	name:'department_name'},
	{ label:'床号', 		name:'bed_no'},
	{ label:'送检医生', 	name:'doctor'},
	{ label:'受检人电话', 	name:'patient_phone'},
	{ label:'采集日期', 	name:'coll_time'},
	{ label:'送检单位', 	name:'hosp_name'},
	{ label:'单位标识', 	name:'hosp_identification'},
	{ label:'标本性状', 	name:'spec_traits_name'},
	{ label:'备注', 		name:'remark', type:'textarea', rows:2},
]
// ===================================================================== component
export default ({infos}) => {   
	const [ data, setData ] = React.useState(submit)  
	const [ keys, setKeys ] = React.useState(0)  
	React.useEffect(()=>{ 
		if ($fn.hasObject(infos)) {
			data[0].value = infos.case_info.spec_code || ''
			data[1].value = infos.case_info.experiment_num || ''
			data[2].value = infos.case_info.patient_name || ''
			data[3].value = infos.case_info.newAges || ''
			data[4].value = infos.case_info.sex_name || ''
			data[5].value = infos.case_info.department_name || ''
			data[6].value = infos.case_info.bed_no || ''
			data[7].value = infos.case_info.doctor || ''
			data[8].value = infos.case_info.patient_phone || ''
			data[9].value = infos.case_info.coll_time || ''
			data[10].value = infos.case_info.hosp_name || ''
			data[11].value = infos.case_info.hosp_identification || ''
			data[12].value = infos.case_info.spec_traits_name || ''
			data[13].value = infos.case_info.remark || '' 
			setData(data) 
			setKeys(keys + 1)
		}
	},[ infos ]) 
	return (
		<Box className='mlr10 fv' title='人员详情' style={{width:250}}>
			<SubmitForm
				key         = {keys}
				className 	= 'person-form'
				scrollClassName	= 'pt10'
				data 		= { data }
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