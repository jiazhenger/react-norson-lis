import React from 'react'
import coms from '@/private/js/common.js'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== 页面常量
const statusData = [
	{ name: "已审核", value: "45003" },
	{ name: "已批准", value: "45004" }
]
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
	}
	forms = [
		{ label:'条码号',		name:'spec_code'},
		{ label:'科室',			name:'department_name'},
		{ label:'状态',			name:'status',				type:'select',		data:[]},
		{ label:'岗位',			name:'project_id',			type:'select',		data:[],    idStr: 'uuid'},
		{ label:'项目',			name:'kind_id',				type:'select',		data:[]},
		{ label:'检测时间',		name:'date',				type:'date-range',	names:['start_at','end_at'],			value:[] },
		{ label:'接收时间',		name:'date1',				type:'date-range',	names:['ck_start_date','ck_end_date'],	value:[] },
	]
	model = {start_at: coms.sysTime(1, '9'), end_at: coms.sysTime(2, '9')}
	componentDidMount(){
		this.forms[2].data = statusData
		cacheApi.then(f => {
            const d = f.default
            // 项目
			$fn.getCache({
				cache: d.labkindselect, callback: (data) => {
                    if ($fn.hasArray(data)) {
						this.forms[4].data = data
                    } else {
                        $http.submit(null, 'specimen/labkindselect').then(data => {
							this.forms[4].data = data
                            $fn.setCache()
                        })
                    }
				}
            })
            // 岗位
            $fn.getCache({
                cache: d.jobAllselect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        this.forms[3].data = data
                    } else {
                        $http.submit(null, 'project-team/jobAllselect').then(data => {
                            this.forms[3].data = data
                            $fn.setCache()
                        })
                    }
                }
            })
		})
		this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'specimen/laboratorylists', param)
	// table
	cols = [
		{ title: '条码号',		field: 'spec_code',			width: 130 },
		{ title: '实验号',		field: 'experiment_num',	width: 70 },
		{ title: '送检单位', 	field: 'hosp_name',			width: 200 },
		{ title: '接收时间', 	field: 'receive_at',		width: 160,		align: 'tc' },
		{ title: '检测时间', 	field: 'created_at',		width: 160,		align: 'tc' },
		{ title: '姓名',		field: 'patient_name',		width: 100 },
		{ title: '性别',		field: 'sex_name',			width: 50 },
		{ title: '年龄',		field: 'age',				width: 70 },
		{ title: '身份证',		field: 'card_no',			width: 150 },
		{ title: '电话',		field: 'patient_phone',		width: 100 },
		{ title: '医生电话', 	field: 'doctor_phone',		width: 100 },
		{ title: '科室',		field: 'department_name',	width: 100 },
		{ title: '患者类型', 	field: 'case_type_name',	width: 100 },
		{ title: '床号',		field: 'bed_no',			width: 100 },
		{ title: '住院号',		field: 'outpatient',		width: 100 },
		{ title: '临床诊断', 	field: 'diagnosis_info',	width: 130 },
		{ title: '自然项目', 	field: 'parent_kind_name',	width: 220 },
		{ title: '检验项目', 	field: 'kind_name',			width: 220 },
		{ title: '批准时间', 	field: 'ts_approve_at',		width: 160,		align: 'tc' },
		{ title: '结果',		field: 'result_str',		width: 100 },
		{ title: '状态',		field: 'status_name',		width: 70 },
	]
	ButtonGroup = () => {
		return [
			{ label:'导出', onClick:()=>{

			} },
		]
	}
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='项目结果清单' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onAdd		= { this.onAdd } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
					init		= { form => form.setFieldsValue({date: [this.model.start_at, this.model.end_at]}) }
				/>
				{/* 表格 */}
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { v => this.setState({ selectedKeys: v }) }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
				/>
			</Page>
		)
	}
}