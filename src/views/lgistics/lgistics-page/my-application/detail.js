// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== common
import Input from '@antd/form/input'
// ===================================================================== common
import coms from '@/private/js/common.js' 
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
		infoData: {}, 
		tableData: []
	}     
	model = {}
	uuid = $fn.query('uuid') || '' // 地址栏参数uuid
	spec_code = $fn.query('spec_code') || '' // 地址栏参数spec_code
	cols = [
		{ title: '项目代码', 	field: 'kind_code', 		width: 120 }, 
		{ title: '项目名称', 	field: 'kind_name', 		width: 120 }, 
		{ title: '项目属性', 	field: 'kind_type_name', 	width: 120 }, 
	]
	componentDidMount(){      
		if (this.uuid) {
			this.getInfo(this.uuid) 
		}
		if (this.spec_code) {
			this.getTable(this.spec_code) 
		} 
	} 
	getInfo = (uuid) => {
		$http.submit(this,'spec-case-info/info', { param: {uuid: uuid}}).then(data=>{
			this.setState({infoData: data}) 
		})
	}
	getTable = (spec_code) => {
		$http.submit(this,'specimen-kind/index', { param: {spec_code: spec_code}}).then(data=>{
			this.setState({tableData: data}) 
		}) 
	}
	render(){
		const { tableData, infoData } = this.state
		return (
			<Page className='p10'>
                <div className='pb10'>
				    <Button label='返回' ghost onClick={()=> $fn.back(this) }/> 
                </div>
				<div className='fx'>
					<div className='ex'>
						<div className='b ptb5' style={{borderBottom: '1px solid #f2f2f2'}}>病患基本信息</div>
						<div className='fxw fx-ex3 ptb15'>  
							<div>
								<span>条码号</span>
								<span>{infoData.spec_code}</span>
							</div>
							<div>
								<span>姓名</span>
								<span>{infoData.patient_name}</span>
							</div>
							<div>
								<span>籍贯</span>
								<span></span>
							</div>
							<div>
								<span>身份证号</span>
								<span>{infoData.card_no}</span>
							</div>
							<div>
								<span>性别</span>
								<span>{infoData.sex_name}</span>
							</div>
							<div>
								<span>病人电话</span>
								<span>{infoData.patient_phone}</span>
							</div>
							<div>
								<span>年龄</span>
								<span>{infoData.age_first_val}</span>
							</div>
							<div>
								<span>民族</span>
								<span></span>
							</div>
							<div>
								<span>出生日期</span>
								<span></span>
							</div>
							<div>
								<span>婚姻</span>
								<span></span>
							</div>
						</div>
					</div>
					<div className='ex ml20'>
						<div className='b ptb5' style={{borderBottom: '1px solid #f2f2f2'}}>送检医院信息</div>
						<div className='fxw fx-ex3 ptb15'>
							<div>
								<span>送检医院</span>
								<span>{infoData.hosp_name}</span>
							</div>
							<div>
								<span>患者类型</span>
								<span>{infoData.case_type_name}</span>
							</div>
							<div>
								<span>送检医生</span>
								<span>{infoData.doctor}</span>
							</div>
							<div>
								<span>医生电话</span>
								<span>{infoData.doctor_phone}</span>
							</div>
							<div>
								<span>住院/门诊号</span>
								<span>{infoData.outpatient}</span>
							</div>
							<div>
								<span>送检科室</span>
								<span>{infoData.department_name}</span>
							</div>
							<div>
								<span>床号</span>
								<span>{infoData.bed_no}</span>
							</div>
						</div>
					</div>
				</div>
				<div className='b ptb5' style={{borderBottom: '1px solid #f2f2f2'}}>送检标本信息</div>
				<div className='fxw fx-ex3 ptb15'>
					<div>
						<span>标本类型</span>
						<span></span>
					</div>
					<div>
						<span>标本性状</span>
						<span></span>
					</div>
					<div>
						<span>采集时间</span>
						<span>{infoData.coll_time}</span>
					</div>
				</div>
				<div className='fxw fx-ex3 ptb15'> 
					<div className='ex'>
						<p className='b'>临床诊断</p>
						<Input name='diagnosis_info' value={infoData.diagnosis_info} mode='textarea' disabled />
					</div>
					<div className='ex ml20'>
						<p className='b'>备注</p>
						<Input name='remark' value={infoData.remark} mode='textarea' disabled />
					</div>
				</div>
				{/* 表格 */}
				<div className='b ptb5'>送检项目信息</div>
				<Table   
					cols			= { this.cols }
					data 			= { tableData }  
				/>
            </Page>
		)
	}
}