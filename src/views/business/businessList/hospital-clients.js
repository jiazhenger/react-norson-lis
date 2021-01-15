import React from 'react'
import { Upload } from 'antd'
// ===================================================================== global declare
const { $http, $fn, $async } = window
const confirm = import('@antd/confirm')
// ===================================================================== antd
const message = import('@antd/message')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table'))
const Button = $async(()=>import('@antd/button'))
// ===================================================================== component

export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		data1: {},
	}
	options = [
		{ label: "未审核",		value: "0" },
		{ label: "审核通过",	value: "1" },
		{ label: "审核未通过", 	value: "-1" }
	]
	forms = [
		{ label:'医院名称',		name:'hosp_name',	 },
        { label:'医院性质',		name:'nature',		type:'select', 	data:[] },
        { label:'医院代码',		name:'hosp_code',	 },
		{ label:'医院级别',		name:'level',		type:'select', 	data: [] },
		{ label:'状态',			name:'enabled',		type:'select', 	data: this.options, nameStr:'label', idStr:'value' },
	]
	model = {
		hosp_name: '',
		nature: '',
		hosp_code: '',
		level: '',
		enabled: '',
	}
	async getDataAsync() {
		$fn.getDisItem({ // 医院性质
			code: 44100,
			callback: (data) => {
				this.forms[1].data = data
				console.log(data);
			}
		})
		$fn.getDisItem({ // 医院级别
			code: 39000,
			callback: (data) => {
				this.forms[3].data = data
				console.log(data);
			}
		})
	}
	componentDidMount(){
		this.getDataAsync()
		this.fetch(this.model)
	}
	fetch = param => $fn.fetch.call(this,'bs-hospital/index', { param })
	cols = [
		{ type:'checkbox' },
		{ title: '医院代码', 	field: 'hosp_code', 	width:120 },
        { title: '医院条码', 	field: 'hosp_spec', 	width:120 },
		{ title: '医院名称', 	field: 'hosp_name', 	width:120 },
		{ title: '医院性质', 	field: 'nature_name', 	width:120 },
		{ title: '医院级别', 	field: 'level_name', 	width:120 },
		{ title: '创建时间', 	field: 'create_at', 	width:120 },
        { title: '状态', 		field: 'enabled', 		width:120, render: ({rows}) => {
			return window.$fn.filterSelect(this.options, rows.enabled, 'label', 'value')
		} },
		{ title: '操作', 		width:160,  	render:({rows})=>{
			return (
				<div className='plr5'>
					<Button className='mr10' label='编辑' ghost onClick={()=>{
						$fn.push(this, $fn.getRoot().root + 'businessList/LowerLevel-hospital-clients/add?id='+rows.uuid+'&isEdit=1')
					}}/>
					<Button label='物价管理' ghost onClick={()=>{
						console.log(rows);
						$fn.push(this, $fn.getRoot().root + 'businessList/hospital-clients/clients?id='+rows.uuid)
					}}/>
				</div>
			)
		} },
	]
	ButtonGroup = () => {
		return [
			{ label:'新增 F1',code:'F1', onClick:()=>{
				$fn.push(this, $fn.getRoot().root + 'businessList/LowerLevel-hospital-clients/add?isEdit=1')
			} },
			{ label:'审核', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				const { selectedKeys } = this.state
				const param = {
					uuid: selectedKeys.map(v=>v.uuid)
				}
				$http.submit(null, 'bs-hospital/exam', { param } ).then(data => {
					message.then(f=>f.default.success('审核成功'))
				})
			} },
			{ label:'打印', ghost:true, onClick:()=>{
			// 	confirm.then(f=>{
			// 		f.default({
			// 			msg:'是否审核账单?',
			// 			onOk: close => {
			// 				const keys = this.state.data1.map(v=>v.hosp_id)
			// 				$http.submit(null,'bill/endexport', { param: { hosp_ids: keys, summary_sn:this.state.data1[0].summary_sn} } ).then(data=>{
			// 					message.then(f=>f.default.success('导出成功'))
			// 					window.location.href = data.url;
			// 					close()
			// 				})
			// 			}
			// 		})
			// 	})
			} },
			{ label:'文件导入', ghost:true, onClick:()=>{// 还未完成
				console.log('upload');
				// <Upload accept='.xlsx' action= {window.$config.api+'bs-hospital/import'}  />
            } },
		]
	}
	render(){
		const { data, pullLoading, pag, } = this.state
		return (
			<Page title='医院客户' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) }
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
					onRow			= {current => {
						this.setState({data1:current})
						this.setState({selectedKeys:current})
					}}
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
					onSort			= { v => $fn.onSort.call(this, v) }
				/>
			</Page>
		)
	}
}