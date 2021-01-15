import React from 'react'
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const message = import('@antd/message')
const confirm = import('@antd/confirm')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
const cacheApi = import('@/private/api/cacheApi')
const Button = $async(()=>import('@antd/button'))

// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component

export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		data1: {},
	}
	options = [
		{ label: "未审核", 		value: "0" },
		{ label: "审核通过", 	value: "1" },
		{ label: "审核未通过", 	value: "-1" }
	]
	forms = [
		{ label:'医院名称',		name:'hosp_name', },
        { label:'医院性质',		name:'nature',		type:'select', 	data: [] },
        { label:'医院代码',		name:'hosp_code',	 },
        { label:'医院级别',		name:'level',		type:'select', 	data: [] },
		{ label:'区域',			name:'region',		type:'select', 	data: [] },
	]
	model = {
		type: "my", //type为区分自己还是下级，my：我的，sub：我的下级
	}
	async getDataAsync() {
		await $fn.getDisItem({ // 医院级别
			code: 39000,
			callback: (data) => {
				this.forms[3].data = data
			}
		})
		await $fn.getDisItem({ // 医院性质
			code: 44100,
			callback: (data) => {
				this.forms[1].data = data
			}
		})
	}
	componentDidMount(){
		cacheApi.then(f => {
            const d = f.default
			$fn.getCache({ // 区域
				cache: d.bsareaSelect, callback: (data) => {
					if ($fn.hasArray(data)) {
						this.forms[4].data = data
					} else {
						$http.pull(null, 'bs-area/select').then(data => {
							this.forms[4].data = data
							$fn.setCache()
						})
					}
				}
			})
		})
		this.getDataAsync()
		this.fetch()
	}

	fetch = param => $fn.fetch.call(this,'bs-hospital/businessHosp', param)
	cols = [
		{ title: '医院代码', 	field: 'hosp_code', 	width:120 },
        { title: '医院名称', 	field: 'hosp_name', 	width:120 },
		{ title: '医院性质', 	field: 'nature_name', 	width:120 },
		{ title: '医院级别', 	field: 'level_name', 	width:120 },
		{ title: '业务员名称', 	field: 'salesman_user', width:120 },
        { title: '创建时间', 	field: 'create_at', 	width:120 },
		{ title: '状态', 		field: 'enabled', 		width:120,
			render: ({rows}) => {
			return window.$fn.filterSelect(this.options, rows.enabled, 'label', 'value')
		} },
		{ title: '操作', 		field: 'status', 		width:120, render:({rows})=>{
			return (
				<div className='plr5'>
                    <Button label='查看' ghost className='ml15' onClick={() => {
						$fn.push(this, $fn.getRoot().root + 'businessList/LowerLevel-hospital-clients/add?id='+rows.uuid+'&isEdit=0')
					}} />
					<Button label='编辑' ghost className='ml15' onClick={() => {
						$fn.push(this, $fn.getRoot().root + 'businessList/LowerLevel-hospital-clients/add?id='+rows.uuid+'&isEdit=1')
                    }} />
				</div>
			)
		} },
	]
	ButtonGroup = () => {
		return []
	}
	render(){
		const { data, data1, pullLoading, pag, submit, selectedKeys } = this.state
		return (
			<Page title='我的医院客户' ButtonGroup={this.ButtonGroup()}>
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
					// sort
					onSort			= { v => $fn.onSort.call(this, v) }
				/>
			</Page>
		)
	}
}