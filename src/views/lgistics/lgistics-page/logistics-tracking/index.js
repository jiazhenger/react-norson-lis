// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react' 
// ===================================================================== global declare
import coms from '@/private/js/common.js'
const { $http, $fn, $async } = window  
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
		{ label:'标本箱号',		name:'box_number',				type:'input' },
		{ label:'运输方式',		name:'ship_type',				type:'select', data: [], nameStr:'name', idStr:'value'  }, 
		{ label:'日期',			name:'date',					type:'date-range', names:['startTime', 'endTime'] },
	]   
	model = {}
	componentDidMount(){    
		$fn.dataSave('dis-item-43600-data').then(local => {
			if($fn.hasArray(local)){
			  this.forms[1].data = local
			}else{
			  $http.submit(null,'dis-item/item', { param:{dis_code:43600}, loading:false}).then(data=>{
				this.forms[1].data = data 
				$fn.dataSave('dis-item-43600-data', data)
			  }) 
			}
		}) 
		this.fetch(this.model) 
	}  
	fetch = param => $fn.fetch.call(this,'gps-follow/index', param)
	cols = [   
		{ type: 'checkbox' },   
		{ title: '标本箱号',				field: 'box_number',			width:150 },  
		{ title: '当前位置',				field: 'current_address',		width:320 },  
		{ title: '录入时间',				field: 'gps_time',				width:230 },  
		{ title: '运输人',					field: 'receiver_name',			width:100 },  
		{ title: '运输方式',				field: 'ship_type_name',		width:100 },  
		{ title: '状态',					field: 'follow_status_name',	width:100 },   
		{ title: '操作', 					align:'tc', 					width:100, 			render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='查看轨迹' ghost onClick={() => {}}/> 
				</div>
			)
		}}
	]    
	ButtonGroup = () => {
		return [
			{ label:'手动录入',	ghost:true, onClick:()=> {}},
			{ label:'删除',		ghost:true, disabled: !$fn.hasArray(this.state.selectedKeys), 	onClick:()=> {
				const param = {uuid: this.state.selectedKeys.map(i => i.uuid)}
				coms.interfaceConfirm('gps-follow/delete', '删除', param, () => { this.fetch(this.model) })
			}},
		] 
	} 
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='物流跟踪' ButtonGroup={this.ButtonGroup()}>
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