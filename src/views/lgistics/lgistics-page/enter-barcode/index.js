// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== antd
import Input from '@antd/form/input'
import { Tag } from 'antd'  
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button')) 
const Checkbox = $async(()=>import('@antd/form/checkbox'))
const Select = $async(()=>import('@antd/form/select')) 
const Image = $async(()=>import('@tp/image')) 
const message = import('@antd/message')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const BarcodeInfo = $async(()=>import('./tp/barcode-info'))
const Table = $async(()=>import('#cpt/table'))

// ===================================================================== 缓存
const cacheApi = import('@/private/api/cacheApi')

// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],  
		key: 0, 
		forms: {
			box_code: '',
			hospchecked: false, // 医院名称录入
			hosp_code: '',
			hospital_name: '',
			new_hosp_code: '',
			checked: '', // 批量录入
			critical: false, // 加急
			start_code: '',
			end_code: '',
			spec_num: '1',
			tag: [],
			spec_traits: '21002',
			remark: ''
		},
		hopsOptions: [], // 医院
		disItem21000: [], 
		disItem69700: [],  
		is_pic_s: '',
		keys: 0
	} 
	model = {}
	cols = [
		{ title: '条码信息',		field: 'spec_code',	    width:120 },
		{ title: '操作',			field: 'spec_code',	    width:120, render: ({rows, index}) => {
			return (
				<div>
					<Button label='查看' className='mr10' onClick={()=> {} }/>  
					<Button label='上传' className='mr10' onClick={()=> {} }/>  
					<Button label='删除' className='mr10' onClick={()=> this.deleteCode(rows, index) }/>  
				</div>
			)
		}},
	]
	// 删除条码
	deleteCode(rows, index) {
		$http.pull(null,'specimen/cancelAddSpecimen',{dataName:null, param: {spec_code: rows.spec_code}}).then(rs=>{
			message.then(f => f.default.success('删除成功'))
			const { data, keys } = this.state
			data.splice(index, 1)
			this.setState({data: data, keys: keys + 1})
		}) 
	}
	componentDidMount(){  
		cacheApi.then(f => {
			$fn.getCache({
				cache: f.default.BsHospitalSelect, name: 'name', id: 'hosp_spec', callback: (data) => {
					if ($fn.hasArray(data)) {
						this.setState({hopsOptions: data}) 
                    } else {
                        $http.submit(null, 'bs-hospital/select').then(d => {
							this.setState({hopsOptions: data})
                            $fn.setCache()
                        })
                    }
				}
			})
		}) 
		$fn.dataSave('dis-item-21000-data').then(local => {
			if($fn.hasArray(local)){ 
			  this.setState({disItem21000: local})
			}else{
			  $http.submit(null,'dis-item/item', { param:{dis_code:21000}, loading:false}).then(data=>{
			  this.setState({disItem21000: local})
			  $fn.dataSave('dis-item-21000-data', data)
			  }) 
			}
		})
		$fn.dataSave('dis-item-69700-data').then(local => {
			if($fn.hasArray(local)){ 
			  this.setState({disItem69700: local})
			}else{
			  $http.submit(null,'dis-item/item', { param:{dis_code:69700}, loading:false}).then(data=>{
			  this.setState({disItem69700: local})
			  $fn.dataSave('dis-item-69700-data', data)
			  }) 
			}
		})  
	} 
	ButtonGroup = () => { 
		return (
			<div>  
				<Button label='返回' ghost className='ml5' onClick={()=> $fn.back(this) }/>  
			</div>
		)
	}  
	onChanges = (v) => {   
		let keyName = Object.keys(v)[0]
		const {forms} = this.state  
		let d = Object.assign(forms, v)  
		if (keyName === 'checked') { // 批量录入
			d.end_code = ''
		} else if (keyName === 'hospchecked') { // 医院名称录入
			d.new_hosp_code = ''
			d.hosp_code = ''
			d.hospital_name = '' 
		} else if (keyName === 'new_hosp_code') { // 医院名称切换
			d.hosp_code = v.new_hosp_code
		} else if (keyName === 'hosp_code') {
			d.hospital_name = ''
		}
		this.setState({forms: d})
	}
    tagsChange(v, checked) { 
        const { forms } = this.state;
        const nextSelectedTags = checked ? [...forms.tag, v] : forms.tag.filter(t => t !== v);
        forms['tag'] = nextSelectedTags
        this.setState({ forms: forms }); 
	}
	inintForms = (v) => {
		let param = {
			start_code: v.start_code || '',  
			end_code: v.end_code || '',
			spec_traits: v.spec_traits || '',
			hosp_code: v.hosp_code || '',
			box_code: v.box_code || '',
			spec_num: v.spec_num || '',
			tag: v.tag || [],
			critical: (v.critical ? 1 : 0) || 0,
			checked: (v.checked ? 1 : 0) || 0,
			remark: v.remark || ''
		} 
		return param
	} 
	submits = () => {
		const { forms } = this.state  
		if (forms.checked) { // 判断是否批量 
			let startNum1 = forms.start_code.substr(0, 2);
            let endNum1 = 	forms.end_code.substr(0, 2);
            let startNum2 = forms.start_code.substr(0, 12);
			let endNum2 = 	forms.end_code.substr(0, 12);
			if (!forms.start_code || !forms.end_code) { return message.then(f => f.default.error('请输入开始条码或结束条码')) } 
			if (startNum1 !== endNum1) { return message.then(f => f.default.error('请输入同一个分公司的开始条码和结束条码')) } 
			if (Number(endNum2) - Number(startNum2) > 0) { // 限制录入100条 (100 - 1)
				// 物流系统-录入条码 开始和结束条码超100条码去掉此验证 add by woshibiggou
				// if (Number(endNum2) - Number(startNum2) <= 99) {
					this.submitsInfo();
				// } else {
				// 	this.$message.error("一次性最多可录入100个条码");
				// }
			} else {
				message.then(f => f.default.error('结束条码必须大于开始条码')) 
			} 
		} else {  
			this.submitsInfo();
		} 
	}
	// 提交
	submitsInfo = () => {
		const { forms, keys } = this.state
		let param = this.inintForms(forms)  
		$http.submit(null, 'specimen/add', {param: param}).then(data => {
			forms.start_code = ''   
			this.BarcodeInfoRef.fetch()
			this.setState({forms: forms, data: data, keys: keys + 1}, () => {
				this.start_codeRef.getRef().focus() 
			}) 
			message.then(f=>f.default.success('操作成功'))
		})  
	}
	PressEnterForm = (v) => { 
		const { forms } = this.state
		$http.submit(null, 'bs-hospital/gethospname', { param: {hosp_code: forms.hosp_code} }).then(data => {
			forms.hospital_name = data.hosp_name || ''
			this.setState({forms})
		}).catch(data => {
			forms.hospital_name = ''
			this.setState({forms}) 
		})
	}  
	// 选择全部 
	render(){ 
		const { forms, keys } = this.state
		return (
		<Page title='录入条码信息' noBtGroup={true} ButtonGroup={this.ButtonGroup()}>
			<div className='fx p10'>
				<div className='fxw' style={{flex: 3}} key={keys}>
					<div className='pr10 mb10 fxm half' > 
						<span style={{width: '86px'}}>标箱条码：</span> <Input className='ex' name='box_code' value={forms.box_code} onChange={(v) => this.onChanges(v) } />
					</div>
					<div className='pr10 mb10 fxm half' > 
						<span style={{width: '86px'}}>医院名称录入：</span> <Checkbox name='hospchecked' value={forms.hospchecked} onChange={(v) => this.onChanges(v) } /> 
					</div>    
					{forms.hospchecked ? 
					<React.Fragment>
						<div className='pr10 mb10 fxm half' > 
							<span style={{width: '86px'}}>医院名称：</span> 
							<div className='ex' style={{width: 0}}>
								<Select name='new_hosp_code' data={this.state.hopsOptions} p='请选择医院名称' value={forms.new_hosp_code} onChanged={(v) => this.onChanges(v)} />
							</div>
						</div>
						<div className='pr10 mb10 fxm half' > 
							<span style={{width: '86px'}}>医院条码：</span> <Input disabled className='ex' name='hosp_code' value={forms.hosp_code} onChange={(v) => this.onChanges(v) } />
						</div> 
					</React.Fragment>
					: <React.Fragment>
						<div className='pr10 mb10 fxm half' > 
							<span style={{width: '86px'}}>医院条码：</span> <Input className='ex' name='hosp_code' value={forms.hosp_code} onPressEnter={() => this.PressEnterForm('hosp_code')} onChange={(v) => this.onChanges(v) } />
						</div>
						<div className='pr10 mb10 fxm half' > 
							<span style={{width: '86px'}}>医院名称：</span> <Input disabled className='ex' name='hospital_name' value={forms.hospital_name} onChange={(v) => this.onChanges(v) } />
						</div>  
					</React.Fragment>}
					<div className='pr10 mb10 fxm' style={{width: '30%'}}> 
						<span style={{width: '86px'}}>批量录入:</span> <Checkbox name='checked' value={forms.checked} onChange={(v) => this.onChanges(v) } /> 
					</div>  
					<div className='pr10 mb10 fxm' style={{width: '20%'}}> 
						<span style={{width: '60px'}}>加急:</span> <Checkbox name='critical' value={forms.critical} onChange={(v) => this.onChanges(v) } /> 
					</div>   
					<div className='pr10 mb10 fxm half'> 
						<span style={{width: '86px'}}>{forms.checked ? '开始条码号：' : '条码号：'}</span> <Input className='ex' maxLength={12} ref={ref => this.start_codeRef = ref}  name='start_code' value={forms.start_code} onChange={(v) => this.onChanges(v) } />
					</div> 
					{forms.checked && 
						<div className='pr10 mb10 fxm half' > 
							<span style={{width: '86px'}}>结束条码号：</span> <Input className='ex' maxLength={12} name='end_code' value={forms.end_code} onChange={(v) => this.onChanges(v) } />
						</div> 
					}
					<div className='pr10 mb10 fxm half' > 
						<span style={{width: '86px'}}>标本数量：</span> <Input className='ex' name='spec_num' value={forms.spec_num} onChange={(v) => this.onChanges(v) } />
					</div>
					<div className='pr10 mb10 fxm half' > 
						<span style={{width: '86px'}}>标本性状：</span> 
						<div className='ex' style={{width: 0}}>
							<Select name='spec_traits' data={this.state.disItem21000} p='请选择标本性状' value={forms.spec_traits} onChanged={(v) => this.onChanges(v)} />
						</div>
					</div>  
					<div className='pr10 mb10 fxm w'> 
						<span style={{width: '86px'}}>识别标签：</span>  
						<div className='ex'>   
							{this.state.disItem69700.map((v, i) => 
								(<Tag.CheckableTag
									style={{border: '1px solid #D7D9D9'}}
									key={i} 
									checked={forms.tag.indexOf(v.value) > -1}
									onChange={checked => this.tagsChange(v.value, checked)}
								>
									{v.name}
								</Tag.CheckableTag>)
							)} 
						</div> 
					</div> 	
					<div className='pr10 mb10 fxm w'> 
						<span style={{width: '86px'}}>备注：</span> 
						<div className='ex'>
							<Input style={{width: '100%'}} mode='textarea' name='remark' value={forms.remark} onChange={(v) => this.onChanges(v) } />
						</div>
					</div> 
					<div className='w tc'>
						<Button label='确定' style={{padding: '0 18px'}} onClick={()=> this.submits() }/>  
					</div>
				</div>  
				<div className='bor1' style={{width: '350px'}}>
					<Table
						key={keys}
						cols			= { this.cols }
						data 			= { this.state.data }
						loading 		= { this.state.pullLoading }
						onRow			= { v => this.setState({ selectedKeys: v }) }
						onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
					/>
				</div>
				<div className='bor1 ml10 tc' style={{flex: 2}}>
					<Image style={{margin: '0 2px 0 6px'}} src={ this.state.is_pic_s } height='12px' width='16px'/>
				</div>
			</div>
			<div className='ex'>
				<BarcodeInfo onRef={ref => this.BarcodeInfoRef = ref} />
			</div> 
		</Page>
		)
	}
}