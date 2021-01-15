import React from 'react'
// ===================================================================== common
import ts from '@views/laboratory/testing-center/tp/common.js' 
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $async, $fn, $http } = window
// ===================================================================== 缓存
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== antd
const Select = $async(()=>import('@antd/form/select'))  
const Input = $async(()=>import('@antd/form/input')) 
const message = import('@antd/message') 
const Checkbox = $async(()=>import('@antd/form/checkbox'))
const DatePicker = $async(()=>import('@antd/form/datePicker'))
// ===================================================================== component
const Button = $async(()=>import('@antd/button'))
const Table = $async(()=>import('#cpt/table')) 
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
		fixedOption: [],
		keys: 0,
		materialsDocOption: [],
		recordIdOption: [],
		codeSelect: [], // 选中
		codeChecked: false, // 全选状态
		chargeData: []
	} 
	chargeCols = [
		{ title: '名称', 			field: 'item_name', 		width:120 },
		{ title: '参考价', 			field: 'price', 			width:100 },
	]
	componentDidMount () {
		this.setForms()
		cacheApi.then(f => {
			$fn.getCache({
				cache: f.default.drawMaterialsSelect, name: 'name', id: 'value', callback: (data) => {
					this.setState({data: data})
					if ($fn.hasArray(data)) { 
						this.setState({materialsDocOption: data})
                    } else {
                        $http.submit(null, 'employee/drawMaterialsSelect').then(data => {
							this.setState({materialsDocOption: data})
							$fn.setCache()
                        })
                    }
				},
				cache: f.default.recordIdSelect, name: 'name', id: 'value', callback: (data) => {
					this.setState({data: data})
					if ($fn.hasArray(data)) { 
						this.setState({recordIdOption: data})
                    } else {
                        $http.submit(null, 'employee/recordIdSelect').then(data => {
							this.setState({recordIdOption: data})
							$fn.setCache()
                        })
                    }
				}
			})
		})
		$fn.dataSave('dis-item-50200-data').then(local => {
			if($fn.hasArray(local)){ 
			  this.setState({fixedOption: local})
			}else{
			  $http.submit(this,'dis-item/item', { param: {dis_code: 50200}}).then(data=>{ 
				this.setState({fixedOption: data})
				$fn.dataSave('dis-item-50200-data', data)
			  })
			}
		})
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
			forms.clinical_diagnosis = v.clinical_diagnosis || ''
			forms.naked_eye = v.naked_eye || ''
			forms.pathology = v.pathology || ''
			forms.pathological_diagnosis = v.pathological_diagnosis || ''
			forms.send_material = v.send_material || ''
			forms.fees = v.fees || ''
			forms.ts_approve_id = v.ts_approve_id || ''
			forms.wax_block_number = v.wax_block_number || ''
			forms.fixed = v.fixed || ''
			forms.fixed_time = v.fixed_time || ''
			forms.imgs = v.imgs || ''
			forms.report_form_imgs = v.report_form_imgs || ''
			forms.time = v.time || ''
			forms.visit_doctor_id = v.visit_doctor_id || ''
			forms.return_visit_doctor_id = v.return_visit_doctor_id || ''
			forms.draw_materials_doctor_id = v.draw_materials_doctor_id || ''
			forms.record_id = v.record_id || ''
			forms.in_vitro_time = v.in_vitro_time || ''
			this.setState({forms})
		} else {
			forms.clinical_diagnosis = ''
			forms.naked_eye = ''
			forms.pathology = ''
			forms.pathological_diagnosis = ''
			forms.send_material = ''
			forms.fees = ''
			forms.ts_approve_id = ''
			forms.wax_block_number = '1'
			forms.fixed = ''
			forms.fixed_time = ''
			forms.imgs = ''
			forms.report_form_imgs = ''
			forms.time = this.setDate()
			forms.visit_doctor_id = ''
			forms.return_visit_doctor_id = ''
			forms.draw_materials_doctor_id = ''
			forms.record_id = ''
			forms.in_vitro_time = ''
			this.setState({forms})
		}
	}  
	changeInput = (v, name) => ts.changeInput.call(this, v, name) 
	submits = () => {
		const { infos, forms } = this.state
		if (!$fn.hasObject(infos)) { return message.then(f => f.default.error('请选择一条列表数据')) }
		let content = ts.setNullParameter(forms);
		const _content = $fn.getObjectParam('content',{...content, qt_item_table: []})
		let param = {
		  uuid: infos.uuid,
		 ..._content,
		  dmodel: ts.getPath().id,
		  project_id: ts.getPath().project_id,
		  status: this.props.status,
		};
		$http.submit(null,'result-unit-item/update', { param: param, successText: '操作成功'})
	}  
	onChanges = (v) => {
		const {forms} = this.state  
		let d = Object.assign(forms, v)  
		this.setState({forms: d})  
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
    setDate = () => {
		let date = new Date();
		let nowDate =
			date.getFullYear() +
			"-" +
			(date.getMonth() + 1 > 9
			? date.getMonth() + 1
			: "0" + (date.getMonth() + 1)) +
			"-" + 
			(date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
			" " +
			(date.getHours() > 9 ? date.getHours() : "0" + date.getHours()) +
			":" +
			(date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()) +
			":" +
			(date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds());
		return nowDate;
	}
	render () {
		const { forms, infos, keys, immuneOption, chargeData } = this.state  
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
						<div className='fx'>
							<div style={{width: '50%', marginRight: '10px'}}>
								<Title title='固定时间' />
								<DatePicker name='fixed_time' size='middle' showTime value={forms.fixed_time} bordered={false} after={true} onChange={(v) => this.onChanges(v) } />
							</div>
							<div style={{width: '50%'}}>
								<Title title='离体时间' />
								<DatePicker name='in_vitro_time' size='middle' showTime value={forms.in_vitro_time} bordered={false} after={true} onChange={(v) => this.onChanges(v) } />
							</div>
						</div> 
						<Title title='送检材料' />
						<Input name='send_material' size='middle' bordered={false} value={forms.send_material} onChange={(v, data, name) => this.changeInput(v, name) } />
						<Title title='临床诊断' />
						<Input name='clinical_diagnosis' size='middle' bordered={false} value={forms.clinical_diagnosis} onChange={(v, data, name) => this.changeInput(v, name) } />
						<Title title='肉眼所见' titleChildren={
							<Button label='打印' ghost className='ml10' />
						} />
						<Input name='naked_eye' size='middle' mode='textarea' bordered={false} value={forms.naked_eye} onChange={(v, data, name) => this.changeInput(v, name) } />
						<p className='g9 lh20'>(使用向下" ↓ "箭头自动搜索)</p>
						<div className='fx'>
							<div style={{width: '50%', marginRight: '10px'}}>
								<Title title='固定情况' />
								<Select name='fixed' size='middle' data={this.state.fixedOption} p='请选择' bordered={false} nameStr='name' idStr='value' value={forms.fixed} onChanged={(v, name) => this.changeInput(v, name)} />
								<Title title='取材医生' />
								<Select name='draw_materials_doctor_id' size='middle' data={this.state.materialsDocOption} p='请选择' bordered={false} nameStr='name' idStr='value' value={forms.draw_materials_doctor_id} onChanged={(v, name) => this.changeInput(v, name)} />
								<Title title='收费' titleChildren={
									<Button label='收费' ghost className='ml10' />
								} />
								<Input name='fees' size='middle' disabled bordered={false} value={forms.fees} onChange={(v, data, name) => this.changeInput(v, name) } />
							</div>
							<div style={{width: '50%'}}>
								<Title title='蜡块数量' />
								<Input name='wax_block_number' size='middle' disabled bordered={false} value={forms.wax_block_number} onChange={(v, data, name) => this.changeInput(v, name) } />
								<Title title='记录人' />
								<Select name='record_id' size='middle' data={this.state.recordIdOption} p='请选择' bordered={false} nameStr='name' idStr='value' value={forms.record_id} onChanged={(v, name) => this.changeInput(v, name)} />
								<Title title='时间' />
								<DatePicker name='time' size='middle' showTime value={forms.time} after={true} bordered={false} onChange={(v) => this.onChanges(v) } />
							</div>
						</div>  
						<Table 
							className 		= 'mt10'
							cols			= { this.chargeCols }
							data 			= { chargeData }  
						/> 
					</div>
					<div style={{width: '50%', marginLeft: '20px'}}>
						{ $fn.hasObject(infos) && infos.is_coll_pic === '1' 			&& <UploadImg name='imgs' value={forms.imgs} handleChange={(v, name) => this.changeInput(v, name)} /> } 
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