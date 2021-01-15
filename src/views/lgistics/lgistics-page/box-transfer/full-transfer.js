// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react' 
// ===================================================================== global declare 
import ScanImage from '@img/saoma.svg'
const { $http, $fn, $async } = window  
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))  
const message = import('@antd/message')
// ===================================================================== global antd
const Input = $async(()=>import('@antd/form/input'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component 
const Table = $async(()=>import('#cpt/table')) 
// ===================================================================== img
const Image = $async(()=>import('@tp/image'))
// ===================================================================== component
export default class extends React.Component{ 
	isEdit = false
	state = {
		data:[],
		pag: {},
		selectedKeys:[], 
		forms: {
			oldInput: '',
			newInput: ''
		}
	}      
	componentDidMount(){}  
	cols = [       
		{ title: '条码号',				field: 'spec_code',			width:120 },   
		{ title: '送检单位',			field: 'hosp_name',			width:120 },   
		{ title: '送检地址',			field: 'address',			width:120 },   
		{ title: '状态',				field: 'spec_status',		width:120 , render: ({rows}) => {
			let options = [
              { label: "待分发", value: 0 },
              { label: "不可分发", value: -1 },
              { label: "已分发", value: 1 }
			]
			return window.$fn.filterSelect(options, rows.spec_status, 'label', 'value') 
		}} 
	]    
	ButtonGroup = () => {
		return [
			{ label:'返回',	ghost:true, onClick:()=> $fn.back(this)} 
		] 
	} 
	onChanges = (v, name) => { 
		const {forms} = this.state
		forms[name] = v
		this.setState({forms: forms})  
	} 
    handleInputBlur = (name) => { 
		const { forms } = this.state
		if (forms[name] && forms[name].length === 6) {
			const param = {box_code: forms[name]}
			$http.pull(null, 'box/specCodeInfo', {param: param}).then(data => {
				this.setState({data: data.items})
				message.then(f => f.default.success('操作成功')) 
			}).catch(err => {
				this.setState({data: []})
			})  
		} else {
			message.then(f=>f.default.success('条码格式错误'))
		}  
	}
	confirmInfo = () => {
		const param = {
			old_box_code: this.state.forms.oldInput,
			new_box_code: this.state.forms.newInput, 
		} 
		 $http.submit(null, 'box/allMove', {param: param}).then(data => {
			message.then(f => f.default.success('操作成功')) 
		}) 
	}
	render(){ 
		const { forms, data, pullLoading, pag, keys } = this.state
		return (
			<Page title='整箱转移' ButtonGroup={this.ButtonGroup()}> 
				<div className='fx p10'>
					<div className='fxw'>
						<div className='mb5 mr10'>
							原标本箱条码：
							<Input p='请扫描或输入条码号' maxLength={6} width={160} value={forms.oldInput} style={{borderRadius: '4px'}} className='mlr5' onChange={(v) => this.onChanges(v, 'oldInput')} onPressEnter={() => this.handleInputBlur('oldInput')} />
						</div> 
						<div><Image className='mr15 dkm' src={ ScanImage } height='20px' width='20px'/></div>
						<div className='mb5 mr10'>
							新标本箱条码：
							<Input p='请扫描或输入条码号' maxLength={6} width={160} value={forms.newInput} style={{borderRadius: '4px'}} onChange={(v) => this.onChanges(v, 'newInput')} className='mlr5' onPressEnter={() => this.handleInputBlur('newInput')} />
						</div> 
						<div><Image className='mr15 dkm' src={ ScanImage } height='20px' width='20px'/></div>
					</div>
					<div>
						<Button label='确认' ghost className='mr10' onClick={() => this.confirmInfo()} />
					</div>
				</div>
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