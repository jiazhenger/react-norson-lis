import React from 'react'
import { withRouter } from 'react-router-dom'
// ===================================================================== public component
import Content from '@cpx/content'
import Image from '@cpx/image'
// ===================================================================== private component
import MuluComponent from './cpt/mulu'
import UserComponent from './cpt/user'
// ===================================================================== image

// ===================================================================== antd component
import { Layout, Menu, message } from 'antd'
import { MenuUnfoldOutlined,MenuFoldOutlined } from '@ant-design/icons'
const { SubMenu, Item } = Menu
// ===================================================================== my function
const $fn = window.$fn
const getCollapsed= () => {
	let c = $fn.local('collapsed');
	return c === 'true'
}
message.config({ top: '40%',duration:0.5 })
// ===================================================================== component
class Frame extends React.Component{
	state = {
		selectedKeys:this.getKey(),
		collapsed: getCollapsed(),
	}
	componentDidMount(){
		$fn.setTitle(this.props.title)
		
		const { token } = $fn.getQuery()
		if(token){
			$fn.local('user',{token})
		}
	}
	handleClick = v => {
    	sessionStorage.setItem('defaultOpenKeys',v.keyPath)
  	}
	onSelect = v => {
		this.props.history.push(v.key);
		this.setState({ selectedKeys: this.getKey() })
	}
	onToggle = () => this.setState({collapsed:!this.state.collapsed},()=>{
		$fn.local('collapsed', this.state.collapsed)
	})
	// 从路由获取 key 值
	getKey(){
//		let hash = window.location.hash
//		hash = hash.replace('#','')
//		return [ hash ]
		return [ window.location.pathname ]
	}
	render(){
		const { data, Router, logo, title } = this.props
		const {selectedKeys, collapsed } = this.state
		let defaultOpenKeys =  sessionStorage.getItem('defaultOpenKeys')	// 默认打开 key
		if(defaultOpenKeys){ defaultOpenKeys = defaultOpenKeys.split(',') }
		
		const width = 200
		return (
			<Content scrollY={false} className='fv'>
				<header className='fxm bcf xpr' style={{height:'56px'}}>
					<h1 className='fxmc f16 xplr' style={{margin:0,minWidth:width + 'px'}}>
						<div className='fxmc mr10'><Image src={logo} width='40px'/></div>
						<b>{title || '致愿高中管理系统'}</b>
					</h1>
					<h6 className='g9 mr45'>欢迎登录优彼致愿高中管理系统！</h6>
					{/* 目录 */}
					<MuluComponent />
					{/* 占位 */}
					<div className='ex'></div>
					{/* 使用指南 */}
					<div className='mr50 hover cp tu'>使用指南</div>
					{/* 用户信息 */}
					<UserComponent {...this.props} />
				</header>
				<Layout className='ex'>
					{/* 导航 */}
					<Layout.Sider className='ex rel' id='menu' width={width} collapsible trigger={null} collapsed={collapsed}>
						<div className='f18 c0 fxmc h cp h50' onClick={this.onToggle}>
							{collapsed ? <MenuUnfoldOutlined style={{color:'#fff'}} /> : <MenuFoldOutlined style={{color:'#fff'}} />}
						</div>
						<div className='abs_full' style={{top:'50px'}}>
							<Content className='sbar'>
								<Menu className='h' inlineIndent={12} mode='inline' theme='dark' onClick={this.handleClick} selectedKeys={selectedKeys} defaultOpenKeys={defaultOpenKeys} onSelect={this.onSelect}>
									{
										$fn.hasArray(data) && data.map((v,i)=>(
											$fn.hasArray(v.children) ? (
												<SubMenu key={i} title={<>{v.icon}<span>{v.title}</span></>}>
													{
														$fn.hasArray(v.children) && v.children.map((p,k)=>{
															return $fn.hasArray(p.children) ? (
																<SubMenu key={i + '-' + k } title={p.title}>
																	{
																		$fn.hasArray(p.children) ? p.children.map((m,j)=> <Item key={m.path}>{m.title}</Item> ) : null
																	}
																</SubMenu>
															): <Item key={p.path}>{p.title}</Item>
														})
													}
												</SubMenu>
											) : <Item key={v.path}>{v.icon}<span>{v.title}</span></Item>
										))
									}
								</Menu>
							</Content>
						</div>
					</Layout.Sider>
					{/* 内容 */}
					<section className='ex fv'>
						<div className='rel ex' style={{background:'#f5f6f7'}}>
							<Router {...this.props}/>
						</div>
					</section>
				</Layout>
			</Content>
		)
	}
}

export default  withRouter(Frame)
