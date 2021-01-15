// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== antd
import { Image } from 'antd' 
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
// ===================================================================== component
export default class extends React.Component{
	state = { 
		barcode: '',
		data: {}
	}
	  
	componentDidMount(){ 
		this.nextImg()
	}
    nextImg() {
		const { data } = this.state
		let param = {
			id: data.id ? data.id : ''
		} 
		$http.submit(null,'app-upload-pic/nextedit', { param: param, loading:false}).then(data=>{
			message.then(f => f.default.success('操作成功'))
			this.setState({data: data})
		})
	} 
    saveImg() {
		const { barcode, data } = this.state 
		console.log(barcode)
		if (barcode) {
		  	const param = {
				uuid: data.uuid,
				spec_code: barcode
		  	}; 
		  	$http.submit(null,'app-upload-pic/bindcode', { param: param, loading:false}).then(data=>{
				message.then(f => f.default.success('保存成功'))
				this.setState({barcode: ''})
				this.nextImg()
			}) 
		} else {
			message.then(f => f.default.error('请填写关联条码'))
		}
	}
	onChanges = (v) => { 
		this.setState({barcode: v}) 
	}

	ButtonGroup = () => {
		return (
			<div> 
				关联条码：
				<Input p='请输入关联条码' width={150} value={this.state.barcode} style={{borderRadius: '4px'}} className='mlr5' onChange={(e) => this.onChanges(e) } />
				<Button label='保存' ghost className='mlr5' onClick={()=> this.saveImg() }/> 
				<Button label='下一个' ghost className='mlr5' onClick={()=> this.nextImg() }/> 
				<Button label='返回' ghost className='ml5' onClick={()=> $fn.back(this) }/> 
			</div>
		)
	}
	render(){
		const { data } = this.state
		return (
			<Page title='条码关联' noBtGroup={true} ButtonGroup={this.ButtonGroup()}> 
				<div className='ex p10 tc oxys'>
					<Image src={coms.img_domain_url(data.pic_path)} />
				</div>
			</Page>
		)
	}
}