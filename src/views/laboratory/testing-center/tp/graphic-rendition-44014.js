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
		infos: {} // 详情
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
			forms.result2 = v.result2 || ''
			forms.result3 = v.result3 || ''
			forms.result_suggestion_name = v.result_suggestion_name || ''
			forms.clinical_advice = v.clinical_advice || ''
			forms.imgs = v.imgs || []
			forms.report_form_imgs = v.report_form_imgs || ''
			this.setState({forms: forms})
		} else {
			forms.result2 = ''
			forms.result3 = ''
			forms.result_suggestion_name = ''
			forms.clinical_advice = ''
			forms.imgs = []
			forms.report_form_imgs = ''
			this.setState({forms: forms})
		}
	}  
	changeInput = (v, name) => ts.changeInput.call(this, v, name)
	submits = () => {
		const { infos, forms } = this.state
		if (!$fn.hasObject(infos)) { return message.then(f => f.default.error('请选择一条列表数据')) }
		let content = ts.setNullParameter(forms);
		const _content = $fn.getObjectParam('content',content)

		let params = {
		  uuid: infos.uuid,
		 ..._content,
		  dmodel: ts.getPath().id
		};
		$http.submit(null,'result-unit-item/update', { param: params, successText: '操作成功'})
	} 
	render () {
		const { forms, infos } = this.state  
		return (
			<BoxScroll 
				className	= 'fv' 
				title		= '图形与解释'
				style		= {{width:350}}
				titleChildren = {
					<div className='fxm' >
						<Button label='保存' className='ml10' onClick={() => this.submits()} />
					</div>
				} 
			>  
				{
					$fn.hasObject(infos) && $fn.hasObject(infos.kd_check_result_cats) && infos.kd_check_result_cats.result2 === '1' &&
					<>
						<Title title='结果2'  />
						<Input name='result2' size='middle' bordered={false} value={forms.result2} onChange={(v, data, name) => this.changeInput(v, name) } />
					</>
				}
				{
					$fn.hasObject(infos) && $fn.hasObject(infos.kd_check_result_cats) && infos.kd_check_result_cats.result3 === '1' &&
					<>
						<Title title='结果3' />
						<Input name='result3' size='middle' bordered={false} value={forms.result3} onChange={(v, data, name) => this.changeInput(v, name) } />
					</>
				} 
				<Title title='建议与解释（手动）' />
				<Input name='result_suggestion_name' size='middle' mode='textarea' bordered={false} value={forms.result_suggestion_name} onChange={(v, data, name) => this.changeInput(v, name) } />
				<p className='g9 lh20'>(使用向下" ↓ "箭头自动搜索)</p>
				<Title title='临床建议' />
				<Input name='clinical_advice' size='middle' mode='textarea' bordered={false} value={forms.clinical_advice} onChange={(v, data, name) => this.changeInput(v, name) } /> 
				{ $fn.hasObject(infos) && infos.is_coll_pic === '1' 			&& <UploadImg name='imgs' value={forms.imgs} handleChange={(v, name) => this.changeInput(v, name)} /> } 
				{ $fn.hasObject(infos) && infos.is_upload_report_form === '1' 	&& <UploadReport name='report_form_imgs' value={forms.report_form_imgs} handleChange={(v, name) => this.changeInput(v, name)}/> }
			</BoxScroll>
		)
	} 
}