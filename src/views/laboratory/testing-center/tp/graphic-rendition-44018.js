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
			checked2: false,
		},
		flow0: true,
		flow1: false,
		flow2: false,
		flow3: false,
		operation_44018: 'FL1000010000',
		keys: 0
	} 
	componentDidMount () {
		this.setForms() 
	}
	componentWillReceiveProps ({infos}) { 
		this.setState({infos: infos})
		this.setProcess(infos.operation_44018)
		this.setState({operation_44018: infos.operation_44018})
		this.setForms(infos.content)
	}
	setForms = (v) => { 
		const { forms, keys } = this.state
		if ($fn.hasObject(v)) {  
			forms.imgs = v.imgs || []
			forms.report_form_imgs = v.report_form_imgs || ''
			forms.probe_name = v.probe_name || '' 
			forms.analysis_cell_number = v.analysis_cell_number || '' 
			forms.pathological_diagnosis = v.pathological_diagnosis || '' 
			forms.wax_stone = v.wax_stone || '' 
			forms.testing_result_id = v.testing_result_id || '' 
			forms.testing_result = v.testing_result || '' 
			forms.result_suggestion_id = v.result_suggestion_id || '' 
			forms.result_suggestion_name = v.result_suggestion_name || '' 
			forms.result = v.result || '' 
			this.setState({forms: {...v, ...forms}, keys: keys + 1})
		} else { 
			forms.imgs = []
			forms.report_form_imgs = ''
			forms.probe_name = ''
			forms.analysis_cell_number = ''
			forms.pathological_diagnosis = ''
			forms.wax_stone = ''
			forms.testing_result_id = ''
			forms.testing_result = ''
			forms.result_suggestion_id = ''
			forms.result_suggestion_name = ''
			forms.result = '' 
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
		const { infos, model, operation_44018 } = this.state
		if (!$fn.hasObject(infos)) { return message.then(f => f.default.error('请选择一条列表数据')) }  
		switch (operation_44018) {
			case "FL1000010000":
				if (!model.checked0) { return message.then(f => f.default.error('请勾选前处理完成')) } 
				this.submits1(operation_44018)
			break;
			case "FL1000010001":
				if (!model.checked1) { return message.then(f => f.default.error('请勾选杂交完成')) } 
				this.submits1(operation_44018)
			break;
			case "FL1000010002": 
				if (!model.checked2) { return message.then(f => f.default.error('请勾选后处理完成')) } 
				this.submits1(operation_44018)
			break;
			case "FL1000010007":
				this.submits1(operation_44018)
			  	break;
			default:
				message.then(f => f.default.error(`提交失败，没有${operation_44018}这个流程`))
			break;
		}  
	} 
	submits1(val) {
		const { forms, infos } = this.state
		let content = ts.setNullParameter(forms); 
		content.operation_44018 = val
		const _content = $fn.getObjectParam('content', content)
		let param = {
			uuid: infos.uuid,
			dmodel: ts.getPath().id,
			..._content, 
		} 
		$http.submit(null,'result-unit-item/update', { param: param, successText: '操作成功'}).then(data => {
			this.setoperation_44018(val)
		})  
	}
	// 判断流程节点位置
	setProcess = (process) => {  
		switch (process) {
			case "FL1000010000":
				this.setState({
					model: {checked0: false, checked1: false, checked2: false},
					flow0: true, flow1: false, flow2: false, flow3: false
				}) 
			  	break;
			case "FL1000010001": 
			  	this.setState({
					model: {checked0: true, checked1: false, checked2: false},
					flow0: true, flow1: true, flow2: false, flow3: false
				}) 
			  	break;
			case "FL1000010002": 
			 	this.setState({
					model: {checked0: true, checked1: true, checked2: false},
					flow0: true, flow1: true, flow2: true, flow3: false
				}) 
			  	break;
			case "FL1000010007": 
				this.setState({
					model: {checked0: true, checked1: true, checked2: true},
					flow0: true, flow1: true, flow2: true, flow3: true
				}) 
			  	break;
			default:  
				this.setState({
					model: {checked0: false, checked1: false, checked2: false},
					flow0: true, flow1: false, flow2: false, flow3: false
				}) 
				break;
		  }
	} 
	// 设置流程节点 
    setoperation_44018(val) { 
		switch (val) {
			case "FL1000010000":
				this.setState({operation_44018: 'FL1000010001'}, () => this.setProcess(this.state.operation_44018))
			  	break;
			case "FL1000010001":
				this.setState({operation_44018: 'FL1000010002'}, () => this.setProcess(this.state.operation_44018))
			  	break;
			case "FL1000010002": 
				this.setState({operation_44018: 'FL1000010007'}, () => this.setProcess(this.state.operation_44018))
				break;
			case "FL1000010007": 
				this.setState({operation_44018: 'FL1000010007'}, () => this.setProcess(this.state.operation_44018))
				break;
			default:
				this.setState({operation_44018: 'FL1000010000'}, () => this.setProcess(this.state.operation_44018))
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
						<Title title='前处理' />
						<Checkbox name='checked0' value={model.checked0} disabled={this.state.flow1} onChange={(v, name) => this.changeCheckbox(v, name)} label='是否前处理完成' />
					</>
				}
				{
					this.state.flow1 &&
					<>
						<Title title='杂交' /> 
						<Checkbox name='checked1' value={model.checked1} disabled={this.state.flow2} onChange={(v, name) => this.changeCheckbox(v, name)} label='是否杂交完成' />
					</>
				} 
				{
					this.state.flow2 &&
					<>
						<Title title='后处理' /> 
						<Checkbox name='checked2' value={model.checked2} disabled={this.state.flow3} onChange={(v, name) => this.changeCheckbox(v, name)} label='是否后处理完成' />
					</>
				} 
				{
					this.state.flow3 &&
					<>
					 	<Title title='结果' /> 
						<InputTitle title='探针名称：' titleChildren={
							<Input name='probe_name' bordered={false} value={forms.probe_name} onChange={(v, data, name) => this.changeInput(v, name) } />
						} /> 
						<InputTitle title='分析细胞数：' titleChildren={
							<Input name='analysis_cell_number' bordered={false} value={forms.analysis_cell_number} onChange={(v, data, name) => this.changeInput(v, name) } />
						} /> 
						<InputTitle title='病理诊断：' titleChildren={
							<Input name='pathological_diagnosis' mode='textarea' bordered={false} value={forms.pathological_diagnosis} onChange={(v, data, name) => this.changeInput(v, name) } />
						} /> 
						<p className='g9 lh20'>(使用向下" ↓ "箭头自动搜索)</p> 
						<InputTitle title='蜡块/玻片号：' titleChildren={
							<Input name='wax_stone' bordered={false} value={forms.wax_stone} onChange={(v, data, name) => this.changeInput(v, name) } />
						} /> 
						<InputTitle title='结果：' titleChildren={
							<Input name='result' bordered={false} value={forms.result} onChange={(v, data, name) => this.changeInput(v, name) } />
						} /> 
						<InputTitle title='检测结果：' titleChildren={
							<Input name='testing_result' mode='textarea' bordered={false} value={forms.testing_result} onChange={(v, data, name) => this.changeInput(v, name) } />
						} /> 
						<p className='g9 lh20'>(使用向下" ↓ "箭头自动搜索)</p> 
						<InputTitle title='建议与解释：' titleChildren={
							<Input name='result_suggestion' mode='textarea' bordered={false} value={forms.result_suggestion} onChange={(v, data, name) => this.changeInput(v, name) } />
						} /> 
						<p className='g9 lh20'>(使用向下" ↓ "箭头自动搜索)</p> 
					</>
				}   
			</BoxScroll>
		)
	} 
}