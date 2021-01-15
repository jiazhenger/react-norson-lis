import React from 'react'
// ===================================================================== antd
import { Image } from 'antd'  
// ===================================================================== common
import Input from '@antd/form/input'
// ===================================================================== global declare
const { $http, $fn, $async } = window
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// ===================================================================== global antd
const Select = $async(()=>import('@antd/form/select')) 
// const Input = $async(()=>import('@antd/form/input'))
const Checkbox = $async(()=>import('@antd/form/checkbox'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const ProjectDetails = $async(()=>import('./project-details'))
const BatchCode = $async(()=>import('./batch-code'))
const Title = $async(()=>import('#tp/title'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data: {},  
		forms: {
			enabled: '',
			box_number: '',
			hosp_name: '',
			additional_kind: '',
			is_review: '',
			is_batch: '',
			quick_entry_flag: '',
			memory_project_flag: '',
			spec_code: '',
			uuid: '',
			image: ''
		}, 
		boxSelect: [],
		projectOption: [], 
		speceDataInfo: {}, // 生成条码的信息
		speceDataList: [], // 生成条码的列表
		keys: 0
	} 
	isAudit = $fn.query('isAudit') || false // 是否录入项目/审核项目
	view_pic = $fn.query('view_pic') || 0 // 是否显示有图
	componentDidMount(){  
		// 标本箱号
		$fn.dataSave('box-select-data').then(local => {
			if($fn.hasArray(local)){
				console.log(local)
			  this.setState({boxSelect: local})
			}else{
			  $http.submit(null,'box/select', {dataName:null, param: {limit: 500, status: 83}}).then(data=>{ 
				this.setState({boxSelect: data.items})
				$fn.dataSave('box-select-data', data.items)
			  })
			}
		}) 
        cacheApi.then(f => {
            const d = f.default
			$fn.getCache({ 
				cache: d.specimenkindSelect, callback: (data) => {
					if ($fn.hasArray(data)) { 
						this.setState({projectOption: data})
					} else {
						$http.submit(null, 'specimen-kind/selectkind').then(data => {
							this.setState({projectOption: data})
							$fn.setCache()
						})
					}
				}
			})
		})  
	}
	statusOption = [
		{ value: "0", label: "待审核" },
		{ value: "-2", label: "待录入" }
	] 
	modal = {}  
	onChanges = (v) => {   
		// console.log(v) 
		const {forms} = this.state  
		let d = Object.assign(forms, v)  
		this.setState({forms: d}, () => {
			if (Object.keys(v)[0] === 'project_id') {
				this.addProject(v.project_id)
			} 
		})  
	}
	// 选择项目下拉列表样式
	projectSelectRender = (menu) => {
		return (
			<React.Fragment>
				<div>项目名称</div>
				{menu}
			</React.Fragment>
		)
	}
	ButtonGroup = () => { 
		return (
			<div>  
				<Button label='返回' ghost className='ml5' onClick={()=> $fn.back(this) }/> 
				<Button label='保存' ghost className='mlr5' onClick={()=> this.saveSpec() } /> 
				<Button label='审核' ghost className='mlr5' onClick={()=> this.auditSpec() }/> 
				<Button label='退回保存' ghost className='mlr5' onClick={()=> this.saveBack() }/> 
			</div>
		)
	} 
	// 查询
	queryspecimen = () => {
		const { forms, keys } = this.state 
		const param = { 
			spec_code: forms.spec_code,
			additional_kind: forms.additional_kind ? 1 : 0,
			audit: this.isAudit ? 1 : ''
		}
		$http.submit(null, 'specimen/getspeccodeInfo', { param }).then(data => {
			// message.then(f => f.default.success('查询成功')) 
			forms['spec_code'] = data.spec_code
			forms['is_review'] = String(data.is_review) === "1" ? true : false
			forms['additional_kind'] = String(data.additional_kind) === "1" ? true : false
			forms['hosp_name'] = data.hosp_name
			forms['project_special_request'] = data.project_special_request
			forms['image'] = data.image
			forms['project_id'] = ''
			forms['uuid'] = data.uuid
			forms['remark'] = data.remark  
			this.setState({forms: forms, keys: keys + 1})
			// 更新表格-获取项目明细
			let d = {
				spec_id: data.uuid,
				spec_code: data.spec_code
			}
			this.ProjectDetailsRef.getPage(d) 
		})
	}
	// 下一个
	nextSpec = () => {
		const { forms, keys } = this.state
		const param = {
			enabled: forms.enabled ? forms.enabled : this.isAudit ? 0 : -2,
			box_number: forms.box_number || '',
			spec_code: forms.spec_code,
			view_pic: this.view_pic, // 是否仅显示有图片的项目
		}
		$http.submit(null, 'specimen/getnextspeccodeinfo', { param }).then(data => { 
			// message.then(f => f.default.success('查询成功'))  
			forms['spec_code'] = data.spec_code
			forms['is_review'] = String(data.is_review) === "1" ? true : false
			forms['additional_kind'] = String(data.additional_kind) === "1" ? true : false
			forms['hosp_name'] = data.hosp_name
			forms['project_special_request'] = data.project_special_request
			forms['image'] = data.image
			forms['project_id'] = ''
			forms['uuid'] = data.uuid
			forms['remark'] = data.remark   
			this.setState({forms: forms, keys: keys + 1})
			// 更新表格-获取项目明细
			let d = {
				spec_id: data.uuid,
				spec_code: data.spec_code
			}
			this.ProjectDetailsRef.getPage(d)
		})
	} 
	// 选择项目时-传递的参数
	addProject = (value) => {
		const { forms, speceDataInfo } = this.state
		if (forms.uuid) { // 单个查询 
			const param = { 
			  kind_ids: [value],
			  spec_id: forms.uuid,
			  spec_code: forms.spec_code
			}; 
			this.addProjectInterface(param) 
		} else if (forms.start_code && forms.end_code) { // 批量生成 - 这里判断不完整，要判断生成后 
			const param = { 
			  kind_ids: [value],
			  spec_id: speceDataInfo.uuid,
			  spec_code: speceDataInfo.spec_code
			};
			this.addProjectInterface(param) 
		} else { 
			message.then(f => f.default.success('请输入条码信息'))  
		} 
	}
	// 选择项目时-调用的接口
	addProjectInterface = (param) => {
		const { forms, keys } = this.state
		$http.submit(null, 'specimen-kind/batchadd', { param }).then(data => {
			message.then(f => f.default.success('操作成功')) 
			forms['project_id'] = '' // 选择项目后清空选项
			this.setState({forms: forms, keys: keys + 1})  
			const d = {
				spec_id: param.spec_id,
				spec_code: param.spec_code
			};
			this.ProjectDetailsRef.getPage(d) // 更新表格-获取项目明细
		}) 
	}
	// 生成
	generateSpec = () => {
		const { forms } = this.state
		const param = {
			start_code: forms.start_code,
        	end_code: forms.end_code
		}
		$http.submit(null, 'specimen/checkenter', { param }).then(data => { 
			if (Object.keys(data.info).length > 0) { 
				this.BatchCodeRef.getPage(data.res) 
				this.setState({speceDataInfo: data.info, speceDataList: data.res})
				const d = {
					spec_id: data.info.uuid,
					spec_code: data.info.spec_code
				} 
				this.ProjectDetailsRef.getPage(d)
			} else { }
		}) 
	}
	// 保存
	saveSpec = () => {  
		const { forms, speceDataInfo, speceDataList, keys } = this.state
		if (forms.is_batch) { // 批量保存  
			const param = {
				spec_id: speceDataInfo.uuid,
				is_review: forms.is_review ? "1" : "0",
				additional_kind: forms.additional_kind ? "1" : "0",
				remark: forms.remark,
				to_codes: speceDataList.map(i => i.spec_code)
			}; 
			$http.submit(null, 'specimen-kind/savekind', { param }).then(data => {
				message.then(f => f.default.success('保存成功'))
				// 更新表格-获取项目明细
				let d = {
					spec_id: param.spec_id,
					spec_code: speceDataInfo.spec_code
				}
				this.ProjectDetailsRef.getPage(d) 
			}) 
		} else { // 单个保存 
			const param = {
			  spec_id: forms.uuid,
			  is_review: forms.is_review ? "1" : "0",
			  additional_kind: forms.additional_kind ? "1" : "0",
			  remark: forms.remark
			};
			this.saveSpecInterface(param)
		} 
	}
	// 单个保存-接口
	saveSpecInterface = (param) => {
		const { forms, keys } = this.state
		$http.submit(null, 'specimen-kind/savekind', { param }).then(data => {
			message.then(f => f.default.success('保存成功')) 
			// 是否快捷录入
			if (forms.quick_entry_flag) {    
				forms['spec_code'] = ''
				forms['is_review'] = false
				forms['additional_kind'] = false
				forms['hosp_name'] = ''
				forms['project_special_request'] = ''
				forms['image'] = ''
				forms['project_id'] = ''
				forms['uuid'] = ''
				forms['remark'] = ''  
				this.setState({forms: forms, keys: keys + 1})   
				this.SpeceRef.getRef().focus()
				this.ProjectDetailsRef.getPage() 
			} else {   
				// 更新表格-获取项目明细
				let d = {
					spec_id: param.spec_id,
					spec_code: forms.spec_code
				}
				this.ProjectDetailsRef.getPage(d) 
			}  
		})
	}
	// 审核
	auditSpec = () => {
		const { forms, speceDataInfo } = this.state 
	  	const param = {
			spec_id: forms.is_batch ? speceDataInfo.uuid : forms.uuid,
			spec_code: forms.is_batch ? speceDataInfo.spec_code : forms.spec_code,
			is_review: forms.is_review ? "1" : "0",
			additional_kind: forms.additional_kind ? "1" : "0",
			remark: forms.remark,
			status: "1"
		} 
		$http.submit(null, 'specimen/audit', { param }).then(data => {
			message.then(f => f.default.success('审核成功')) 
			this.nextSpec()
		})
	}
	// 退回保存
	saveBack = () => {
		const { forms, speceDataInfo, speceDataList } = this.state
		let param = {}
		if (forms.is_batch) {
		  param = {
			spec_id: speceDataInfo.uuid,
			to_codes: speceDataList.map(i => i.spec_code)
		  }
		} else {
		  param = {
			spec_id: forms.uuid,
			to_codes: []
		  }
		}
		$http.submit(null, 'specimen-kind/backwaitstatus', { param }).then(data => {
			message.then(f => f.default.success('退回保存成功')) 
			if (forms.is_batch) {
				const d = {
					spec_id: speceDataInfo.uuid,
					spec_code: speceDataInfo.spec_code
				};
				this.ProjectDetailsRef.getPage(d) 
			  } else { 
				let d = {
					spec_id: forms.uuid,
					spec_code: forms.spec_code
				} 
				this.queryspecimen()
			  }
		})
	}
	render(){
		const { forms, projectOption, keys, speceDataList } = this.state
		return (
			<Page title={this.isAudit ? '审核项目' : '按条码录入项目'} noBtGroup={true} ButtonGroup={this.ButtonGroup()}> 
				<div className='ex' style={{display: 'block', overflow: 'auto'}} >
					<div className='fxw pt10 pr10 pl10' label='下一个查询条件'>
						<div className='mr10 fxm'> 
						状态：<Select name='enabled' data={this.statusOption} p='请选择状态' nameStr='label' idStr='value' value={forms.enabled} onChanged={(v) => this.onChanges(v)} width={150} />
						</div>
						<div className='mr10 fxm'> 
						标本箱号：<Select name='box_number' data={this.state.boxSelect} p='请选择标本箱号' nameStr='box_code' idStr='name' value={forms.box_number} onChanged={(v) => this.onChanges(v)} width={150} />
						</div>
						<Button label='下一个 —>' ghost className='mr10' onClick={()=> this.nextSpec() }/> 
					</div> 
					<div key={keys} className='p10 fx'>
						<div className='ex pr10'>
							<div className='fxm mb10'>
								<span style={{width: '96px'}}>医院编号/名称：</span> <Input disabled className='ex' name='hosp_name' value={forms.hosp_name} onChange={(v) => this.onChanges(v) } />
							</div> 
							<div className='fxw'> 
								<div className='mb10 fxm' style={{width: '30%'}}>
									<span style={{width: '96px'}}>加做项目：</span> <Checkbox name='additional_kind' value={forms.additional_kind} onChange={(v) => this.onChanges(v) } /> 
								</div>
								<div className='mb10 fxm' style={{width: '30%'}}>
									<span style={{width: '96px'}}>是否复查：</span> <Checkbox name='is_review' value={forms.is_review} onChange={(v) => this.onChanges(v) } /> 
								</div>
								{
									!this.isAudit ? ( 
										<div className='mb10 fxm' style={{width: '30%'}} label='本地操作项，选择批量，显示开始、结束条码号'>
											<span style={{width: '96px'}}>是否批量：</span> <Checkbox name='is_batch' value={forms.is_batch} onChange={(v) => this.onChanges(v) } /> 
										</div>
									) : ''
								}
								<div className='mb10 fxm' style={{width: '30%'}} label='本地操作项，保存后，清空条码号，光标移动到条码号框内'>
									<span style={{width: '96px'}}>是否快捷录入：</span> <Checkbox name='quick_entry_flag' value={forms.quick_entry_flag} onChange={(v) => this.onChanges(v) } /> 
								</div>
								<div className='mb10 fxm' style={{width: '30%'}} label='本地操作项'>
									<span style={{width: '96px'}}>是否记忆项目：</span> <Checkbox name='memory_project_flag' value={forms.memory_project_flag} onChange={(v) => this.onChanges(v) } /> 
								</div> 
							</div> 
							{ 
								forms.is_batch ? (<div className='fxw'> 
									<div className='ex mb10 fxm' >
										<span style={{width: '96px'}}>开始条码号：</span> <Input className='ex' name='start_code' value={forms.start_code} onChange={(v) => this.onChanges(v) } />
									</div>
									<div className='ex mb10 fxm ml10' >
										<span style={{width: '96px'}}>结束条码号：</span> <Input className='ex' name='end_code' value={forms.end_code} onChange={(v) => this.onChanges(v) } />
									</div>
									<Button label='生成' ghost className='ml10' onClick={()=> this.generateSpec() }/> 
								</div>)  : 
								(<div className='fxm mb10'>
									<span style={{width: '96px'}}>条码号：</span> <Input ref={ref => this.SpeceRef = ref} className='ex' name='spec_code' value={forms.spec_code} onChange={(v) => this.onChanges(v) } />
									<Button label='查询' ghost className='ml10' onClick={()=> this.queryspecimen() }/> 
								</div>)
							} 
							<div className='fxm mb10'>
								<span style={{width: '96px'}}>选择项目：</span> 
								<Select className='ex' name='project_id' data={projectOption} dropdownRender={(menu) => this.projectSelectRender(menu)} p='请输入项目名称关键字搜索' nameStr='name' idStr='value' value={forms.project_id} onChanged={(v) => this.onChanges(v)} />
							</div>   
							<div className='fxm mb10 full_w'>
								<span style={{width: '96px'}}>备注：</span> <Input mode='textarea' name='remark' value={forms.remark} onChange={(v) => this.onChanges(v) } />
							</div> 
							<div className='fxm full_w'>
								<span style={{width: '96px'}}>医院特殊要求：</span> <Input mode='textarea' disabled name='project_special_request' value={forms.project_special_request} onChange={(v) => this.onChanges(v) } />
							</div>  
						</div>
						<div className='ex' style={{border: '1px solid #d9d9d9', borderRadius: '4px', height: '368px', overflow: 'auto' }}>
							<Image src={forms.image} className='bor1' />
						</div> 
					</div>
					{
						forms.is_batch ? (<React.Fragment>
							<Title title='批量条码' style={{border: 'none',height: '24px'}}></Title>
							<div style={{height: '250px'}} label='批量录入时显示'>
								<BatchCode onRef={ref => this.BatchCodeRef = ref} changeBatchCode={(v) => {this.setState({speceDataList: v})}} />
							</div>
						</React.Fragment>) : ''
					}
					
					<Title title='项目明细' style={{border: 'none',lineHeight: '24px'}}></Title>
					<div style={{height: '250px'}}>
						<ProjectDetails onRef={ref => this.ProjectDetailsRef = ref} isBatch={forms.is_batch} speceDataList={speceDataList} />
					</div>
				</div>
			</Page>
		)
	}
}