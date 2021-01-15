import React from 'react'
// ===================================================================== common
import ts from '@views/laboratory/testing-center/tp/common.js' 
import { Checkbox } from 'antd';
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
	checksOpt = [
		{ label: '辅助诊断', value: '1' },
		{ label: '术后复发转移高风险预测', value: '2' },  
		{ label: '疗效评价或肿瘤发展监控', value: '3' },
	]	
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
			forms.imgs = []
			forms.report_form_imgs = ''
			forms.purpose_inspec = []  
			forms.ctc_total = '' 
			forms.ctc_single = '' 
			forms.ctc_double = '' 
			forms.ctc_microemboli = '' 
			forms.ctc_microemboli_cell = '' 
			forms.cep8_3 = '' 
			forms.cep8_4 = '' 
			forms.cep8_multi = '' 
			forms.cep7_3 = '' 
			forms.cep7_4 = '' 
			forms.cep7_multi = '' 
			forms.cep17_3 = '' 
			forms.cep17_4 = '' 
			forms.cep17_multi = '' 
			forms.result = '' 
			this.setState({forms: forms})  
		}
	}  
	changeInput = (v, name) => ts.changeInput.call(this, v, name) 
	submits = () => {
		const { infos, forms } = this.state
		console.log(forms)
		if (!$fn.hasObject(infos)) { return message.then(f => f.default.error('请选择一条列表数据')) }
		let content = ts.setNullParameter(forms); 
		let param = {
		  uuid: infos.uuid,
		 ...content,
		  dmodel: ts.getPath().id,
		  project_id: ts.getPath().project_id,
		  status: this.props.status,
		};
		$http.submit(null,'result-unit-item/update', { param: param, successText: '操作成功'})
	}   
	changeCheck = (v,name) => {
		const { forms } = this.state
		forms[name] = v
		this.setState({forms})
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
						<Button label='保存' ghost className='ml10' onClick={() => this.submits()} />
					</div>
				} 
			>   
				{ $fn.hasObject(infos) && infos.is_coll_pic === '1' 			&& <UploadImg name='imgs' value={forms.imgs} handleChange={(v, name) => this.changeInput(v, name)} /> } 
				{ $fn.hasObject(infos) && infos.is_upload_report_form === '1' 	&& <UploadReport name='report_form_imgs' value={forms.report_form_imgs} handleChange={(v, name) => this.changeInput(v, name)}/> } 
				<Title title='送检目的（必选）' />
				<Checkbox.Group value={forms.purpose_inspec} options={this.checksOpt} onChange={(v) => this.changeCheck(v,'purpose_inspec')} />
				<Title title='检测数据（①=②+③）' />
				<div className='fxm mb10'>
					<span className="fz16 mr10">①</span><span>共检查到单个CTC</span>
					<Input className='mlr10' style={{width: '70px'}} name='ctc_total' value={forms.ctc_total} onChange={(v, data, name) => this.changeInput(v, name) } />个
				</div>
				<div className='fxm mb10'>
					<span className="fz16 mr10">②</span><span>单染色体异常</span>
					<Input className='mlr10' style={{width: '70px'}} name='ctc_single' value={forms.ctc_single} onChange={(v, data, name) => this.changeInput(v, name) } />个
				</div>
				<div className='fxm mb10'>
					<span className="fz16 mr10">③</span><span>双染色体异常</span>
					<Input className='mlr10' style={{width: '70px'}} name='ctc_double' value={forms.ctc_double} onChange={(v, data, name) => this.changeInput(v, name) } />个
				</div>
				<div className='fxm mb10'>
					<span className="fz16 mr10">④</span><span>微栓子</span>
					<Input className='mlr10' style={{width: '70px'}} name='ctc_microemboli' value={forms.ctc_microemboli} onChange={(v, data, name) => this.changeInput(v, name) } />簇，共
					<Input className='mlr10' style={{width: '70px'}} name='ctc_microemboli_cell' value={forms.ctc_microemboli_cell} onChange={(v, data, name) => this.changeInput(v, name) } />个细胞
				</div>
				<div className='fxw xm mb10'>
					<span >探针A：</span>
					三体<Input style={{width: '70px', margin: '0 6px'}} name='cep8_3' value={forms.cep8_3} onChange={(v, data, name) => this.changeInput(v, name) } />个；
					四体<Input style={{width: '70px', margin: '0 6px'}} name='cep8_4' value={forms.cep8_4} onChange={(v, data, name) => this.changeInput(v, name) } />个；
					多体<Input style={{width: '70px', margin: '0 6px'}} name='cep8_multi' value={forms.cep8_multi} onChange={(v, data, name) => this.changeInput(v, name) } />个。
				</div>
				<div className='fxw xm mb10'>
					<span >探针B：</span>
					三体<Input style={{width: '70px', margin: '0 6px'}} name='cep7_3' value={forms.cep7_3} onChange={(v, data, name) => this.changeInput(v, name) } />个；
					四体<Input style={{width: '70px', margin: '0 6px'}} name='cep7_4' value={forms.cep7_4} onChange={(v, data, name) => this.changeInput(v, name) } />个；
					多体<Input style={{width: '70px', margin: '0 6px'}} name='cep7_multi' value={forms.cep7_multi} onChange={(v, data, name) => this.changeInput(v, name) } />个。
				</div>
				<div className='fxw xm mb10'>
					<span >探针A+B：</span>
					三体<Input style={{width: '70px', margin: '0 6px'}} name='cep17_3' value={forms.cep17_3} onChange={(v, data, name) => this.changeInput(v, name) } />个；
					四体<Input style={{width: '70px', margin: '0 6px'}} name='cep17_4' value={forms.cep17_4} onChange={(v, data, name) => this.changeInput(v, name) } />个；
					多体<Input style={{width: '70px', margin: '0 6px'}} name='cep17_multi' value={forms.cep17_multi} onChange={(v, data, name) => this.changeInput(v, name) } />个。
				</div> 
				<Title title='检测结果（必填）' />
				<Input name='result' key={keys} size='middle' mode='textarea' bordered={false} value={forms.result} onChange={(v, data, name) => this.changeInput(v, name) } />
			</BoxScroll>
		)
	} 
}