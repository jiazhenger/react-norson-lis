import React from 'react'
// ===================================================================== common
import ts from '@views/laboratory/testing-center/tp/common.js' 
// ===================================================================== global declare
const { $async, $http, $fn } = window
// ===================================================================== antd
const message = import('@antd/message')
const Input = $async(()=>import('@antd/form/input')) 
// ===================================================================== component
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
		this.props.onRef(this) 
		const {infos} = this.props  
		if ($fn.hasObject(infos)) {
			this.setState({infos: infos})
			this.setForms(infos.content)
		} else { 
			this.setForms()
		}
	} 
	componentWillReceiveProps ({infos}) { 
		this.setState({infos: infos})
		this.setForms(infos.content)
	}
	setForms = (v) => { 
		const { forms } = this.state
		if ($fn.hasObject(v)) { 
			forms.bone_marrow_features = v.bone_marrow_features || ''
			forms.blood_characteristics = v.blood_characteristics || ''
			forms.morphological_opinion = v.morphological_opinion || '' 
			forms.imgs = v.imgs || []
			forms.report_form_imgs = v.report_form_imgs || ''
			this.setState({forms: forms})
		} else {
			forms.bone_marrow_features = ''
			forms.blood_characteristics = ''
			forms.morphological_opinion = '' 
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
		let params = {
			uuid: infos.uuid,
			content: content,
			dmodel: ts.getPath().id
		};
		$http.submit(null,'result-unit-item/update', { param: params, successText: '操作成功'})
	}
	render () {
		const { className, is_coll_pic, is_upload_report_form } = this.props
		const { forms } = this.state
		return (
			<div className={`${className} xplr`}> 
				{ is_coll_pic === '1' && <UploadImg title='镜下涂片' handleChange={(v) => { console.log(v) }} value={forms.imgs} /> } 
				{ is_upload_report_form === '1' && <UploadReport handleChange={(v) => { console.log(v) }} value={forms.report_form_imgs} />}
			 	<Title title='骨髓特征' />
				<Input mode='textarea' name='bone_marrow_features' size='middle' bordered={false} value={forms.bone_marrow_features} onChange={(v, data, name) => this.changeInput(v, name) } />
				<p className='g9 lh20'>(使用向下" ↓ "箭头自动搜索)</p>
			 	<Title title='血片特征' />
				<Input mode='textarea' name='blood_characteristics' size='middle' bordered={false} value={forms.blood_characteristics} onChange={(v, data, name) => this.changeInput(v, name) } />
				<p className='g9 lh20'>(使用向下" ↓ "箭头自动搜索)</p>
			 	<Title title='形态学意见' />
				<Input mode='textarea' name='morphological_opinion' size='middle' bordered={false} value={forms.morphological_opinion} onChange={(v, data, name) => this.changeInput(v, name) } />
				<p className='g9 lh20'>(使用向下" ↓ "箭头自动搜索)</p> 
			</div>
		) 
	}  
}