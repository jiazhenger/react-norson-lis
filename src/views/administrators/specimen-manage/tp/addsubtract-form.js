// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'  
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd 
const message = import('@antd/message') 
// ===================================================================== private component
const SubmitForm = $async(()=>import('#cpt/submit-form'))
// ===================================================================== 缓存
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== component
export default class extends React.Component{
	item_typeOptions = [
        { label: "加做", value: "1" },
        { label: "减做", value: "2" }
    ]
	state = {
		keys: 0,
		submit: [
			{ label:'标本条码',			name:'spec_code',		required:true, }, 
			{ label:'加减项类型', 		name:'item_type',		type: 'select', data: this.item_typeOptions, nameStr:'label', idStr:'value', required:true },
			{ label:'姓名',				name:'patient_name',    required:true }, 
			{ label:'性别', 			name:'sex',				type: 'select', data: [], nameStr:'name', idStr:'value' },
			{ label:'项目', 			name:'kind_id',			type: 'select', data: [], nameStr:'name', idStr:'value', required:true  },
            { label:'时间',				name:'op_time',			type: 'date-time' },
			{ label:'岗位', 			name:'project_name',	type: 'select', data: [], nameStr:'name', idStr:'value' },
			{ label:'备注说明', 		name:'remark',			type: 'textarea', full:true, width:'100%'},
			{ label:'图片', 			name:'img',				type: 'upload', params: {modular: 130}},
		]
	}  
	model = {}
	componentDidMount(){  
		this.props.onRef(this)  
		const { submit } = this.state
		$fn.dataSave('dis-item-45700-data').then(local => {
			if($fn.hasArray(local)){ 
				submit[3].data = local
				this.setState({submit: submit})
			}else{
			  $http.submit(null,'dis-item/item', { param:{dis_code:45700}, loading:false}).then(data=>{
				submit[3].data = data
				this.setState({submit: submit})
				$fn.dataSave('dis-item-45700-data', data)
			  }) 
			}
		})  
		cacheApi.then(f => {
			$fn.getCache({
				cache: f.default.kindinfoSelect, name: 'name', id: 'value', callback: (data) => {
					if ($fn.hasArray(data)) { 
						submit[4].data = data
						this.setState({submit: submit})
					} else {
                        $http.submit(null, 'kind-info/select').then(data => {
                            submit[4].data = data
							this.setState({submit: submit})
							$fn.setCache()
                        })
                    }
				}
			})
			$fn.getCache({
				cache: f.default.laboratoryselect, name: 'name', id: 'value', callback: (data) => {
					if ($fn.hasArray(data)) { 
						submit[6].data = data
						this.setState({submit: submit})
					} else {
                        $http.submit(null, 'project-team/laboratoryselect').then(data => {
                            submit[6].data = data
							this.setState({submit: submit})
							$fn.setCache()
                        })
                    }
				}
			})
		}) 
		this.changeInfo(this.props) 
	}   
    componentWillReceiveProps(props) {  
		if (props.rows !== this.props.rows) {
			this.changeInfo(props)
		} 
    }
	changeInfo = (props) => {   
		console.log('加减项赋值') 
		this.clears()
		const { submit } = this.state
		if (props.type){
			submit[0].value = props.rows.spec_code || ''
			submit[1].value = props.rows.item_type || ''
			submit[2].value = props.rows.patient_name || ''
			submit[3].value = props.rows.sex || ''
			submit[4].value = props.rows.kind_id || ''
			submit[5].value = props.rows.op_time || '' 
			submit[6].value = props.rows.project_name || ''
			submit[7].value = props.rows.remark || '' 
			submit[8].value = props.rows.img || ''
		} else {
			submit[0].value = props.rows.spec_code || '' 
			submit[2].value = props.rows.patient_name || '' 
			submit[3].value = props.rows.sex || ''  
		} 
		this.setState({ submit: submit }) 
	}
	submits = () => {
		console.log('加减项提交') 
		this.form.submit()
	}
	clears = () => {
		console.log('加减项清空') 
		// this.form.resetFields(['item_type', 'patient_name', 'sex', 'kind_id', 'op_time', 'project_name', 'remark', 'img'])
		const { submit } = this.state 
		submit.forEach(i => {
			if (this.props.type) {
				i.value = ''
			} else if (i.name !== 'spec_code') {
				i.value = ''
			} 
		})
		this.setState({ submit: submit}) 
	} 
	render(){  
		const { submit } = this.state
		return ( 
			<div> 
				<SubmitForm  
					modal
					data 		= { submit }
					onChange    = { (v,press,{name})=> {
						submit.forEach(i => {
							if (i.name === name) {
								i.value = v
							}
						}) 
					} }
					onSubmit    = { v => {   
						let param = {...v}
						let api ='sp-additional-item/add' 
						let info = '添加'  
						console.log(this.props.type)
						if (this.props.type) {
							param = { ...v, uuid: this.props.rows.uuid}
							api = 'sp-additional-item/edit' 
							info = '编辑'
						} 
						$http.submit(null, api, { param: param, submitLoading:'infoLoading' }).then(data=>{
							message.then(f=>f.default.success(`${info}成功`))
							this.clears() 
							this.props.close && this.props.close()
						}) 
					}}
					display 	= { true }
					init    	= { form => this.form = form }
				/>
			</div>
		)
	}
}