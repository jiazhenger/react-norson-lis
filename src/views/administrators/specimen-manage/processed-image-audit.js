// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== antd
import { Image } from 'antd' 
import Modal from '@antd/modal'
// ===================================================================== common
import coms from '@/private/js/common.js'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// ===================================================================== global antd
const Input = $async(()=>import('@antd/form/input'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SubmitForm = $async(()=>import('#cpt/submit-form'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data: {},
		submit: [
			{ label:'驳回理由', type: 'textarea', name:'remark', required:true, full:true, width:'100%' }
		]
	} 
	componentDidMount(){ 
		this.nextImg()
	}
	modal = {}
	nextImg() {
		const { data } = this.state
		let param = {
			id: data.id ? data.id : ''
		} 
		$http.submit(null,'app-upload-pic/nextaudit', { param: param, loading:false}).then(data=>{
			message.then(f => f.default.success('操作成功'))
			this.setState({data: data})
		})
	}  
    saveImg = (status, modal, callback) => {
		const { data } = this.state
		if (data.spec_code) {
		  	const param = {
				uuid: data.uuid,
				spec_code: data.spec_code,
				status: status,
				...modal
			}; 
			$http.submit(null,'app-upload-pic/audit', { param: param, loading:false}).then(data=>{
				message.then(f => f.default.success('操作成功'))
				callback && callback()
				this.nextImg();
			})
		} else {
		  message.then(f => f.default.success('请填写关联条码'))
		}
	}
	onChanges = (v) => { 
		const {data} = this.state
		data['barcode'] = v
		this.setState({data: data}) 
	}
	ButtonGroup = () => {
		const { data } = this.state 
		return (
			<div> 
				关联条码： 
				<Input p='请输入关联条码' width={150} value={data.spec_code} style={{borderRadius: '4px'}} className='mlr5' onChange={(e) => this.onChanges(e) } />
				<Button label='审核通过' ghost className='mlr5' onClick={()=> this.saveImg(43703) } /> 
				<Button label='审核驳回' ghost className='mlr5' onClick={()=> this.refs.modal.open() }/> 
				<Button label='下一个' ghost className='mlr5' onClick={()=> this.nextImg() }/> 
				<Button label='返回' ghost className='ml5' onClick={()=> $fn.back(this) }/> 
			</div>
		)
	} 

	render(){
		const { data, submit } = this.state
		return (
			<Page title='图片审核' noBtGroup={true} ButtonGroup={this.ButtonGroup()}> 
				<div className='ex p10 tc oxys'>
					<Image src={coms.img_domain_url(data.pic_path)} />
				</div>
				<Modal ref='modal' title={this.isEdit ? '编辑' : '添加'} width={648} noFooter>
					<SubmitForm
						modal
						data = { submit }
						onSubmit = { v => { 
							this.saveImg(43704, v, () => this.refs.modal.close())
						}}
						onClose = { ()=>this.refs.modal.close() }
					 />
				</Modal>
			</Page>
		)
	}
}