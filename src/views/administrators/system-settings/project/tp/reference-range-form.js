import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const message = import('@antd/message')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
// ===================================================================== private component

// ===================================================================== component
export default class extends React.Component{
	state = {
		submit: [
			{ label:'参考值类别名称',		name:'ref_type_name'},
			{ label:'参考值类别名称(英)',	name:'en_ref_type_name'},
			{ label:'性别',					name:'sex',					type:'select',				data:[] },
			{ label:'年龄单位',				name:'age_unit',			type:'select',				data:[] },
			{ label:'年龄(低)',				name:'age_min_type',		type:'select',				data:[],		title: '报告单特性'},
            { label:'',						name:'age_min_val',			placeholder: '年龄(低)'},
            { label:'年龄(高)',				name:'age_max_type',		type:'select',				data:[]},
            { label:'',						name:'age_max_val',			placeholder: '年龄(高)'},
            { label:'危急值(低)',			name:'crisis_min_type',		type:'select',				data:[]},
            { label:'',						name:'crisis_min_val',		placeholder: '危急值(低)'},
            { label:'危急值(高)',			name:'crisis_max_type',		type:'select',				data:[]},
            { label:'',						name:'crisis_max_val',		placeholder: '危急值(高)'},
            { label:'参考值(低)',			name:'reference_min_type',	type:'select',				data:[]},
            { label:'',						name:'reference_min_val',	placeholder: '参考值(低)'},
            { label:'参考值(高)',			name:'reference_max_type',	type:'select',				data:[]},
            { label:'',						name:'reference_max_val',	placeholder: '参考值(高)'},
            { label:'参考值描述',			name:'description',			type: 'textarea',			width: '480px'},
            { label:'参考值描述(英)',		name:'description_en',		type: 'textarea',			width: '480px'},
            { label:'参考值报告单打印',		name:'print_report',		type: 'textarea',			width: '480px'},
            { label:'参考值报告单打印(英)',	name:'print_report_en',		type: 'textarea',			width: '480px'},
            { label:'危急值描述',			name:'crisis_value_desc',	type: 'textarea',			width: '480px'},
		],
        id:$fn.query('uuid'),
        kind_id: $fn.query('kind_id'),
		model: {}
	}
	async getDataAsync() {
		const { submit, id } = this.state
		$fn.getDisItem({
			code: 30000,
			callback: (data) => {
				submit[3].data = data
				this.setState({submit})
			}
		})
		$fn.getDisItem({
			code: 1300,
			callback: (data) => {
				submit[4].data = data
				submit[6].data = data
				submit[8].data = data
				submit[10].data = data
				submit[12].data = data
				submit[14].data = data
				this.setState({submit})
			}
		})
		$fn.getDisItem({
			code: 45700,
			callback: (data) => {
				submit[2].data = data
				this.setState({submit})
			}
        })
        
        submit.forEach(item=>{
            item.value = ''
            if (item.name === 'crisis_max_val' || item.name === 'crisis_min_val' || item.name === 'reference_max_val' || item.name === 'reference_min_val' || item.name === 'age_min_val' || item.name === 'age_max_val') {
                item.value = '0.00'
            }
        })
		
		if (id) {
			$http.submit(null, 'kd-reference-range/info', {param: {uuid: id}}).then(data => {
				$fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
			})
		}
	}
	componentDidMount(){
		this.getDataAsync()
	}
	render(){
		const { submit, id, kind_id } = this.state
		return (
			<Page title='参考范围'>
				<div className='ex fv xplr pt10'>
					<SubmitForm
						data	= { submit }
						btnSize	= 'large'
						onSubmit = { v => {
                            for (let i in v) {
                                if (v[i] === undefined) {
                                    v[i] = ''
                                }
                            }
							if(id){
								const param = {...v, uuid: id, kind_id}
								$http.submit(null, 'kd-reference-range/edit', { param }).then(data => {
									message.then(f => f.default.success('修改成功'))
									$fn.back(this)
								})
							}else{
								const param = {...v, kind_id}
								$http.submit(null, 'kd-reference-range/add', { param }).then(data => {
									message.then(f => f.default.success('添加成功'))
									$fn.back(this)
								})
							}
						}}
						onClose = { ()=> $fn.back(this) }
						init	= {form => this.form = form}
					/>
				</div>
			</Page>
		)
	}
}