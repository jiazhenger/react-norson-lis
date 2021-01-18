import React from 'react'
// ===================================================================== common
import ts from '@views/laboratory/testing-center/tp/common.js'  
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
const Table = $async(()=>import('#cpt/table'))  

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
		resultData: [] 
	} 
    checkOption = [ 
		{codeName: '阳性', 	id: '1'}, 
		{codeName: '阴性', 	id: '2'} 
	] 
	cols = [
		{ title: '名称', 				field: 'drug_name', 		width:80 },
		// { title: 'MIC', 				field: 'mic', 				width:80, render: ({rows, index}) => {
		// 	return <Input name='mic' width='100%' value={rows.mic} onChange={(v, data, name) => this.onChanges(v, name, rows, index) } />  
		// } },
		// { title: 'K-B', 				field: 'kb', 				width:80, render: ({rows, index}) => {
		// 	return <Input name='kb' width='100%' value={rows.kb} onChange={(v, data, name) => this.onChanges(v, name, rows, index) } />  
		// } },
		{ title: '结果', 				field: 'result', 			width:100, render: ({rows, index}) => {
			return <Select name='result' data={this.state.resultData} nameStr='name' idStr='value' value={rows.result}  onChanged={(v, data, name) => this.onChanges(v, name, rows, index)} width='100%' />
		} },
	]    
	componentDidMount () {
		this.setForms()  
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
	} 
	componentWillReceiveProps ({infos}) { 
		this.setState({infos: infos })
		this.setForms(infos.content)
	}
	setForms = (v) => {  
		const { forms } = this.state
		if ($fn.hasObject(v)) {   
			forms.imgs = v.imgs || []
			forms.report_form_imgs = v.report_form_imgs || ''  
			forms.check = v.check || ''  
			forms.result_suggestion_name = v.result_suggestion_name || ''  
			forms.result = v.result || ''  
			forms.count = v.count || ''  
			forms.dis_code = v.dis_code || ''    
			forms.drug_table = $fn.hasArray(v.drug_table) ? v.drug_table : [] 
			this.setState({forms: forms, data: forms.drug_table })  
		} else { 
			forms.imgs = []
			forms.report_form_imgs = ''   
			forms.check = ''  
			forms.result_suggestion_name = ''  
			forms.result = ''  
			forms.count = ''  
			forms.dis_code = ''  
			forms.drug_table = []
			this.setState({forms: forms, data: []})  
		}
	}   
	onChanges (v, name, rows, index) {     
		const { data } = this.state 
		data[index][name] = $fn.hasObject(v) ? v[name] : ''
		this.setState({data: data})    
    }
	changeInput = (v, name, callback) => ts.changeInput.call(this, v, name, callback) 
	submits = () => {
		const { forms, infos } = this.state
		if (!$fn.hasObject(infos)) { return message.then(f => f.default.error('请选择一条列表数据')) } 
		let content = ts.setNullParameter(forms); 
		content.drug_table = this.state.data 
		const _content = $fn.getObjectParam('content', content)
		let param = {
			uuid: infos.uuid,
			dmodel: ts.getPath().id,
			..._content
		}  
		$http.submit(null,'result-unit-item/update', { param: param, successText: '操作成功'})  
	} 
	onChangeForms = (value, name ) => {  
        const { forms } = this.state
        forms[name] = value
        this.setState({forms})   
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
					</div>
				} 
			>   
				<div className='fx'>
					<div className='radio-style ex mt10'>
						{ $fn.hasObject(infos) && infos.is_coll_pic === '1' 			&& <UploadImg name='imgs' value={forms.imgs} handleChange={(v, name) => this.changeInput(v, name)} /> } 
						{ $fn.hasObject(infos) && infos.is_upload_report_form === '1' 	&& <UploadReport name='report_form_imgs' value={forms.report_form_imgs} handleChange={(v, name) => this.changeInput(v, name)}/> } 
						<Radio optionType='default' onChange={e => this.onChangeForms(e.target.value, 'check')} data={this.checkOption} value={forms.check} />
						<Title title='建议与解释' />
						<Input name='result_suggestion_name' size='middle' mode='textarea' bordered={false} value={forms.result_suggestion_name} onChange={(v, data, name) => this.changeInput(v, name) } />
						<p className='g9 lh20'>(使用向下" ↓ "箭头自动搜索)</p>
						<Title title='结果' />
						<Input name='result' size='middle' mode='textarea' bordered={false} value={forms.result} onChange={(v, data, name) => this.changeInput(v, name) } />
						<p className='g9 lh20'>(使用向下" ↓ "箭头自动搜索)</p>
					</div>  
					{forms.check === '1' && 
						<div className='mt10' style={{width: '50%', marginLeft: '20px'}}> 
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
			</BoxScroll>
		)
	} 
}