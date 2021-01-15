// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// =====================================================================
import ScanImage from '@img/saoma.svg'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
const confirm = import('@antd/confirm')
// ===================================================================== global antd
const Checkbox = $async(()=>import('@antd/form/checkbox'))
const Input = $async(()=>import('@antd/form/input'))
const Select = $async(()=>import('@antd/form/select'))
// =====================================================================
const Image = $async(()=>import('@tp/image'))
// ===================================================================== private component
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		forms: {},
		keys: 0,
		// 搜索条件
		spec_code: '',
		sf_number: '',
		project_name: '',
		isPrinter: false,
		copies: 1,
		// 拆分字段
		shortKeyParams: '', // 用来操作左右键参数
	}
	
	forms = [] 
	copiesSelect = [
        {label: '1', value: 1},
        {label: '2', value: 2},
        {label: '3', value: 3},
    ]
	model = {}
	componentDidMount(){ 
		this.props.onRef(this)
		this.fetch()
	} 
	fetch = param => $fn.fetch.call(this,'shelf/upshelflist', param)
	cols = [
		{ title: '序号', 		field: 'sort', 			width:100 },
		{ title: '标本号', 		field: 'spec_code', 	width:120 },
		{ title: '标本架编号',	field: 'sf_number', 	width:120 },
		{ title: '岗位组', 		field: 'project_name', 	width:120 }
	]  
	onChanges = (v, name) => {  
		let d = this.state[name]
		d = v
		this.setState({[name]: d})   
	}
	entering = () => {  
		const param = {spec_code: this.state.spec_code}
		$http.submit(this, 'shelf/alertsplit', {param: param, loading: false}).then(data => {
			// alert_split为1就弹框，否则就走之前的流程
			if (data.alert_split === '1') {
				let project_names = data.project_names ? data.project_names : ''
				this.setState({shortKeyParams: data.old_spec_code})  
				confirm.then(f=>{
					f.default({
						msg:`是否直接拆分？${project_names}`,
						onOk: close => {  
							this.splits(data.old_spec_code)
							this.setState({shortKeyParams: ''})  
							close()
						},
						onCancel: close => { 
							console.log(close)
							this.UpperFrameEntry()
							this.setState({shortKeyParams: ''})  
						}
					})
				})
			} else {
				this.UpperFrameEntry()
			}
		}).catch(err => {
			this.setState({sf_number: '', project_name: '', keys: this.state.keys + 1 })
		})  
	}
	// 直接拆分
    splits(spec_code) {
		const param = {old_spec_code: spec_code}
		$http.submit(this, 'shelf/autosplit', {param: param}).then(data => {
			message.then(f => f.default.success('操作成功')) 
			this.printers(spec_code) 
			this.setState({spec_code: '', keys: this.state.keys + 1})
			this.fetch()
			this.props.onEntering() // 调用左边的列表
		}).catch(err => {
			this.setState({sf_number: '', project_name: '', keys: this.state.keys + 1})
		})  
	}
	UpperFrameEntry = () => { 
		const param = {spec_code: this.state.spec_code}
		// 查询 标本号详情
		$http.submit(this, 'shelf/getshelf', {param: param, loading: false}).then(data => {
			this.setState({sf_number: data.sf_number, project_name: data.project_name, keys: this.state.keys + 1 })
			// 录入标本号
			const infos = {
				sf_number: this.state.sf_number, // 标本架编号
				project_name: this.state.project_name, // 岗位组
				spec_code: this.state.spec_code // 标本条码
			}
			$http.submit(this, 'shelf/upshelf', {param: infos}).then(data => {
				message.then(f => f.default.success('操作成功')) 
				this.printers(this.state.spec_code) // 获取要打印的数据
				this.setState({spec_code: '', keys: this.state.keys + 1})
				this.fetch()
				this.props.onEntering() // 调用左边的列表
			})
		}).catch(err => {
			this.setState({sf_number: '', project_name: '', keys: this.state.keys + 1})
		})  
	}
	// 是否打印 
	printers = (spec_code) => {
		if (this.state.isPrinter) {
			const param = {spec_code: spec_code}
			$http.submit(this, 'shelf/printshelf', {param: param}).then(data => {
				// 获取打印数据，调用打印调用方法
			})  
		} 
	}
	render(){
		const { data, pullLoading, pag, keys } = this.state
		return ( 
			<React.Fragment>  
				{/* 搜索 */}
				<div className='fx p10'>
					<div className='ex fxw' key={keys}>
						<div className='mb5 mr10 fxm'>
							标本号：
							<Input p='请输入标本号' width={120} value={this.state.spec_code} style={{borderRadius: '4px'}} className='mlr5' onChange={(v) => this.onChanges(v, 'spec_code')} onPressEnter={() => this.entering()} />
							<Image className='mr15 dkm' src={ ScanImage } height='20px' width='20px'/>
						</div>
						<div className='mb5 mr10'>
							标本架编号：
							<Input p='请输入标本架编号' disabled={true} width={120} value={this.state.sf_number} style={{borderRadius: '4px'}} className='mlr5' onChange={(v) => this.onChanges(v, 'sf_number')} />
						</div>
						<div className='mb5 mr10'>
							岗位组：
							<Input p='请输入岗位组' disabled={true} width={120} value={this.state.project_name} style={{borderRadius: '4px'}} className='mlr5' onChange={(v) => this.onChanges(v, 'project_name')} />
						</div>
						<div className='mb5 mr10 fxm'> 
							<Checkbox value={this.state.isPrinter} onChange={(v) => this.onChanges(v, 'isPrinter')} /><span className='ml5'>打印实验号</span> 
						</div>
						{this.state.isPrinter && 
						<div className='mb5 mr10 fxm'> 
							打印份数：
							<Select data={this.copiesSelect} p='请选择' nameStr='label' idStr='value' value={this.state.copies} onChanged={(v) => this.onChanges(v, 'copies')} width={80} style={{borderRadius: '4px'}}  />
						</div>
						} 
					</div>
					<div>
						<Button label='录入' ghost className='mr10' onClick={ () => this.entering() } />
						<Button label='查看全部' ghost onClick={() => this.fetch()} />
					</div>
				</div>
				{/* 表格 */}
				<Table
					className		= 'plr2'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { v => this.setState({ selectedKeys: v }) }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) } 
				/>  
			</React.Fragment>
		)
	}
}