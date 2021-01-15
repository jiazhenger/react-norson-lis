// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
import { ExclamationCircleTwoTone } from '@ant-design/icons';
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const message = import('@antd/message')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
const Receiveboxchild = $async(()=>import('./receive-box-child'))
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:{},
		submit: [
			{ label:'用户名',			name:'account',		type: 'input',			required:true },
			{ label:'密码', 			name:'password', 	type: 'password',		required:true }, 
			{ label:'接收数量', 		name:'num',			type: 'input',			required:true },
			{ label:'开箱温度', 		name:'warm',		type: 'input',			required:true }
		]
	}
	
	forms = [
		{ label:'标本箱编号',		name:'box_number',	type:'input' },
		{ label:'标本箱条码号',		name:'box_code',	type:'input' },
		{ label:'收单时间',			name:'date',		type:'date-range',  names:['start_date','end_date'] },
	]
	model = {}
	componentDidMount(){ 
		this.fetch()
	}
	// paging
	fetch = param => $fn.fetch.call(this,'box/reclist', param)
	cols = [
		{ title: '标本箱编号', 		field: 'box_number', 	width:120 },
		{ title: '标本箱条码号', 	field: 'box_code', 		width:120 },
		{ title: '收单人', 			field: 'receiver_name',	width:120 },
		{ title: '条码数量', 		field: 'spec_count', 	width:120 },
		{ title: '标本数量', 		field: 'spec_num', 		width:120 },
		{ title: '到达时间', 		field: 'arrival_time', 	width:120 },
		{ title: '收单时间', 		field: 'receive_time', 	width:120 },
	] 
	ButtonGroup = () => {
		return [
			{ label:'确认接收 F2', code:'F2', onClick:()=>{
				this.refs.modal.open() 
			} } 
		]
	}
	render(){
		const { data, pullLoading, pag, selectedKeys, submit } = this.state
		return (
			<Page title='接收标本箱' ButtonGroup={this.ButtonGroup()}> 
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
					onRow			= { v => this.setState({ selectedKeys: v }) }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
				/> 
				<Receiveboxchild className='fv rel ex xplr' data={ $fn.hasObject(selectedKeys) ? selectedKeys : ''} />
				<Modal ref='modal' title='确认接收' width={648} noFooter>
					<div className="f12 pb20 tc"><ExclamationCircleTwoTone twoToneColor="#ff4d4f" className="mr5" />请输入用户名与密码进行接收确认，当前标本数量 {selectedKeys.spec_num}</div>
					<SubmitForm
						modal
						data = { submit }
						onSubmit = { v => {
							let param = { ...v, uuid: selectedKeys.uuid} 
							console.log(param)
							$http.submit(null, 'box/receive', { param }).then(data=>{
								message.then(f=>f.default.success('接收成功'))
								this.refs.modal.close()
								this.fetch(this.model)
							}) 
						}}
						onClose = { ()=>this.refs.modal.close() }
					 />
				</Modal>
			</Page>
		)
	}
}