import React from 'react'
// ===================================================================== icons
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import Encrypt from '@com/plugins/encrypt'
// ===================================================================== image
import Logo from '@img/logo.png'
import Bg from '@img/login/bg.png'
// ===================================================================== global antd
// import Button from '@antd/button'
// import Input from '@antd/form/input'
// import Checkbox from '@antd/form/checkbox'
// import Select from '@antd/form/select'
// import { Form, Item } from '@antd/form/form'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== global antd
const Form = $async(()=>import('@antd/form/form'))
const Item = $async(()=>import('@antd/form/item'))
const Button = $async(()=>import('@antd/button'))
const Input = $async(()=>import('@antd/form/input'))
const Select = $async(()=>import('@antd/form/select'))
const Checkbox = $async(()=>import('@antd/form/checkbox'))
// ===================================================================== global template
const Image = $async(()=>import('@tp/image'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/content/content-page'))
// ===================================================================== config declare
const iconStyle= { color:'#999' }
const size = 'large'
const mt = 20
let clear
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		selectLoading: true,
	}
	
	componentDidMount(){
		// 读取记住的密码
		clear = setTimeout(()=>{
			const m = $fn.longSave('remember')
			if($fn.hasObject(m)){
				for(var i in m){ m[i] = Encrypt.decode(m[i]) }
				this.setState({checked:true},()=>this.checked=true)
				this.form.setFieldsValue(m)
			}
		},200)
		
		$http.pull(this,'company/select',{ token:false, pullLoading:'selectLoading' })
	}
	
	componentWillUnmount(){
		clearTimeout(clear)
	}
	
	onSubmit = async param => {
		this.setState({loading:true})
		const data = await $http.submit(this,'auth/login',{
			param: param,
			token: false,
			loading: true,
			loadingText:'登录中...',
			onError:() => this.setState({loading:false})
		})
		
		if($fn.hasObject(data)){
			// 保存 token
			$fn.local('user',data)
			// 记住密码
			if(this.checked){
				const model = JSON.parse(JSON.stringify(param))
				for(var i in model){ model[i] = Encrypt.encode(model[i]) }
				console.log(model)
				$fn.longSave('remember',model)
			}else{
				$fn.longRemove('remember')
			}
			// 获取个人信息
			$http.pull(this,'employee/currentuser',{dataName:null, onEnd:() => this.setState({loading:false})}).then(rs=>{
				if( $fn.hasObject(rs) ){ $fn.local('user',{...data,...rs}) }
				$fn.toast('登录成功')
				$fn.replace(this,'/')
			})
		}
	}
	
	render(){
		const { data, selectLoading, loading, checked } = this.state
		return (
			<Page contentClassName='fxmc wh login' style={{background:`url(${Bg}) no-repeat center/cover`}}>
				<Image src={ Logo } width={120} className='abs_lt' style={{top:10,left:10}} />
				<div className='bcf r10px rel i10' style={{width:500, padding:'25px 40px', boxShadow:'0 0 10px #bbb'}}>
					{/* 文本 */}
					<hgroup className='tc mb25'>
						<h2 className='b f20 tc'>成都诺森医学检验有限公司</h2>
						<h3 className='f14 g9 mt15'>致力于做民众身边的健康管理专家</h3>
					</hgroup>
					{/* 表单 */}
					<Form onSubmit={this.onSubmit} init={form => this.form = form}>
						<Item name='company' rules={[{ required:true, message:'公司不能为空'}]}><Select disabled={loading} loading={selectLoading} size={size} p='选择分公司' bordered={false} data={data} idStr='uuid' nameStr='company_name' /></Item>
						<Item name='phone' mt={mt} rules={[{ required:true, message:'用户名不能为空'}]}><Input disabled={loading} p='账号/工号/手机号/邮箱' bordered={false} prefix={<UserOutlined style={iconStyle} />} size={size} /></Item>
						<Item name='password' mt={mt} rules={[{ required:true, message:'密码不能为空' }]}><Input disabled={loading} p='密码' bordered={false} prefix={<LockOutlined style={iconStyle} />} size={size} mode='password' iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} /></Item>
						<div className='mt15'><Checkbox value={checked} label='记住密码' onChange={v=>this.checked = v} disabled={loading} /></div>
						<Button full loading={loading} size={size} htmlType='submit' boxClassName='mt30' label='登录'/>
					</Form>
				</div>
				<footer className='abs_lb w tc f12 cf h30'>copyright © 体验技术部出品</footer>
			</Page>
		)
	}
}