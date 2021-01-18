import React from 'react'
// ===================================================================== common
import ts from '@views/laboratory/testing-center/tp/common.js' 
// ===================================================================== antd
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $async, $fn, $http } = window
// ===================================================================== 缓存
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== antd
const Input = $async(()=>import('@antd/form/input')) 
const Radio = $async(()=>import('@antd/form/radio'))
const Select = $async(()=>import('@antd/form/select'))  
const message = import('@antd/message') 
// ===================================================================== component
const Button = $async(()=>import('@antd/button'))
const BoxScroll = $async(()=>import('#tp/box/box-scroll'))
const UploadImg = $async(()=>import('./upload-img'))
const UploadReport = $async(()=>import('./upload-report'))
const PrimaryTitle = $async(()=>import('#tp/title')) 
const Table = $async(()=>import('#cpt/table')) 
const SubmitForm = $async(()=>import('#cpt/submit-form')) 

// ===================================================================== component
const Title = ({ title, titleChildren }) => (
	<h3 className='fxm h30'><i className='r100px mr5' style={{width:5,height:5,background:'#333'}}></i><span>{title}</span><div className='ex tr'>{titleChildren}</div></h3>
) 
// ===================================================================== component  
export default class extends React.Component{
	state = {
		forms: {}, // 要提交的数据
		infos: {}, // 详情 
		keys: 0,
		group_idOption: [],
		data: [],
		model: {
			checked0: false,
			checked1: false,
			checked2: false,
		},
		flow0: false,
		flow1: true, 
		operation_44011: "FL1000810000",
		first_check: '',
		resultData: [], 
		submit1: [ // 终止初次报告
			{ label:'异常原因类型', 	name:'abnormal_type',	type: 'select', data: [] },
			{ label:'原因', 			name:'reason',			type: 'textarea', full:true, width:'100%' } 
		],
	} 
    checkOption = [ 
		{codeName: '阳性', 	id: '1'}, 
		{codeName: '阴性', 	id: '2'} 
	] 
	cols = [
		{ title: '名称', 				field: 'drug_name', 		width:80 },
		{ title: 'MIC', 				field: 'mic', 				width:80, render: ({rows, index}) => {
			return <Input name='mic' width='100%' value={rows.mic} onChange={(v, data, name) => this.onChanges(v, name, rows, index) } />  
		} },
		{ title: 'K-B', 				field: 'kb', 				width:80, render: ({rows, index}) => {
			return <Input name='kb' width='100%' value={rows.kb} onChange={(v, data, name) => this.onChanges(v, name, rows, index) } />  
		} },
		{ title: '结果', 				field: 'result', 			width:100, render: ({rows, index}) => {
			return <Select name='result' data={this.state.resultData} nameStr='name' idStr='value' value={rows.result}  onChanged={(v, data, name) => this.onChanges(v, name, rows, index)} width='100%' />
		} },
	]    
	componentDidMount () {
		this.setForms() 
		const { submit1 } = this.state
		cacheApi.then(f => {
			$fn.getCache({
				cache: f.default.group_id_optionSelect, name: 'name', id: 'value', callback: (data) => { 
					if ($fn.hasArray(data)) { 
						this.setState({group_idOption: data})
                    } else {
                        $http.submit(null, 'drug-group/select').then(data => {
							this.setState({group_idOption: data})
							$fn.setCache()
                        })
                    }
				} 
			})
		})
		$fn.dataSave('dis-item-65000-data').then(local => {
			if($fn.hasArray(local)){ 
			  this.setState({resultData: local})
			}else{
			  	$http.submit(this,'dis-item/item', { param: {dis_code: 65000}}).then(data=>{
					$fn.dataSave('dis-item-65000-data', data)
			  		this.setState({resultData: data})
				})
			}
		}) 
		$fn.dataSave('dis-item-62050-data').then(local => { // 异常原因类型
			if($fn.hasArray(local)){ 
			submit1[0].data = local 
			}else{
			  $http.submit(null,'dis-item/item', { param:{dis_code:62050}, loading:false}).then(data=>{
				submit1[0].data = data 
				$fn.dataSave('dis-item-62050-data', data)
			  }) 
			}
		})  
	} 
	componentWillReceiveProps ({infos}) { 
		this.setState({infos: infos, operation_44011: infos.operation_44011, first_check: $fn.hasObject(infos.content) ? infos.content.first_check : ''})
		this.setProcess(infos.operation_44011, infos.content) 
		this.setForms(infos.content)
	}
	setForms = (v) => {  
		const { forms } = this.state
		if ($fn.hasObject(v)) {   
			forms.imgs = v.imgs || []
			forms.report_form_imgs = v.report_form_imgs || ''  
			forms.first_check = v.first_check || ''  
			forms.first_suggestion_name = v.first_suggestion_name || ''  
			forms.first_result = v.first_result || ''  
			forms.check = v.check || ''  
			forms.result_suggestion_name = v.result_suggestion_name || ''  
			forms.result = v.result || ''  
			forms.count = v.count || ''  
			forms.dis_code = v.dis_code || ''   
			forms.is_first_report_audit = v.is_first_report_audit || ''  
			forms.drug_table = $fn.hasArray(v.drug_table) ? v.drug_table : [] 
			this.setState({forms: forms, data: forms.drug_table })  
		} else { 
			forms.imgs = []
			forms.report_form_imgs = ''  
			forms.first_check = ''  
			forms.first_suggestion_name = ''  
			forms.first_result = ''  
			forms.check = ''  
			forms.result_suggestion_name = ''  
			forms.result = ''  
			forms.count = ''  
			forms.dis_code = ''
			forms.is_first_report_audit = ''  
			forms.drug_table = []
			this.setState({forms: forms, data: []})  
		}
	}   
	onChanges (v, name, rows, index) {     
		const { data } = this.state 
		data[index][name] = $fn.hasObject(v) ? v[name] : ''
		this.setState({data: data}, () => {
			console.log(data)
		})    
    }
	changeInput = (v, name, callback) => ts.changeInput.call(this, v, name, callback) 
	submits = () => {
		const { infos, model, operation_44011 } = this.state
		if (!$fn.hasObject(infos)) { return message.then(f => f.default.error('请选择一条列表数据')) }  
		if (operation_44011 !== 'FL1000810000' && operation_44011 !== 'FL1000810001') { return message.then(f => f.default.error(`提交失败，没有${operation_44011}这个流程`)) }
		this.submits1(operation_44011)  
	}   
	submits1 = (val) => {
		const { forms, infos } = this.state
		let content = ts.setNullParameter(forms); 
		content.operation_44011 = val
		content.drug_table = this.state.data 
		const _content = $fn.getObjectParam('content', content)
		let param = {
			uuid: infos.uuid,
			dmodel: ts.getPath().id,
			..._content, 
		} 
		$http.submit(null,'result-unit-item/update', { param: param, successText: '操作成功'}).then(data => {
			const newContent = JSON.parse(data.content)
			this.setForms(newContent)
			this.setoperation_44011(val, newContent)  
			this.setState({infos: infos, first_check: newContent.first_check})
		})  
	}
	// 审核初次报告
	auditFirstReport() {
		const { infos, forms } = this.state
		let param = {
			uuid: infos.uuid,
			result_model: ts.getPath().id,
			status: infos.status
		}
		$http.submit(null,'ts-report-card/firstreport', { param: param, successText: '操作成功'}).then(data => { 
			infos.content.is_first_report_audit = data && data[0]
			forms.is_first_report_audit = data && data[0]
			this.setState({infos, forms }, () => this.setProcess(this.operation_44011, infos.content))
		})   
	}
	// 批准初次报告
	approveFirstReport() {
		const { infos, forms } = this.state
		const param = {
			report_num: infos.spec_num,
			report_num: forms.is_first_report_audit ? forms.is_first_report_audit : infos.spec_num,
			uuid: infos.uuid
		}
		$http.submit(null,'ts-report-card/firstapprove', { param: param, successText: '操作成功'})   
	}
	onChangeForms = (value, name ) => {  
        const { forms } = this.state
        forms[name] = value
        this.setState({forms})   
	} 
	// 判断流程节点位置
	setProcess = (process, content) => {   
		switch (process) {
			case "FL1000810000":
				this.setState({flow0: false, flow1: true }) 
			  	break;
			case "FL1000810001": 
			  	this.setState({flow0: $fn.hasObject(content) && content.is_first_report_audit ? true : false, flow1: false}) 
			  	break; 
			default:  
				this.setState({flow0: true, flow1: true }) 
				break;
		  }
	}  
	// 设置流程节点 
    setoperation_44011(val, content) { 
		switch (val) {
			case "FL1000810000":
				this.setState({operation_44011: 'FL1000810001'}, () => this.setProcess(this.state.operation_44011, content))
			  	break;
			case "FL1000810001":
				this.setState({operation_44011: 'FL1000810001'}, () => this.setProcess(this.state.operation_44011, content))
			  	break; 
			default:
				this.setState({operation_44011: 'FL1000810000'}, () => this.setProcess(this.state.operation_44011, content))
				break;
		} 
	}
	// 获取药敏组合下的药敏列表
	addData (v, name) {  
		const d = this.state.group_idOption.filter(i => i.value === v[name])
		if (!$fn.hasArray(d)) { return false } 
	  	const param = {
			group_id: d[0].value,
			group_num: d[0].group_num
		} 
		$http.pull(null,'drug-sensitivity/senslist',{dataName:null, param: param}).then(data=>{
			// let newArr = this.state.data;
			// data.forEach(item => {
			// 	if (this.filterData(this.state.data, 'uuid', item.uuid)) {
			// 		newArr.push(item)
			// 	}
			// })  
			// this.setState({data: newArr})
			let arr = [...this.state.data, ...data]; 
			var obj = {};
			let newArr = arr.reduce((item, next) => {
			   if (!obj[next.uuid]) {
					obj[next.uuid] = true
					item.push(next)
			   } 
			   return item;
			}, []);
			this.setState({data: newArr})
		}).catch(res => {
			message.then(f => f.default.error(res.msg))
		})  
	}
	filterData = (data, name, value) => {
		let v = data.filter(j => j[name] === value) 
		return $fn.hasArray(v) ? false : true
	}
	render () {
		const { forms, infos, keys, group_idOption, data } = this.state  
		const { width } = this.props
		return (
			<BoxScroll 
				className	= 'fv' 
				title		= '检验结果'
				style		= {{width: width ? width : 350}}
				titleChildren = {
					<div className='fxm' > 
						<Button label='保存' ghost className='ml10' onClick={() => this.submits()} />
						{this.state.first_check && $fn.isEmpty(forms.is_first_report_audit) && <Button label='审核初次报告' onClick={() => this.auditFirstReport()} ghost className='ml10' />} 
						{forms.is_first_report_audit && 
						<>
							<Button label='批准初次报告' onClick={() => this.approveFirstReport()} ghost className='ml10' />
							<Button label='终止初次报告' ghost className='ml10' onClick={() => this.refs.modal.open()} />
							<Button label='预览初次报告单' ghost className='ml10' />
						</>
						}
					</div>
				} 
			>   
				{ $fn.hasObject(infos) && infos.is_coll_pic === '1' 			&& <UploadImg name='imgs' value={forms.imgs} handleChange={(v, name) => this.changeInput(v, name)} /> } 
				{ $fn.hasObject(infos) && infos.is_upload_report_form === '1' 	&& <UploadReport name='report_form_imgs' value={forms.report_form_imgs} handleChange={(v, name) => this.changeInput(v, name)}/> } 
				<div className='fx'>
					<div className='radio-style ex'>
						<PrimaryTitle title='初步报告' style={{border: 'none'}} />
						<Radio optionType='default' disabled={this.state.flow0} onChange={e => this.onChangeForms(e.target.value, 'first_check')} data={this.checkOption} value={forms.first_check} />
						<Title title='建议与解释' />
						<Input name='first_suggestion_name' disabled={this.state.flow0} size='middle' mode='textarea' bordered={false} value={forms.first_suggestion_name} onChange={(v, data, name) => this.changeInput(v, name) } />
						<p className='g9 lh20'>(使用向下" ↓ "箭头自动搜索)</p>
						<Title title='结果' />
						<Input name='first_result' disabled={this.state.flow0} size='middle' mode='textarea' bordered={false} value={forms.first_result} onChange={(v, data, name) => this.changeInput(v, name) } />
						<p className='g9 lh20'>(使用向下" ↓ "箭头自动搜索)</p>
					</div>  
					{this.state.flow0 && 
						<div style={{width: '50%', marginLeft: '20px'}}>
							<PrimaryTitle title='最终报告' style={{border: 'none'}} />
							<Radio optionType='default' onChange={e => this.onChangeForms(e.target.value, 'check')} data={this.checkOption} value={forms.check} />
							<Title title='建议与解释' />
							<Input name='result_suggestion_name' size='middle' style={{height: '50px'}} mode='textarea' bordered={false} value={forms.result_suggestion_name} onChange={(v, data, name) => this.changeInput(v, name) } />
							<p className='g9 lh20'>(使用向下" ↓ "箭头自动搜索)</p>
							<Title title='结果' />
							<Input name='result' size='middle' mode='textarea' style={{height: '50px'}} bordered={false} value={forms.result} onChange={(v, data, name) => this.changeInput(v, name) } />
							<p className='g9 lh20'>(使用向下" ↓ "箭头自动搜索)</p>  
							<div className='fxm'>
								<span>菌落计数：</span>
								<Input className='ex' name='count' size='middle' bordered={false} value={forms.count} onChange={(v, data, name) => this.changeInput(v, name) } />
							</div>
							<div className='fxm mt10'>
								<span>药敏组合：</span>
								<Select className='ex' name='dis_code' size='middle' bordered={false} data={group_idOption} p='请选择' nameStr='name' idStr='value' value={forms.dis_code} 
								onChanged={(v, data, name) => this.changeInput(v, name, () => this.addData(v, name))} />
							</div> 
							<Table
								className		= 'mt10'
								cols			= { this.cols }
								data 			= { data } 
							/> 
						</div>
					}
				</div> 
				<Modal ref='modal' title='终止初次报告' width={648} noFooter>
					<SubmitForm
						modal
						data = { this.state.submit1 }
						onSubmit = { v => {   
							let param = { ...v, uuid: infos.uuid, project_id: ts.getPath().project_id};
							$http.submit(null, 'ts-report-card/firststop', { param: param, onSuccess: () => {
								message.then(f=>f.default.success('操作成功'))
								this.refs.modal.close() 
							} })  
						}}
						onClose = { ()=>this.refs.modal.close() }
					 />
				</Modal>
			</BoxScroll>
		)
	} 
}