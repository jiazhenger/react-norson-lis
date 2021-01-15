// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== common
import coms from '@/private/js/common.js' 
// ===================================================================== global declare
const { $http, $fn, $async } = window 
// ===================================================================== antd
const Button = $async(()=>import('@antd/button')) 
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form')) 
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== 缓存
const cacheApi = import('@/private/api/cacheApi') 
// ===================================================================== component
export default class extends React.Component{ 
	isEdit = false
	state = {
		data:[],
		pag: {},
		selectedKeys:[], 
		hospSelect: []
	}     
	typeOptions = [
        { label: "正常", value: "91,92,94,95,96,99" },
        { label: "终止", value: "93" },
        { label: "迟发", value: "97" },
        { label: "退单", value: "98" }
    ]
	forms = [ 
		{ label:'姓名',					name:'patient_name',			type:'input' }, 
		{ label:'关联条码号',			name:'spec_code',				type:'input' }, 
		{ label:'医院',					name:'hosp_id',					type:'select', data: [], nameStr:'name', idStr:'value' },
		{ label:'种类',					name:'status',					type:'select', data: this.typeOptions, nameStr:'label', idStr:'value' },
		{ label:'日期',					name:'date',					type:'date-range', names:['start_date', 'end_date'] },
	]  
	model = {}
	componentDidMount(){    
		cacheApi.then(f => {
			$fn.getCache({
				cache: f.default.BsHospitalSelect, name: 'name', id: 'value', callback: (data) => {
					this.setState({data: data})
					if ($fn.hasArray(data)) {
						this.forms[2].data = data
						this.setState({hospSelect: data})
                    } else {
                        $http.submit(null, 'bs-hospital/select').then(data => {
                            this.forms[2].data = data
							this.setState({hospSelect: data})
							$fn.setCache()
                        })
                    }
				}
			})
		})  
		this.fetch(this.model) 
	} 
	// paging 
	fetch = param => $fn.fetch.call(this,'kd-report-spec/myreportspec', param)
	cols = [   
		{ type:	'checkbox' },
		{ title: '条码号',				field: 'spec_code',					width:120, 			sort: true },
		{ title: '送检单位',			field: 'hosp_name',					width:220, 			sort: true },
		{ title: '送检科室',			field: 'department_name',			width:100, 			sort: true },
		{ title: '送检时间',			field: 'check_time',				width:150, 			sort: true },
		{ title: '病人姓名',			field: 'patient_name',				width:120 },
		{ title: '性别',				field: 'sex_name',					width:80 },
		{ title: '年龄',				field: 'newAge',					width:100 },
		{ title: '报告发布时间',		field: 'created_at',				width:150, 			sort: true },
		{ title: '状态',				field: 'status_name',				width:70, 			sort: true },
		{ title: '操作', 				align:'tc', 						width:80, 			render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='预览' ghost onClick={() => {}}/> 
				</div>
			)
		}}
	]   
	ButtonGroup = () => {
		return [  
			{ label:'批量接收', ghost:true, disabled:this.state.selectedKeys.length<=0, onClick:()=>{
				const param = {uuid: this.state.selectedKeys.map(i => i.uuid)}
				coms.interfaceConfirm('kd-report-spec/uprec', '批量接收', param, () => { this.fetch() })
			} },
			{ label:'批量打印', ghost:true, disabled:this.state.selectedKeys.length<=0, onClick:()=>{} },
		] 
	}  
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='报告单派送' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v, press)=> $fn.onChange.call(this,v,press)} 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
					init    	= { form => this.form = form }
				/>
				{/* 表格 */}
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { (select) => this.setState({ selectedKeys: select}) }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
					onSort			= { v => $fn.onSort.call(this, v) }
				/> 
			</Page>
		)
	}
}