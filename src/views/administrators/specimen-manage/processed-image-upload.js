// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
import { Image } from 'antd'
import { CloseOutlined } from '@ant-design/icons';
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== global template
// const Image = $async(()=>import('@tp/image'))
// ===================================================================== antd
const Upload = $async(()=>import('@antd/upload'))
const message = import('@antd/message')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container')) 
// ===================================================================== component
export default class extends React.Component{
	state = {
		fileList: []
	}  
	componentDidMount(){ } 
	ButtonGroup = () => {
		return [
			{ label:'保存', onClick:()=>{ this.submitsImg() } },
			{ label:'返回', onClick:()=>{ $fn.back(this) } }
		]
	}
	onchangeImg = ({fileList}) => {
		this.setState({fileList: [...this.state.fileList ,...fileList]})
	}
	deleteImg = (val) => {
		const d = this.state.fileList.filter(i => i !== val)
		this.setState({fileList: d})
	}
	submitsImg = () => {
		const fileList = this.state.fileList.map(i => i.img_path);
		const param = {
			images: fileList,
			logistics_user_id: ""
		}
		$http.submit(null,'app-upload-pic/add', { param: param, loading:false}).then(data=>{
			message.then(f => f.default.success('保存成功'))
			$fn.back(this)
		}) 
	}
	render(){
		const { fileList } = this.state
		return (
			<Page title='图片上传' ButtonGroup={this.ButtonGroup()}>
				<div className='p10'>
					<Upload style={{width: '145px'}} multiple={true} api='app-upload-pic/upload' name='fileList' params={{modular: 110}} onChange={(val) => this.onchangeImg(val)} />
				</div> 
				<div className='fxw plr10 ex' style={{alignContent: 'flex-start'}}>
					{fileList.map((i, v) => {
						return (
						<div key={v} style={{position: 'relative', border: '1px solid #e9e9e9', margin: '0 16px 16px 0'}}>
							<div onClick={() => this.deleteImg(i)} className='tc cp' style={{position: 'absolute', zIndex: '50', background: 'rgba(0,0,0,0.5)', top: '0', right: '0', width: '25px', height: '20px', lineHeight: '20px'}}>
								<CloseOutlined style={{fontSize: '16px', color: '#FFFFFF'}} />
							</div>
							<Image width={145} height={145} src={i.img_url} />
						</div>
						)
					})} 
				</div>
			</Page>
		)
	}
}