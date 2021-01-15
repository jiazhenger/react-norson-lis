import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
const confirm = import('@antd/confirm')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
const Tabs = $async(()=>import('#tp/tabs'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		taps:[],
		selectedKeys:[]
	}
	
	forms = [
		{ label:'关键字',	name:'title',	type:'input' },
		{ label: '消息重要级别',	name: '',		type: 'select',		data: [],	nameStr:'title'},
		{ label: '状态',	name: '',		type: 'select',		data: [],	nameStr:'title'},
		{ label: '消息类型',	name: '',		type: 'select',		data: [],	nameStr:'title'},
	]
	model = {}
	componentDidMount(){
		$fn.dataSave('device').then(local => {
			if($fn.hasArray(local)){
				this.forms[0].data = local
			}else{
				$http.pull(null,'device/select', {dataName:null}).then(data=>{
					data.forEach(v=> v.title = `${v.device_name}(${v.device_number}) - ${v.device_model}`)
					this.forms[0].data = data
					$fn.dataSave('device', data)
				})
			}
		})
		this.fetch()
	}
	tabs = [
		{ title:'结果录入', status:45001 },
		{ title:'已提交', status:45002 },
		{ title:'已审核', status:45003 }
	]
	// paging
	// fetch = param => $http.paging(this,'device/index',{ param:{...param, pageSize:this.pageSize, ...this.model}, loading:false } )
	fetch = param => $fn.fetch.call(this,'msg-system/index', param)
	cols = [
		{ type:'checkbox' },
		{ title: '重要级别', 		field: 'level', 	width:145, 	align:'tc' },
		{ title: '公告名称', 	field: 'uuid', 		width:150, 	align:'tc' },
		{ title: '发布者', 	field: 'id', 		width:130, 	align:'tc' },
		{ title: '日期', 	field: 'level', 			width:100, 	align:'tc' },
		
	]
	ButtonGroup = () => {
		return [
			
			
		]
	}
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page>
				{/* 搜索 */}
				<Tabs
					data={ this.tabs }
					onTabs = { (data, index) => {
						if(['1','2','3'].includes(index)){
							this.setState({ forms: this.form1})
						}else{
							this.setState({ forms: this.form0})
						}
					}}
				/>
				<SearchForm
					data		= { this.forms } 
					onChange={(v, press, { name, data }) => {
						$fn.onChange.call(this, v, press, () => {
							if (name && name === 'device_id') {
								return { device_name: data.device_name }
							}
						})
					} } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
					onAdd		= { ()=> $fn.push(this,'/laboratory/laboratory-manage/equipment-list/add') }
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
					// sort
					onSort			= { v => $fn.onSort.call(this, v) }
				/>
				{/*
					<Table
						className		= 'xplr'
						cols			= { this.cols }
						data 			= { data }
						loading 		= { pullLoading }
						selectedKeys	= {[  ]}
						disabledKeys	= {[ ]}
						pag				= { pag }
						onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
						sort
						onSort			= { v => $fn.onSort.call(this, v) }
					/>
				*/}
			</Page>
		)
	}
}