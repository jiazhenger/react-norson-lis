import React from 'react'
// ===================================================================== common
import ts from '@views/laboratory/testing-center/tp/common.js' 
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $async, $fn, $http } = window
// ===================================================================== antd
const Input = $async(()=>import('@antd/form/input')) 
const message = import('@antd/message') 
const Checkbox = $async(()=>import('@antd/form/checkbox'))
// ===================================================================== component
const Button = $async(()=>import('@antd/button'))
const BoxScroll = $async(()=>import('#tp/box/box-scroll'))
const UploadImg = $async(()=>import('./upload-img'))
const UploadReport = $async(()=>import('./upload-report'))
// ===================================================================== component
const Title = ({ title, titleChildren }) => (
	<h3 className='fxm h30'><i className='r100px mr5' style={{width:5,height:5,background:'#333'}}></i><span>{title}</span><div className='ex tr'>{titleChildren}</div></h3>
) 
// ===================================================================== component  
export default class extends React.Component{
	state = {
		forms: {}, // 要提交的数据
		infos: {}, // 详情
		immuneOption: [],
		keys: 0,
		codeSelect: [], // 选中
		codeChecked: false, // 全选状态
	} 
	componentDidMount () {
		this.setForms()
		$fn.dataSave('dis-item-67000-data').then(local => {
			if($fn.hasArray(local)){ 
			  this.setState({immuneOption: local})
			}else{
			  $http.submit(this,'dis-item/item', { param: {dis_code: 67000}}).then(data=>{ 
				this.setState({immuneOption: data})
				$fn.dataSave('dis-item-67000-data', data)
			  })
			}
		})
	}
	componentWillReceiveProps ({infos}) { 
		this.setState({infos: infos})
		this.setForms(infos.content)
	}
	setForms = (v) => { 
		const { forms } = this.state
		if ($fn.hasObject(v)) {  
			this.setState({forms: v})
		} else {
			forms.clinical_diagnosis = ''
			forms.naked_eye = ''
			forms.pathology = ''
			forms.pathological_diagnosis = ''
			forms.ts_approve_id = ''
			forms.fees = '80' // 固定物价
			forms.item_num = '1'
			forms.imgs = []
			forms.qt_item_table = []
			forms.report_form_imgs = ''
			forms.total_price = ''
			forms.visit_doctor_id = ''
			forms.return_visit_doctor_id = ''
			forms.wax_block_number = ''
			this.setState({forms: forms}, () => this.setTotalPrice())
		}
	}  
	changeInput = (v, name) => ts.changeInput.call(this, v, name, () => {
		if (name === 'item_num') { this.setTotalPrice() }
	})
	// 计算总价
	setTotalPrice = () => {
		const { forms } = this.state
		const total_price = (forms.item_num * forms.fees).toFixed(2);
		forms.total_price = !isNaN(total_price) ? total_price : '' 
		this.setState({forms}) 
	}
	submits = () => {
		const { infos, forms } = this.state
		if (!$fn.hasObject(infos)) { return message.then(f => f.default.error('请选择一条列表数据')) }
		if (forms.item_num <= 0) { return message.then(f => f.default.error('项数必须大于0')) } 
		let content = ts.setNullParameter(forms);
		const _content = $fn.getObjectParam('content',content)
		let param = {
		  uuid: infos.uuid,
		 ..._content,
		  dmodel: ts.getPath().id,
		  project_id: ts.getPath().project_id,
		  status: this.props.status,
		};
		$http.submit(null,'result-unit-item/update', { param: param, successText: '操作成功'})
	}  
	// 复选
	changeSelect = (v, row) => {
		let { immuneOption, keys } = this.state
		immuneOption.forEach(i => {
			if (row.value === i.value) {
				i.checked = v
			}
		})
		const codeSelect = immuneOption.filter(i => i.checked)
		this.setState({immuneOption: immuneOption, codeSelect: codeSelect, codeChecked: codeSelect.length === immuneOption.length ? true : false, keys: keys + 1})  
	}
	// 全选
	allSelect () {  
		let { immuneOption, codeChecked, keys } = this.state
		immuneOption.forEach(i => {
			i.checked = !this.state.codeChecked
		})
		const codeSelect = immuneOption.filter(i => i.checked)
		this.setState({immuneOption: immuneOption, codeSelect: codeSelect, codeChecked: !codeChecked, keys: keys + 1})  
	}
	render () {
		const { forms, infos, keys, immuneOption } = this.state  
		const { width } = this.props
		return (
			<BoxScroll 
				className	= 'fv' 
				title		= '实验结果'
				style		= {{width: width ? width : 350}}
				titleChildren = {
					<div className='fxm' >
						<Button label='下发设置' ghost className='ml10' />
						<Button label='下发' ghost className='ml10' />
						<Button label='保存' ghost className='ml10' onClick={() => this.submits()} />
					</div>
				} 
			>   
				<div className='fx'>
					<div style={{width: '50%'}}>
						{ $fn.hasObject(infos) && infos.is_coll_pic === '1' 			&& <UploadImg name='imgs' value={forms.imgs} handleChange={(v, name) => this.changeInput(v, name)} /> } 
						<Title title='临床诊断' />
						<Input name='clinical_diagnosis' size='middle' bordered={false} value={forms.clinical_diagnosis} onChange={(v, data, name) => this.changeInput(v, name) } />
						<Title title='原蜡块号' />
						<Input name='wax_block_number' size='middle' bordered={false} value={forms.wax_block_number} onChange={(v, data, name) => this.changeInput(v, name) } />
						<Title title='肉眼所见' />
						<Input name='naked_eye' size='middle' mode='textarea' bordered={false} value={forms.naked_eye} onChange={(v, data, name) => this.changeInput(v, name) } />
						<p className='g9 lh20'>(使用向下" ↓ "箭头自动搜索)</p>
					</div>
					<div style={{width: '50%', marginLeft: '20px'}}>
						{ $fn.hasObject(infos) && infos.is_upload_report_form === '1' 	&& <UploadReport name='report_form_imgs' value={forms.report_form_imgs} handleChange={(v, name) => this.changeInput(v, name)}/> } 
						<Title title='病理所见' />
						<Input name='pathology' size='middle' mode='textarea' bordered={false} value={forms.pathology} onChange={(v, data, name) => this.changeInput(v, name) } />
						<p className='g9 lh20'>(使用向下" ↓ "箭头自动搜索)</p>
						<Title title='病理诊断' titleChildren={
							<Button label='选择' ghost className='ml10' onClick={() => this.refs.modal.open()} />
						} />
						<Input name='pathological_diagnosis' key={keys} size='middle' mode='textarea' bordered={false} value={forms.pathological_diagnosis} onChange={(v, data, name) => this.changeInput(v, name) } />
						<p className='g9 lh20'>(使用向下" ↓ "箭头自动搜索)</p>
						<div className='fx'>
							<div style={{width: '50%'}}>
								<Title title='初诊医生' /> 
								<div className='b'>{forms.ts_audit_name}</div>
							</div>
							<div style={{width: '50%'}}>
								<Title title='复诊医生' /> 
								<div className='b'>{forms.ts_approve_name}</div>
							</div>
						</div>
					</div>
				</div> 
				<div> 
					<Title title='收费' />
					<div className='fxm'>
						<Input className='mr20' name='fees' width={120} disabled size='middle' bordered={false} value={forms.fees} onChange={(v, data, name) => this.changeInput(v, name) } />
						项数： <Input className='mr20' name='item_num' width={120} size='middle' bordered={false} value={forms.item_num} onChange={(v, data, name) => this.changeInput(v, name) } />
						总价： <Input name='total_price' width={120} disabled size='middle' bordered={false} value={forms.total_price} onChange={(v, data, name) => this.changeInput(v, name) } />
					</div>
				</div> 
				<Modal ref='modal' title='免疫组化抗体' width={800} onOk={() => {
					const { forms } = this.state
					let d = "";
					this.state.codeSelect.forEach(i => {
						d = d ? d + ", " + i.name : i.name;
					});
					forms.pathological_diagnosis = forms.pathological_diagnosis + "\n" + d 
					immuneOption.forEach(i => { i.checked = false })
					this.setState({forms: forms, codeSelect: [], immuneOption: immuneOption, keys: keys + 1})
					this.refs.modal.close()
				}}> 
					<div className='fx pb10 mb10' key={keys} style={{borderBottom: '1px solid #F2F2F2'}}>
						<div className='ex'>
							<Checkbox disabled={!$fn.hasArray(immuneOption)} value={this.state.codeChecked} onChange={ (e) => this.allSelect()} label='全选' />
							<span>选择 {this.state.codeSelect.length} 条</span>
						</div> 
					</div>
					<div className='fxw' key={keys + 1}>
						{
							$fn.hasArray(immuneOption) && 
							immuneOption.map((item, index) => {
								return <div key={index} style={{width: '120px'}}>
									<Checkbox value={item.checked} onChange={ (e) => this.changeSelect(e, item) } label='' />
									<span>{item.name}</span>
								</div>
							})
						}
					</div> 
				</Modal>
			</BoxScroll>
		)
	} 
}