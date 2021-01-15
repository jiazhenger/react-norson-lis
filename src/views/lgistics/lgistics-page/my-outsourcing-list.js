// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react' 
// ===================================================================== global declare
import coms from '@/private/js/common.js'
const { $http, $fn, $async } = window 
// ===================================================================== antd
const message = import('@antd/message')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form')) 
const Table = $async(()=>import('#cpt/table')) 
// ===================================================================== component
export default class extends React.Component{ 
	isEdit = false
	state = {
		data:[],
		pag: {},
		selectedKeys:[],  
	}     
	outsourStatusOption = [
		{ label: '全部', value: '' },
		{ label: '待派送', value: 1 }, 
		{ label: '已送达', value: 3 }
	] 
	outsourStatusOption1 = [
		{ label: '全部', value: '' },
		{ label: '待派送', value: 1 }, 
		{ label: '派送中', value: 2 }, 
		{ label: '已送达', value: 3 } 
	] 
	forms = [ 
		{ label:'派送状态',		name:'outsourcing_status',		type:'select', data: this.outsourStatusOption, nameStr:'label', idStr:'value'  }, 
		{ label:'外送时间',		name:'date',					type:'date-range', names:['start_date', 'end_date'] },
		{ label:'条码号',		name:'spec_code',				type:'input' }
	]   
	model = {}
	componentDidMount(){    
		this.fetch(this.model) 
	}  
	fetch = param => $fn.fetch.call(this,'specimen/myOutsourcingList', param)
	cols = [   
		{ type: 'checkbox' },  
		{ title: '外送单位',				field: 'outsourcing_company',			width:150 },  
		{ title: '派送状态',				field: 'outsourcing_status',			width:90, render: ({rows}) => {
			return $fn.filterSelect(this.outsourStatusOption1, rows.outsourcing_status, 'label', 'value')
		} },  
		{ title: '接收时间',				field: 'created_at',					width:150 },  
		{ title: '条码',					field: 'spec_code',						width:120 },  
		{ title: '姓名',					field: 'patient_name',					width:100 },  
		{ title: '性别',					field: 'sex_name',						width:60 },  
		{ title: '年龄',					field: 'age_first_val',					width:80 },  
		{ title: '自然项目',				field: 'parent_kind_name',				width:300 },  
	]    
	ButtonGroup = () => {
		return [
			{ label:'已送达',	ghost:true, 	disabled: !$fn.hasArray(this.state.selectedKeys), 	onClick:()=> { 
				const arr = this.state.selectedKeys.map(i => i.spec_code) 
				let param = {
					outsourcing_status: 3,
					spec_code: arr 
				} 
				$http.submit(null, 'specimen/changeOutsourcingStatus', {param: param}).then(data => {
					message.then(f => f.default.success('操作成功'))  
					this.fetch(this.model) 
				}) 
			}},
			{ label:'导出',		ghost:true, 	disabled: !$fn.hasArray(this.state.data), 			onClick:()=> {
				coms.exportExcel({
					api: 'specimen/myOutsourcingList',
					param: {param: {...this.model, export: '1'}}
				})
			}}
		] 
	} 
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='我的外包清单' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v, press)=> $fn.onChange.call(this, v, press)} 
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