// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== common
import coms from '@/private/js/common.js'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
const confirm = import('@antd/confirm')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table'))
const SpecimenQueryLog = $async(()=>import('@views/administrators/specimen-manage/specimens-query-slog')) 
const SpecimenQueryChild = $async(()=>import('@views/administrators/specimen-manage/tp/specimens-query-child')) 
// ===================================================================== 缓存
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		laboratoryOption: [],
		project_name: ''
	} 
	forms = [
		{ label:'标本条码',		name:'spec_code', 		type:'input' },
		{ label:'实验号',		name:'experiment_num',  type:'input' }, 
		{ label:'医院',			name:'hosp_id', 		type:'select', data:[], nameStr:'name', idStr:'value' },
		{ label:'病人姓名',		name:'patient_name', 	type:'input' }, 
		{ label:'项目名称',		name:'kind_name', 		type:'input' }, 
		{ label:'接收时间', 	name:'date1', 			type:'date-range',	names:['ck_start_date','ck_end_date'] },
		{ label:'检测时间', 	name:'date2', 			type:'date-range',	names:['ts_start_date','ts_end_date'] },
		{ label:'报告时间', 	name:'date3', 			type:'date-range',	names:['rp_start_date','rp_end_date'] },
		{ label:'岗位', 		name:'project_name_id', type:'select', data:[], nameStr:'name', idStr:'value' },
		{ label:'身份证', 		name:'card_no', 		type:'input' }
	]
	model = {}
	componentDidMount(){ 
		cacheApi.then(f => {
			$fn.getCache({
				cache: f.default.BsHospitalSelect, name: 'name', id: 'value', callback: (data) => {
					if ($fn.hasArray(data)) {
                        this.forms[2].data = data
                    } else {
                        $http.submit(null, 'bs-hospital/select').then(data => {
                            this.forms[2].data = data
                            $fn.setCache()
                        })
                    }
				}
			})
			$fn.getCache({
				cache: f.default.laboratoryselect, name: 'name', id: 'value', callback: (data) => {
					if ($fn.hasArray(data)) {
						this.setState({laboratoryOption: data})
                        this.forms[8].data = data
                    } else {
                        $http.submit(null, 'bs-hospital/select').then(data => {
						this.setState({laboratoryOption: data})
						this.forms[8].data = data
                            $fn.setCache()
                        })
                    }
				}
			})
		}) 
		this.fetch()
	}
	fetch = param => $fn.fetch.call(this,'specimen/views', {...param, project_name: this.state.project_name})
	cols = [ 
		{ title: '标本条码', 		field: 'spec_code', 		width:120 },
		{ title: '医院名称', 		field: 'hosp_name', 		width:240 },
		{ title: '自然项目', 		field: 'parent_kind_name', 	width:280 },
		{ title: '病人姓名', 		field: 'patient_name', 		width:100 },
		{ title: '受检人类型', 		field: 'case_type_name', 	width:100 },
		{ title: '年龄', 			field: 'age_first_val',		width:100, render: ({rows}) => {
			return `${rows.age_first_val}${rows.age_first_type_name}${rows.age_second_val}${rows.age_second_type_name}` 
		} },
		{ title: '性别', 			field: 'sex_name', 			width:70 },
		{ title: '项目名称', 		field: 'kind_name', 		width:280 },
		{ title: '结果', 			field: 'result', 			width:120 },
		{ title: '提示', 			field: 'tips', 				width:120 },
		{ title: '接收时间', 		field: 'receive_time', 		width:180 },
		{ title: '项目类型', 		field: 'kind_category_name', 	width:120 },
		{ title: '项目代码', 		field: 'kind_code', 		width:120 },
		{ title: '实验号', 			field: 'experiment_num', 	width:120 },
		{ title: '岗位', 			field: 'project_name', 		width:120 },
		{ title: '报告时间', 		field: 'rp_date', 			width:180 },
		{ title: '报告状态', 		field: 'rp_status_name', 	width:100 },
		{ title: '状态', 			field: 'status_name', 		width:80, render: ({rows}) => {
			return rows.status === "45006" ? "已迟发" : rows.status_name
		} },
		{ title: '送检医生', 		field: 'doctor', 			width:100 },
		{ title: '检测时间', 		field: 'ts_date', 			width:180 },
		{ title: '身份证', 			field: 'card_no', 			width:180 },
		{ title: '科室', 			field: 'department_name', 	width:120 },
		{ title: '床号', 			field: 'bed_no', 			width:100 } 
	]
	ButtonGroup = () => {
		return [
			{ label:'导出 F2', code:'F2', onClick: () => this.Derivedform() }
		]
	}
	Derivedform = () => {   
		const param =  {...this.model, project_name: this.state.project_name} 
		confirm.then(f=>{
			f.default({
				msg:'是否确认导出？',
				onOk: close => {    
					window.$http.pull(this,'specimen/viewsexport',{dataName:null, param: param }).then(data=>{ 
						if (data) {
							window.location.href = data.url;
						} else {
							message.then(f=>f.default.error('操作失败'))
						} 
						close()
					})
				}
			})
		})
	}
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='客服查询' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=> {
						if (v.project_name_id) {
							const project_name = window.$fn.filterSelect(this.state.laboratoryOption, v.project_name_id, 'name', 'value') 
							this.setState({project_name: project_name}, () => {
								$fn.onChange.call(this,v,press)
							})
						} else {
							$fn.onChange.call(this,v,press)
						} 
					} } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
				/>
				{/* 表格 */}
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { v => {
						this.setState({ selectedKeys: v })
						this.QueryLogRef.fetch(v)
						this.QueryChild.changeInfo(v)
					}}
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
				/> 
				<div className='fx ml10 mr10 mb10' style={{height: '350px'}}>
					<div className='bor1 ex r4px rel' style={{minWidth: '660px', width: 0}}>
						<SpecimenQueryChild onRef={ref => this.QueryChild = ref} />
					</div>
					<div className='bor1 ex r4px ml10 fx'>
						<SpecimenQueryLog onRef={ref => this.QueryLogRef = ref} />
					</div>
				</div>
			</Page>
		)
	}
}