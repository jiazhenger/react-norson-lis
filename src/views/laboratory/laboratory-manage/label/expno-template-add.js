import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const message = import('@antd/message')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
// ===================================================================== private component
const selectType = [
	{ value: "0", name: "数字" },
	{ value: "1", name: "字母" }
]
const prefix_auto_data = [
	{name: '年', value: 'Y'},
	{name: '月', value: 'M'},
	{name: '日', value: 'D'},
	{name: '年月', value: 'YM'},
	{name: '年日', value: 'YD'},
	{name: '月日', value: 'MD'},
	{name: '数值', value: 'INT'},
]
// ===================================================================== component
export default class extends React.Component{
	state = {
		department: [],
		submit: [],
		id:$fn.query('id'),
		model: {}
	}
	forms =  [
		{ label:'实验号模板名称', 		name:'lab_name',			required: true},
	
		{ label:'动态前缀', 			name:'prefix_auto',			type:'select',			data:[],				title: '前缀配置' },
		{ label:'前缀值起始值', 		name:'prefix_int_start',	prefix: 'INT'	},
		{ label:'前缀值结束值', 		name:'prefix_int_end',		prefix: 'INT'},
		{ label:'前缀值增量', 			name:'prefix_int_inc',		prefix: 'INT' },
	
		{ label:'前缀位数', 			name:'lab_rule_start_type',	required: true,			title: '其他配置' },
		{ label:'类型', 				name:'start_type',			required: true,			type:'select',			data:[]},
		{ label:'数字编码', 			name:'lab_rule_start',		required: true,			disabled: true,			start_type: '0'},
		{ label:'后缀位数', 			name:'lab_rule_end_type',	required: true},
		{ label:'起始值', 				name:'lab_rule_end',		required: true,			disabled: true,},
		{ label:'加急前缀', 			name:'critical_prefix',		required: true },
		{ label:'加急起始值', 			name:'critical_start',		required: true,			disabled: true },
		{ label:'周期', 				name:'lab_cycle',			required: true, 		type:'select',			data:[]},
	
		{ label:'周期值', 				name:'cycle_start',			lab_cycle_number: ''},
		{ label:'开始时间', 			name:'cycle_start_time',	type:'time',		after:true,				lab_cycle_number: '43901' },
		{ label:'结束时间', 			name:'cycle_end',			type:'time',		after:true,				lab_cycle_number: '43901' },
		{ label:'描述', 				name:'description',			type: 'textarea'},
	]
	async getDataAsync() {
		const { id } = this.state
		if (id) {
			$http.submit(null, 'lis-lab-tag/info', {param: {uuid: id}}).then(data => {
				for (let i in data) {
					this.forms.forEach(item => {
						if ((i !== 'id' || i !== 'uuid' || i !== 'comp_id' || i !== 'created_at') && item.name === i) {
							item.value = data[i]
						}
					})
				}
				setTimeout(() => {
					this.form.setFieldsValue({...data})
				}, 200)
			})
		}
		this.showForm = this.forms
		this.showForm.forEach(item => {
			// 动态前缀
			if (item.name === 'prefix_auto') {
				item.data = prefix_auto_data
			}
			// 类型
			if (item.name === 'start_type') {
				item.data = selectType
			}
			// 动态前缀非数值
			if (item.prefix_auto !== 'INT') {
				this.showForm = this.showForm.filter(i => i.prefix !== 'INT')
			}
			this.showForm = this.showForm.filter(i => i.lab_cycle_number === undefined)
		})
		
		await $fn.getDisItem({
			code: 43900,
			callback: (data) => {
				// 周期
				this.showForm.forEach(item => {
					if (item.name === 'lab_cycle') {
						item.data = data
					}
				})
			}
		}) // 设备类型
		
		setTimeout(() => {
			if (this.form) {
				 // 周期
				if (this.form.getFieldValue('lab_cycle') === '43901') {
					this.showForm.splice(this.showForm.length - 1, 0, this.forms[14], this.forms[15])
				}
				if (this.form.getFieldValue('lab_cycle') && this.form.getFieldValue('lab_cycle') !== '43901') {
					this.showForm.splice(this.showForm.length - 1, 0, this.forms[13])
				}
				// 动态前缀
				if (this.form.getFieldValue('prefix_auto') === 'INT') {
					this.showForm.splice(2, 0, this.forms[2], this.forms[3], this.forms[4])
				}
 				
				this.showForm.forEach(item => {
					// 数字编码 | 字母编码
					if (this.form.getFieldValue('start_type')) {
						if (item.name === 'lab_rule_start') {
							if (this.form.getFieldValue('start_type') === '1') {
								item.label = '字母编码'
							} else {
								item.label = '数字编码'
							}
							item.disabled = false
						}
					}
					// 后缀位数
					if (this.form.getFieldValue('lab_rule_end_type')) {
						if (item.name === 'lab_rule_end' || item.name === 'critical_start') {
							item.disabled = false
						}
					}
				})
			}
			this.setState({submit: this.showForm})
		}, 500)
	}
	componentDidMount(){
		
		this.getDataAsync()
	}
	render(){
		const { submit, id } = this.state
		return (
			<Page title='实验号模板-设置规则'>
				<div className='ex fv xplr pt10'>
					<SubmitForm
						data	= { submit }
						btnSize	= 'large'
						okText	= { id ? '修改 Enter' : '保存 Enter'} 
						onChange    = {(v, press, { name, data }) => {
							if (name === 'lab_cycle') { // 周期
								const d = this.showForm.filter(i => i.lab_cycle_number !== undefined)
								if (d.length) {
									if (v === '43901') { // 天
										this.showForm.splice(this.showForm.length - 2, 1, this.forms[14], this.forms[15])
									} else {
										this.showForm.splice(this.showForm.length - 3, 2, this.forms[13])
									}
								} else {
									if (v === '43901') { // 天
										this.showForm.splice(this.showForm.length - 1, 0, this.forms[14], this.forms[15])
									} else {
										this.showForm.splice(this.showForm.length - 1, 0, this.forms[13])
									}
								}
								this.setState({submit: this.showForm})
							}
							this.showForm.forEach((item) => {
								if (name === item.name) {
									item.value = v
								}
								if (name === 'prefix_auto') { // 动态前缀
									if (v === 'INT') {
										if (this.showForm[2].prefix !== 'INT') {
											this.showForm.splice(2, 0, this.forms[2], this.forms[3], this.forms[4])
										}
									} else {
										if (this.showForm[2].prefix === 'INT') {
											this.showForm.splice(2, 3)
										}
									}
									this.setState({submit: this.showForm})
								} else if (name === 'start_type') { // 类型
									if (item.name === 'lab_rule_start') { // 数字编码 | 字母编码
										if (v === '1') {
											item.label = '字母编码'
										} else {
											item.label = '数字编码'
										}
										item.disabled = false
									}
									this.setState({submit: this.showForm})
								} else if (name === 'lab_rule_end_type') { // 后缀位数
									if (item.name === 'lab_rule_end' || item.name === 'critical_start') {
										if (v) {
											item.disabled = false
										} else {
											item.disabled = true
										}
									}
									this.setState({submit: this.showForm})
								}
							})
                        } } 
						onSubmit = { v => {
							const data = {
								prefix_int_end: '',
								prefix_int_inc: '',
								prefix_int_start: ''
							}
							if(id){
								const param = {...data, ...v, uuid: id}
								$http.submit(null, 'lis-lab-tag/edit', { param }).then(data => {
									message.then(f => f.default.success('修改成功'))
									$fn.back(this)
								})
							}else{
								const param = {...data, ...v}
								$http.submit(null, 'lis-lab-tag/add', { param }).then(data => {
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