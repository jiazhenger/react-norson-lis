// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// ===================================================================== global antd
const Input = $async(()=>import('@antd/form/input'))
// ===================================================================== private component
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data: [],
		pag: {},
		selectedKeys:[],
		forms: {},
		keys: 0
	} 
	model = {}
	componentDidMount(){ 
		this.props.onRef(this)
		this.fetch()
	}
	fetch = param => $http.paging(this,'shelf/myshelf',{ param:{...param, pageSize:this.pageSize, ...this.state.forms }, loading:false } )
	cols = [ 
		{ title: '标本架编号', 		field: 'sf_number', 	width:100 },
		{ title: '科室', 		field: 'project_name', 	width:120 },
		{ title: '容量', 		field: 'total_capacity', 	width:100 },
		{ title: '已使用量', 		field: 'use_capacity', 	width:100 },
		{ title: '操作', 		align: 'tc', 	width:100, render: ({rows}) => {
			return (<Button label='上架完成' ghost onClick={() => this.onCompletion(rows.sf_number)} />)
		} }  
	]  
    onCompletion(val) {
		const param = { sf_number: val } 
		$http.submit(this, 'shelf/upshelfadded', {param: param, submitLoading:'infoLoading'}).then(data => {
			message.then(f => f.default.success('操作成功')) 
			this.fetch() 
			this.props.onCompletes()
		}) 
	}
	onReset = () => {
		const {forms, keys} = this.state
		forms['sf_code'] = ''
		forms['sf_number'] = ''
		forms['project_name'] = ''
		this.setState({forms: forms, keys: keys+1 }, () => {
			this.fetch()
		})  
	}
	onChanges = (v, name) => { 
		const {forms} = this.state
		forms[name] = v
		this.setState({forms: forms})  
	}
	pulldown = () => { 
		const {forms, keys} = this.state 
		if (forms.sf_code) { 
			const param = { sf_code: forms.sf_code }
			$http.submit(this, 'shelf/autouse', {param: param, submitLoading:'infoLoading'}).then(data => {
				message.then(f => f.default.success('操作成功'))
				forms['sf_code'] = ''
				this.setState({forms: forms, keys: keys+1 })
				this.fetch()
			}) 
		} else {
			message.then(f => f.default.error('请输入标本架代码'))
		}
	}
	onRow (v) {
		this.setState({ selectedKeys: v })
		this.props.onCompletes({sf_number: v.sf_number, project_name: v.project_name, current: 1})
	}
	render(){
		const { forms, data, pullLoading, pag, keys } = this.state
		return (
			<React.Fragment>
				{/* 搜索 */} 
				<div className='fx p10'>
					<div className='ex fxw' key={keys}>
						<div className='mb5 mr10'>
							标本架代码：
							<Input p='请输入标本架代码' width={120} value={forms.sf_code} style={{borderRadius: '4px'}} className='mlr5' onChange={(v) => this.onChanges(v, 'sf_code')} onPressEnter={() => this.pulldown()} />
							<Button label='领取' ghost className='mlr5' onClick={() => this.pulldown()} />
						</div>
						<div className='mb5 mr10'>
							标本架编号：
							<Input p='请输入标本架编号' width={120} value={forms.sf_number} style={{borderRadius: '4px'}} onChange={(v) => this.onChanges(v, 'sf_number')} className='mlr5' />
						</div>
						<div className='mb5 mr10'>
							科室：
							<Input p='请输入科室' width={120} value={forms.project_name} style={{borderRadius: '4px'}} onChange={(v) => this.onChanges(v, 'project_name')} className='mlr5' />
						</div>
					</div>
					<div>
						<Button label='查询' ghost className='mr10' onClick={() => this.fetch()} />
						<Button label='重置' ghost onClick={() => this.onReset()} />
					</div>
				</div>
				{/* 表格 */}
				<Table
					className		= 'plr2' 
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { v => this.onRow(v) }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
				/> 
			</React.Fragment>
		)
	}
}