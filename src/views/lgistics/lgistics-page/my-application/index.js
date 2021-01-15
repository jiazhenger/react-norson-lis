// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== common
import coms from '@/private/js/common.js'
// ===================================================================== antd
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window 
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
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
		hospSelect: [],
		hosp_name: ''
	}    
	statusSelect = [
		{ label: "审核未通过", value: -1 },
		{ label: "待完善", value: 0 },
		{ label: "待审核", value: 1 },
		{ label: "审核通过", value: 2 }
	]
	forms = [ 
		{ label:'状态',				name:'status',			type:'select', data: this.statusSelect, nameStr:'label', idStr:'value' },
		{ label:'医院',				name:'hospital_id',		type:'select', data: [], nameStr:'name', idStr:'value' },
		{ label:'条码号',			name:'spec_code',		type:'input' }, 
		{ label:'病人姓名',			name:'patient_name',	type:'input' }, 
		{ label:'日期',				name:'date',			type:'date-range', names:['start_date', 'end_date'] },
	]  
	model = {}
	componentDidMount(){   
		const { hospSelect } = this.state 
		cacheApi.then(f => {
			$fn.getCache({
				cache: f.default.BsHospitalSelect, name: 'name', id: 'value', callback: (data) => {
					this.setState({data: data})
					if ($fn.hasArray(data)) {
						this.forms[1].data = data
						this.setState({hospSelect: data})
                    } else {
                        $http.submit(null, 'bs-hospital/select').then(data => {
                            this.forms[1].data = data
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
	fetch = param => $fn.fetch.call(this,'spec-case-info/logisticslists', {...param, hosp_name: this.state.hosp_name} )
	cols = [  
		{ title: '标本条码',		field: 'spec_code',					width:100 },
		{ title: '医院名称',		field: 'hosp_name',					width:120 },
		{ title: '送检科室',		field: 'department_name',			width:100 },
		{ title: '送检医生',		field: 'doctor',					width:100 },
		{ title: '病人姓名',		field: 'patient_name',				width:100 },
		{ title: '性别',			field: 'sex',						width:100, render: ({rows}) => {
			let options = [
				{ label: "男", value: 45701 },
				{ label: "女", value: 45702 }
			]
			return window.$fn.filterSelect(options, rows.sex, 'label', 'value') 
		} },
		{ title: '年龄',			field: 'age_first_val',				width:120, render: ({rows}) => {
			const v1 = rows.age_first_val ? `${rows.age_first_val}${rows.age_first_type_name}` : ''
			const v2 = rows.age_second_val ? `${rows.age_second_val}${rows.age_second_type_name}` : ''
			return v1 + v2
		} },
		{ title: '送检时间',		field: 'check_time',				width:140 },
		{ title: '状态',			field: 'status',					width:100, render: ({rows}) => { 
			return window.$fn.filterSelect(this.statusSelect, rows.status, 'label', 'value') 
		}},
		{ title: '操作', 			align:'tc', 						width:100, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='详细信息' ghost onClick={() => { 
						$fn.push(this, $fn.getRoot().root + `lgistics-page/my-application/detail?spec_code=${rows.spec_code}&uuid=${rows.uuid}`) 
					}}/>
				</div>
			)
		}}
	]    
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='基础信息'>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v, press, { name })=> {
						// $fn.onChange.call(this,v,press)
						console.log(name)
						$fn.onChange.call(this, v, press, () => { 
							if (name && name === 'hospital_id') { 
								let hosp_name = this.state.hospSelect.filter(i => i.value === v.hospital_id)
								this.setState({hosp_name: $fn.hasArray(hosp_name) ? hosp_name[0].name : ''}) 
							}
						},true)
					} } 
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