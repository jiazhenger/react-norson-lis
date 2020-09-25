import React from 'react'
import { withRouter, NavLink } from 'react-router-dom'
// ===================================================================== antd
import { Layout, Menu, message } from 'antd'
// ===================================================================== global declare
const { $http, $fn, $async } = window
const { SubMenu, Item } = Menu
// ===================================================================== private template
const Content = $async(()=>import('@tp/content'))
// ===================================================================== global template
const Image = $async(()=>import('@tp/image'))
// ===================================================================== private component
const Router = $async(()=>import('#frame/router'))
// ===================================================================== image

// ===================================================================== my function
const getCollapsed= () => {
	let c = $fn.local('collapsed');
	return c === 'true'
}
message.config({ top: '40%',duration:0.5 })
const width = 200
// ===================================================================== component
class Frame extends React.Component{
	state = {
		selectedKeys:this.getKey(),
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
		const { data } = this.props
		const {selectedKeys, collapsed } = this.state
		let defaultOpenKeys =  sessionStorage.getItem('defaultOpenKeys')	// 默认打开 key
		
		defaultOpenKeys = defaultOpenKeys ? defaultOpenKeys.split(',')  : []
		
		return (
			<Layout className='ex rel fx'>
				{/* 导航 */}
				<Layout.Sider className='ex rel' id='menu' width={width} collapsible trigger={null} collapsed={collapsed}>
					<Content scrollY>
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
				</Layout.Sider>
				{/* 内容 */}
				<section className='ex rel'>
					<Router {...this.props}/>
				</section>
			</Layout>
		)
	}
}

export default  withRouter(Frame)
