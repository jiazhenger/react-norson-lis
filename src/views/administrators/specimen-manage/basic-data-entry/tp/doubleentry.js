import React from 'react' 
// ===================================================================== global declare
const { $http, $fn, $async } = window 
const Button = $async(()=>import('@antd/button'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table'))
const PatientDetails = $async(()=>import('./patient-details')) 
// // ===================================================================== 缓存 
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {}, 
		selectedRow: {}, 
		sexSelect: [], 
	}   
	statusSelect = [
		{ value: "99", label: "全部" },
		{ label: "审核未通过", value: -1 },
		{ label: "待完善", value: 0 },
		{ label: "待审核", value: 1 },
		{ label: "审核通过", value: 2 }
	] 
	model = {} 
	forms = [
		{ label:'状态',			name:'status',			type:'select', data:this.statusSelect, nameStr:'label', idStr:'value' },
		{ label:'医院',			name:'hospital_id',		type:'select', data:[], nameStr:'name', idStr:'value' },
		{ label:'条码号',		name:'spec_code',		type:'input' },
		{ label:'病人姓名',		name:'patient_name',	type:'input' },
		{ label:'日期',			name:'date', 			type:'date-range', names:['start_date','end_date'] }, 
	]
	componentDidMount(){
		cacheApi.then(f => {
			$fn.getCache({
				cache: f.default.BsHospitalSelect, name: 'name', id: 'value', callback: (data) => {
					if ($fn.hasArray(data)) {
                        this.forms[1].data = data
                    } else {
                        $http.submit(null, 'bs-hospital/select').then(data => {
                            this.forms[1].data = data
                            $fn.setCache()
                        })
                    }
				}
			})
		}) 
		$fn.dataSave('dis-item-45700-data').then(local => {
			if($fn.hasArray(local)){  
			this.setState({sexSelect: local})
			}else{
			  $http.submit(null,'dis-item/item', { param:{dis_code:45700}, loading:false}).then(data=>{
				this.setState({sexSelect: data})
				$fn.dataSave('dis-item-45700-data', data)
			  }) 
			}
		}) 
		this.fetch()
	}
	fetch = param => $fn.fetch.call(this,'spec-case-info/index', param)
	cols = [ 
		{ title: '申请单条码', 		field: 'spec_code', 		width: 130,		sort: true },
		{ title: '受检人姓名', 		field: 'patient_name', 		width: 110 },
		{ title: '性别', 			field: 'sex', 				width: 50, render: ({rows})  => {
			return window.$fn.filterSelect(this.state.sexSelect, rows.sex, 'name', 'value') 
		} }, 
		{ title: '年龄', 			field: 'age', 				width: 75 },
		{ title: '受检人电话', 		field: 'patient_phone',		width: 100 },
		{ title: '身份证号', 		field: 'card_no', 			width: 150 },
		{ title: '送检单位', 		field: 'hosp_name', 		width: 220 },
		{ title: '送检科室', 		field: 'department_name', 	width: 100 }, 
		{ title: '送检医生', 		field: 'doctor', 			width: 100 }, 
		{ title: '医生电话', 		field: 'doctor_phone', 		width: 100 }, 
		{ title: '采集时间', 		field: 'coll_time', 		width: 160 }, 
	  	{ title: '审核状态', 		field: 'status', 			width: 80, render: ({rows})  => {
			return window.$fn.filterSelect(this.statusSelect, rows.status, 'label', 'value') 
		}}
	] 

	ButtonGroup = () => {
		return [   
			{ label:'返回', ghost:true, onClick:()=> $fn.back(this) } 
		]
	} 
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='双录入' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms }   
					onChange	= { (v,press)=> $fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
				/>
				{/* 表格 */}
				<div className='fx xplr ex'>
					<Table 
						cols			= { this.cols }
						data 			= { data }
						loading 		= { pullLoading } 
						onRow			= { (rows, index) => { 
							this.setState({ selectedRow: rows })   
							$http.submit(null,'spec-case-info/infoDoubleEntry', { param:{spec_code: rows.spec_code}, loadingText: '数据读取中...'}).then(data=>{
								if ($fn.hasArray(data)) { 
									this.PatientDetailsRef1.doubleEntryInfo(data[0]) 
									this.PatientDetailsRef2.doubleEntryInfo(data.length > 1 ? data[1] : {}) 
								} else {
									this.PatientDetailsRef1.doubleEntryInfo({}) 
									this.PatientDetailsRef2.doubleEntryInfo({}) 
								}
							}).catch(data => {
								this.PatientDetailsRef1.doubleEntryInfo({}) 
								this.PatientDetailsRef2.doubleEntryInfo({}) 
							})  
						}}
						pag				= { pag }
						onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) } 
						onSort			= { v => $fn.onSort.call(this, v) }
					/>
					<div className='fv r4px' style={{width: '450px', border: '1px solid #F2F2F2', marginLeft: '10px'}}>
						<div className='b p10'>第一次录入</div>
						<div className='ex oxys p10' style={{paddingTop: 0 }}>
							<div className='fxm mb10'>
								<Button label='以此为准' className='mr10' ghost onClick={() => this.PatientDetailsRef1.takeStandard(1)} /> 
								<Button label='查看图片' className='mr10' ghost onClick={() => {}} /> 
							</div> 
							<PatientDetails onRef={ref => this.PatientDetailsRef1 = ref} />
						</div>
					</div>
					<div className='fv r4px' style={{width: '450px', border: '1px solid #F2F2F2', marginLeft: '10px'}}>
						<div className='b p10'>第二次录入</div>
						<div className='ex oxys p10' style={{paddingTop: 0 }}>
							<div className='fxm mb10'>
								<Button label='以此为准' className='mr10' ghost onClick={() => this.PatientDetailsRef2.takeStandard(2)} /> 
								<Button label='查看图片' className='mr10' ghost onClick={() => {}} /> 
							</div>
							<PatientDetails onRef={ref => this.PatientDetailsRef2 = ref} />
						</div>
					</div>
				</div>
			</Page>
		)
	}
}