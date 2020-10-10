import React from 'react'
import { withRouter, NavLink } from 'react-router-dom'
// ===================================================================== antd
// ===================================================================== image
import Logo from '@img/frame/logo.png'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const message = import('@antd/message')
const confirm = import('@antd/confirm')
// ===================================================================== private template
const Page = $async(()=>import('@tp/content'))
// ===================================================================== global template
const Image = $async(()=>import('@tp/image'))
const Text = $async(()=>import('@tp/text'))
// ===================================================================== private component
// const Router = $async(()=>import('#frame/router'))
const height = 44
// ===================================================================== image
const LiComponent = ({ title, onClick }) => (
	<li className='fxmc c0 tap cp' style={{width:height}} onClick={onClick}>
		<div>
			<i></i><span>{title}</span>
		</div>
	</li>
)
// ===================================================================== component
class Frame extends React.Component{
	state = {
		user: $fn.getUser()
	}
	root = $fn.getRoot()
	componentDidMount(){
		
	}
	render(){
		const { user } = this.state
		const { data, Router } = this.props
		const { root } = this.root
		return (
			<Page className='fv'>
				<header className='fxmc' style={{height}}>
					<h2 className='fxmc bcm h cp hover-o' style={{width:$fn.menuWidth}} onClick={()=>$fn.push(this,'/')}>
						<Image width='120px' src={Logo}/>
					</h2>
					<nav className='ex fx h f13 g6' id='nav'>
						{
							data.map((v,i)=>(
								<NavLink key={i} to={ root + v.path} className='fxmc plr10 rel tap' activeClassName='active' >{v.title}</NavLink>
							))
						}
					</nav>
					<div className='fxm g6 mr10'>
						{/* 头像 */}
						<Image wrap round size={40} src={user.head_portrait} className='bor1'/>
						<dl className='ml10'>
							<dt><Text value={user.real_name}/></dt>
							{/* 职位 */}
							{
								user.position && <dd className='r100px bcm cf plr5 lh18'><Text value={user.position} /></dd>
							}
						</dl>
					</div>
					<ul className='h fx'>
						<LiComponent title='首页' onClick={()=>$fn.push(this,'/')} />
						<LiComponent title='消息' />
						<LiComponent title='设置' />
						<LiComponent title='导航' />
						<LiComponent title='退出' onClick={()=>{
							confirm.then(f=>{
								f.default({
									msg:'确认退出登录？',
									onOk: close => {
										$http.submit(null,'index/logout',{ loadingText:'退出登录中...' }).then(data=>{
											close()
											$fn.remove()
											message.then(f=>f.default.success('退出登录成功'))
											$fn.replace(this,'/login')
										})
									}
								})
							})
						}} />
					</ul>
				</header>
				<div className='rel ex'>
					<Router data={data} {...this.props}/>
				</div>
			</Page>
		)
	}
}

export default  withRouter(Frame)
