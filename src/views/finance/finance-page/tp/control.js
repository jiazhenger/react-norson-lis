import React from 'react'
// ===================================================================== antd
// ===================================================================== utils
import Time from '@utils/time'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== global template
const message = import('@antd/message')
const confirm = import('@antd/confirm')
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
const DisplayForm = $async(()=>import('./display-form'))
// ===================================================================== template
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== btns
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		btns:[],
		dataList:[]
	}
	billStatusOption = [
        { label: "财务待审核", 	value: "45301" },
        { label: "财务待结算", 	value: "45302" },
        { label: "财务已结算", 	value: "45303" },
        { label: "已作废", 	   	value: "45304" },
        { label: "业务员待审核",value: "45305" }
	]
	
	model = {
		start_at: Time.customDate(2, "date"),
		end_at: Time.customDate("current-date"),
	}
	forms = [
		{ label:'接收标本时间', name:'date',				type:'date-range', names:['start_at','end_at'], },
		{ label:'客户名称', 	name:'hosp_id', 			type:'select', data:[] },
		{ label:'实验科室', 	name:'project_parent_id', 	type:'select', data:[] },
		{ label:'区域', 		name:'region_id', 			type:'select', data:[] },
		{ label:'业务员', 		name:'salesman_id', 		type:'select', data:[] },
		{ label:'状态', 		name:'status', 				type:'select', data:this.billStatusOption, nameStr:'label', idStr:'value' }
	]

	fetch = param => $http.paging(this,'bill-st/constsummary',{ param:{...param, pageSize:this.pageSize, ...this.model}, loading:false } )

	cols = [
		{ title: '序号',			field: 'sort', 				width:80 },
		{ title: '岗位',			field: 'project_name', 		width:130 },
		{ title: '客户名称',		field: 'hosp_name', 		width:160 },
		{ title: '自然项目',		field: 'parent_kind_name', 	width:160 },
		{ title: '数量',			field: 'sum_spec_in', 		width:80 },
		{ title: '冲抵数量', 		field: 'sum_spec_out', 		width:80 },
		{ title: '实际数量', 		field: 'sum_spec', 			width:80 },
		{ title: '标准价格', 		field: 'sum_sprice', 		width:100 },
		{ title: '实际价格', 		field: 'sum_price', 		width:100 },
		{ title: '实验科室', 		field: 'project_parent_name',width:100 },
		{ title: '开票单位(NC)', 	field: 'organization_name', width:100 },
		{ title: '开票单位编码(NC)',field: 'organization_code', width:130 },
		{ title: '业务员', 			field: 'salesman_user', 	width:100 },
		{ title: '业务原编码',		field: 'salesman_code', 	width:100 },
		{ title: '区域', 			field: 'region_name', 		width:100 },
		{ title: '区域编码',		field: 'region_num',		width:100 },
	]
	componentDidMount(){
		cacheApi.then(f => {
            const d = f.default
			$fn.getCache({ // 客户名称
				cache: d.BsHospitalSelect, callback: (data) => {
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
			$fn.getCache({ // 实验科室
				cache: d.ProjectTeamMenuSelect, callback: (data) => {
					if ($fn.hasArray(data)) {
						this.forms[2].data = data
					} else {
						$http.submit(null, 'project-team/selectMenu').then(data => {
							this.forms[2].data = data
							$fn.setCache()
						})
					}
				}
			})
			$fn.getCache({ // 区域
				cache: d.bsareaSelect, callback: (data) => {
					if ($fn.hasArray(data)) {
						this.forms[3].data = data
					} else {
						$http.submit(null, 'bs-area/select').then(data => {
							this.forms[3].data = data
							$fn.setCache()
						})
					}
				}
			})
			$fn.getCache({ // 业务员
				cache: d.bssalesmanSelect, callback: (data) => {
					if ($fn.hasArray(data)) {
						this.forms[4].data = data
					} else {
						$http.submit(null, 'bs-salesman/select').then(data => {
							this.forms[4].data = data
							$fn.setCache()
						})
					}
				}
			})
		})
		this.fetch(this.model)
	}
	ButtonGroup = () => {
		return [
			{ label:'导出F1', code:'F1', onClick:()=>{
							console.log(this)
				confirm.then(f=>{
					f.default({
						msg:'是否导出账单?',
						onOk: close => {
							let list = {
								export: 1,
								start_at: this.model.start_at,
								end_at: this.model.end_at
							}
							$http.submit(null,'bill-st/constsummary', { param: list } ).then(data=>{
								message.then(f=>f.default.success('导出成功'))
								console.log(data)
								window.location.href = data.url;
								this.fetch(this.model)
								close()
							})
						}
					}) 
				})
			} },
		]
	}
	render(){
		const { data, dataList,  pullLoading, pag, selectedKeys } = this.state
		return (
			<Page title='成本汇总' ButtonGroup={this.ButtonGroup()}>
				
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= {(v,press)=>$fn.onChange.call(this,v,press)} 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
					init    	= { form => { form.setFieldsValue({date:[Time.customDate(2, "date"), Time.customDate("current-date")]}) }}
				/>
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { current => {
						this.setState({dataList:current})
					} }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
				/>
				<DisplayForm rowdata={ dataList || [] } model={this.model} />
			</Page>
		)
	}
}