// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react' 
// ===================================================================== global declare
const { $fn, $async } = window 
// ===================================================================== antd
const Button = $async(()=>import('@antd/button')) 
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
	forms = [ 
		{ label:'条码号',		name:'spec_code',		type:'input' }
	]   
	uuid = $fn.query('uuid') || '' // 地址栏参数uuid
	model = {}
	componentDidMount(){    
		this.fetch(this.model) 
	}  
	fetch = param => $fn.fetch.call(this,'kd-report-spec/lookReport', {...param, hosp_id: this.uuid})
	cols = [     
		{ title: '条码号',				field: 'spec_code',			width:120 }, 
		{ title: '姓名',				field: 'name',				width:100 }, 
		{ title: '性别',				field: 'sex_name',			width:80 }, 
		{ title: '年龄',				field: 'age',				width:100 }, 
		{ title: '医院名称',			field: 'hosp_name',			width:120 }, 
		{ title: '报告发布时间',		field: 'report_at',			width:150 }, 
		{ title: '状态',				field: 'status_name',		width:90 }, 
		{ title: '操作', 				align:'tc', 				width:70, 			render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='预览' ghost onClick={() => {}}/> 
				</div>
			)
		}}
	]    
	ButtonGroup = () => {
		return [
			{ label:'返回', onClick:()=> $fn.back(this)}
		] 
	} 
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='查看报告' ButtonGroup={this.ButtonGroup()}>
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