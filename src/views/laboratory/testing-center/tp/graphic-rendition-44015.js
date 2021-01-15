import React from 'react'
// ===================================================================== common
import ts from '@views/laboratory/testing-center/tp/common.js' 
// ===================================================================== global declare
const { $async, $fn, $http } = window
// ===================================================================== antd
const Input = $async(()=>import('@antd/form/input')) 
const Checkbox = $async(()=>import('@antd/form/checkbox')) 
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
const InputTitle = ({ title, titleChildren }) => (
	<div className='fx mt10 plr10'>
		<span style={{width: '80px'}}>{title}：</span>
		<div className='ex'>{titleChildren}</div>
	</div>
) 
// ===================================================================== component  
export default class extends React.Component{
	state = {
		forms: {}, // 要提交的数据
		infos: {}, // 详情
		model: {
			checked0: false,
			checked1: false,
		},
		flow0: true,
		flow1: false,
		flow2: false,
		operation_44015: 'FL104210000',
		keys: 0
	} 
	componentDidMount () {
		this.setForms() 
	}
	componentWillReceiveProps ({infos}) { 
		this.setState({infos: infos})
		this.setProcess(infos.operation_44015)
		this.setState({operation_44015: infos.operation_44015})
		this.setForms(infos.content)
	}
	setForms = (v) => { 
		const { forms, keys } = this.state
		if ($fn.hasObject(v)) {  
			forms.imgs = v.imgs || []
			forms.report_form_imgs = v.report_form_imgs || ''
			forms.vaccinate_real_name = v.vaccinate_real_name || ''
			forms.vaccinate_at = v.vaccinate_at || ''
			forms.harvest_real_name = v.harvest_real_name || ''
			forms.harvest_at = v.harvest_at || ''
			forms.take_level = v.take_level || ''
			forms.preliminary_result = v.preliminary_result || ''
			forms.count_cells = v.count_cells || ''
			forms.analyze_cells = v.analyze_cells || ''
			forms.shoot_cells = v.shoot_cells || ''
			forms.test_diagnosis = v.test_diagnosis || ''
			forms.result_interpretation = v.result_interpretation || ''
			forms.other_tests = v.other_tests || ''
			this.setState({forms: {...v, ...forms}, keys: keys + 1})
		} else { 
			forms.imgs = []
			forms.report_form_imgs = ''
			forms.vaccinate_real_name = ''
			forms.vaccinate_at = ''
			forms.harvest_real_name = ''
			forms.harvest_at = ''
			forms.take_level = ''
			forms.preliminary_result = ''
			forms.count_cells = ''
			forms.analyze_cells = ''
			forms.shoot_cells = ''
			forms.test_diagnosis = ''
			forms.result_interpretation = ''
			forms.other_tests = ''
			this.setState({forms: forms, keys: keys + 1})
		} 
	} 
	changeInput = (v, name) => ts.changeInput.call(this, v, name)
	changeCheckbox = (v, name) => {
		const { model } = this.state
		model[name] = v[name]
		this.setState({model}) 
	}
	submits = () => {
		const { infos, model, operation_44015 } = this.state
		if (!$fn.hasObject(infos)) { return message.then(f => f.default.error('请选择一条列表数据')) }  
		switch (operation_44015) {
			case "FL104210000":
				if (!model.checked0) { return message.then(f => f.default.error('请勾选接种完成')) } 
				this.submits1(operation_44015)
			break;
			case "FL104210001":
				if (!model.checked1) { return message.then(f => f.default.error('请勾选收获完成')) } 
				this.submits1(operation_44015)
			break;
			case "FL104210002": 
				this.submits1(operation_44015)
			break;
			default:
				message.then(f => f.default.error(`提交失败，没有${infos.operation_44015}这个流程`))
			break;
		} 
	} 
	submits1(val) {
		const { forms, infos } = this.state
		let content = ts.setNullParameter(forms); 
		content.operation_44015 = val
		const _content = $fn.getObjectParam('content', content)
		let param = {
			uuid: infos.uuid,
			dmodel: ts.getPath().id,
			..._content, 
		} 
		$http.submit(null,'result-unit-item/update', { param: param, successText: '操作成功'}).then(data => {
			this.setForms(data.content) 
			this.setoperation_44015(val)
		}) 
	}
	// 判断流程节点位置
	setProcess = (process) => { 
		switch (process) {
			case "FL104210000": 
				this.setState({
					model: {checked0: false, checked1: false},
					flow0: true, flow1: false, flow2: false
				})
				break;
			case "FL104210001": 
				this.setState({
					model: {checked0: true, checked1: false},
					flow0: true, flow1: true, flow2: false
				})
				break;
			case "FL104210002": 
				this.setState({
					model: {checked0: true, checked1: true},
					flow0: true, flow1: true, flow2: true
				})
				break;
			default: 
				this.setState({
					model: {checked0: false, checked1: false},
					flow0: true, flow1: false, flow2: false
				})
				break;
		}
	} 
	// 设置流程节点
    setoperation_44015(val) {
		switch (val) {
		  case "FL104210000": 
			this.setState({operation_44015: 'FL104210001'}, () => this.setProcess(this.state.operation_44015))
			break;
		  case "FL104210001": 
			this.setState({operation_44015: 'FL104210002'}, () => this.setProcess(this.state.operation_44015))
			break;
		  case "FL104210002": 
			this.setState({operation_44015: 'FL104210002'}, () => this.setProcess(this.state.operation_44015))
			break;
		  default: 
			this.setState({operation_44015: 'FL104210000'}, () => this.setProcess(this.state.operation_44015))
			break;
		}
	}
	render () {
		const { forms, infos, model, keys } = this.state  
		return (
			<BoxScroll 
				key         = {keys}
				className	= 'fv' 
				title		= '实验结果'
				style		= {{width:350}}
				titleChildren = {
					<div className='fxm' >
						<Button label='保存' className='ml10' onClick={() => this.submits()} />
					</div>
				} 
			>  
				{ $fn.hasObject(infos) && infos.is_coll_pic === '1' 			&& <UploadImg name='imgs' value={forms.imgs} handleChange={(v, name) => this.changeInput(v, name)} /> } 
				{ $fn.hasObject(infos) && infos.is_upload_report_form === '1' 	&& <UploadReport name='report_form_imgs' value={forms.report_form_imgs} handleChange={(v, name) => this.changeInput(v, name)}/> }
				{
					this.state.flow0 &&
					<>
						<Title title='接种' />
						<Checkbox name='checked0' value={model.checked0} disabled={this.state.flow1} onChange={(v, name) => this.changeCheckbox(v, name)} label='是否接种完成' />
					</>
				}
				{
					this.state.flow1 &&
					<>
						<Title title='收获' /> 
						<Checkbox name='checked1' value={model.checked1} disabled={this.state.flow2} onChange={(v, name) => this.changeCheckbox(v, name)} label='是否收获完成' />
					</>
				} 
				{
					this.state.flow2 &&
					<>
						<Title title='结果' /> 
						<InputTitle title='接种人' titleChildren={
							<Input name='vaccinate_real_name' disabled bordered={false} value={forms.vaccinate_real_name} onChange={(v, data, name) => this.changeInput(v, name) } />
						} /> 
						<InputTitle title='接种时间' titleChildren={
							<Input name='vaccinate_at' disabled bordered={false} value={forms.vaccinate_at} onChange={(v, data, name) => this.changeInput(v, name) } />
						} /> 
						<InputTitle title='收获人' titleChildren={
							<Input name='harvest_real_name' disabled bordered={false} value={forms.harvest_real_name} onChange={(v, data, name) => this.changeInput(v, name) } />
						} /> 
						<InputTitle title='收获时间' titleChildren={
							<Input name='harvest_at' disabled bordered={false} value={forms.harvest_at} onChange={(v, data, name) => this.changeInput(v, name) } />
						} /> 
						<InputTitle title='条带水平' titleChildren={
							<Input name='take_level' bordered={false} value={forms.take_level} onChange={(v, data, name) => this.changeInput(v, name) } />
						} /> 
						<InputTitle title='初步结果' titleChildren={
							<Input name='preliminary_result' mode='textarea' bordered={false} value={forms.preliminary_result} onChange={(v, data, name) => this.changeInput(v, name) } />
						} /> 
						<InputTitle title='记数细胞数' titleChildren={
							<Input name='count_cells' bordered={false} value={forms.count_cells} onChange={(v, data, name) => this.changeInput(v, name) } />
						} /> 
						<InputTitle title='分析细胞数' titleChildren={
							<Input name='analyze_cells' bordered={false} value={forms.analyze_cells} onChange={(v, data, name) => this.changeInput(v, name) } />
						} /> 
						<InputTitle title='拍摄细胞数' titleChildren={
							<Input name='shoot_cells' bordered={false} value={forms.shoot_cells} onChange={(v, data, name) => this.changeInput(v, name) } />
						} /> 
						<InputTitle title='检验诊断' titleChildren={
							<Input name='test_diagnosis' mode='textarea' bordered={false} value={forms.test_diagnosis} onChange={(v, data, name) => this.changeInput(v, name) } />
						} /> 
						<InputTitle title='结果解释' titleChildren={
							<Input name='result_interpretation' mode='textarea' bordered={false} value={forms.result_interpretation} onChange={(v, data, name) => this.changeInput(v, name) } />
						} />  
						<p className='g9 lh20'>(使用向下" ↓ "箭头自动搜索)</p>
						<InputTitle title='建议其他检测' titleChildren={
							<Input name='other_tests' mode='textarea' bordered={false} value={forms.other_tests} onChange={(v, data, name) => this.changeInput(v, name) } />
						} /> 
					</>
				}   
			</BoxScroll>
		)
	} 
}