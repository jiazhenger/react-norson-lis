import React from 'react'
// ===================================================================== common
import ts from '@views/laboratory/testing-center/tp/common.js' 
// ===================================================================== global declare
const { $async, $fn, $http } = window
// ===================================================================== antd
const Input = $async(()=>import('@antd/form/input')) 
const message = import('@antd/message') 
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
		keys: 0 
	} 
	componentDidMount () {
		this.setForms() 
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
			forms.pathological_diagnosis = '未见上皮内病变或恶性病变（NILM）。' 
			forms.imgs = '' 
			forms.report_form_imgs = '' 
			forms.send_material = '' 
			forms.visit_doctor_id = '' 
			forms.return_visit_doctor_id = ''  
			this.setState({forms: forms})  
		}
	}  
	changeInput = (v, name) => ts.changeInput.call(this, v, name) 
	submits = () => {
		const { infos, forms } = this.state
		if (!$fn.hasObject(infos)) { return message.then(f => f.default.error('请选择一条列表数据')) }
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
	render () {
		const { forms, infos, keys } = this.state  
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
				{ $fn.hasObject(infos) && infos.is_coll_pic === '1' 			&& <UploadImg name='imgs' value={forms.imgs} handleChange={(v, name) => this.changeInput(v, name)} /> } 
				{ $fn.hasObject(infos) && infos.is_upload_report_form === '1' 	&& <UploadReport name='report_form_imgs' value={forms.report_form_imgs} handleChange={(v, name) => this.changeInput(v, name)}/> } 
				<div className='fx'>
					<div style={{width: '50%'}}>
						<Title title='送检材料' />
						<Input name='send_material' size='middle' bordered={false} value={forms.send_material} onChange={(v, data, name) => this.changeInput(v, name) } />
						<Title title='临床诊断' />
						<Input name='clinical_diagnosis' size='middle' bordered={false} value={forms.clinical_diagnosis} onChange={(v, data, name) => this.changeInput(v, name) } />
						<Title title='肉眼所见' />
						<Input name='naked_eye' size='middle' bordered={false} value={forms.naked_eye} onChange={(v, data, name) => this.changeInput(v, name) } />
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
					<div style={{width: '50%', marginLeft: '20px'}}>
						<Title title='病理所见' />
						<Input name='pathology' size='middle' mode='textarea' bordered={false} value={forms.pathology} onChange={(v, data, name) => this.changeInput(v, name) } />
						<p className='g9 lh20'>(使用向下" ↓ "箭头自动搜索)</p>
						<Title title='病理诊断' />
						<Input name='pathological_diagnosis' key={keys} size='middle' mode='textarea' bordered={false} value={forms.pathological_diagnosis} onChange={(v, data, name) => this.changeInput(v, name) } />
						<p className='g9 lh20'>(使用向下" ↓ "箭头自动搜索)</p>
					</div>
				</div> 
			</BoxScroll>
		)
	} 
}