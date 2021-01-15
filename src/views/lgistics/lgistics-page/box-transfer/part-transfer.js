// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react' 
// ===================================================================== global declare 
import ScanImage from '@img/saoma.svg'
const { $http, $fn, $async } = window  
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))  
const message = import('@antd/message')
const Checkbox = $async(()=>import('@antd/form/checkbox')) 
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
			box_code: '',
			newInput: '',
			start_code: '',
			end_code: '',
			spec_code: ''
		},
		isBatch: false
	}      
	fetch = param => $fn.fetch.call(this,'box/specCodeInfo', param)
	componentDidMount(){     
	}  
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
	confirms = () => {
		const { forms, isBatch } = this.state
		const param = { 
			box_code: forms.box_code,
			start_code: isBatch ? forms.start_code : forms.spec_code,
			end_code: isBatch ? forms.end_code : ''
		} 
		$http.submit(null, 'box/partmove', {param: param}).then(data => {
			message.then(f => f.default.success('操作成功')) 
			this.fetch({box_code: forms.box_code})
		}) 
	}
	changeBatch = (val) => { 
		this.setState({isBatch: val})
	}
	render(){ 
		const { forms, data, pullLoading, pag, keys } = this.state
		return (
			<Page title='部分转移' ButtonGroup={this.ButtonGroup()}> 
				<div className='fx p10'>
					<div className='fxw' style={{alignItems: 'center'}}>
						<div className='mr10'>
							标本箱条码：
							<Input p='请扫描或输入条码号' maxLength={6} width={160} value={forms.box_code} style={{borderRadius: '4px'}} className='mlr5' onChange={(v) => this.onChanges(v, 'box_code')} />
						</div> 
						<div><Image className='mr15 dkm' src={ ScanImage } height='20px' width='20px'/></div>
						<Checkbox indeter={false} value={this.state.isBatch} onChange={ (e) => this.changeBatch(e)} label='批量转移' />
						{
							this.state.isBatch ? (<React.Fragment>
							<div className='mr10'>
								开始标本号：
								<Input p='请扫描或输入条码号' maxLength={14} width={160} value={forms.start_code} style={{borderRadius: '4px'}} className='mlr5' onChange={(v) => this.onChanges(v, 'start_code')} />
							</div> 
							<div><Image className='mr15 dkm' src={ ScanImage } height='20px' width='20px'/></div>
							<div className='mr10'>
								结束标本号：
								<Input p='请扫描或输入条码号' maxLength={14} width={160} value={forms.end_code} style={{borderRadius: '4px'}} className='mlr5' onChange={(v) => this.onChanges(v, 'end_code')} />
							</div> 
							<div><Image className='mr15 dkm' src={ ScanImage } height='20px' width='20px'/></div>
							</React.Fragment>) : (<React.Fragment> 
								<div className='mr10'>
									标本条码：
									<Input p='请扫描或输入条码号' maxLength={14} width={160} value={forms.spec_code} style={{borderRadius: '4px'}} className='mlr5' onChange={(v) => this.onChanges(v, 'spec_code')} />
								</div> 
								<div><Image className='mr15 dkm' src={ ScanImage } height='20px' width='20px'/></div>
							</React.Fragment>)
						} 
					</div>
					<div>
						<Button label='确认' ghost className='mr10' onClick={() => this.confirms()} />
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