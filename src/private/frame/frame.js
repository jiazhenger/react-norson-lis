import React from 'react'
import { withRouter, NavLink } from 'react-router-dom'
// ===================================================================== antd
import Confirm from '@antd/confirm'
// import message from '@antd/message'
// ===================================================================== image
import Logo from '@img/logo.png'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
// const Confirm = $async(()=>import('@antd/confirm'))
const message = import('@antd/message')
// ===================================================================== private template
const Page = $async(()=>import('@tp/content'))
// ===================================================================== global template
const Image = $async(()=>import('@tp/image'))
const Text = $async(()=>import('@tp/text'))
// ===================================================================== private component
const Router = $async(()=>import('#frame/router'))
// ===================================================================== image
const LiComponent = ({ title, onClick }) => (
	<li className='fxmc c0 tap cp' style={{width:56}} onClick={onClick}>
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
	componentDidMount(){
		
	}
	render(){
		const { user } = this.state
		const { data } = this.props
		
		return (
			<Page className='fv'>
				<header className='bcf fxmc' style={{height:'56px'}}>
					<h2 className='fxmc bcm h cp hover-o' style={{width:$fn.menuWidth}} onClick={()=>$fn.push(this,'/')}>
						<Image width='120px' src={Logo}/>
					</h2>
					<nav className='ex fx h f13' id='nav'>
						{
							data.map((v,i)=>(
								<NavLink key={i} to={v.path} className='fxmc plr10 rel tap' activeClassName='active' >{v.title}</NavLink>
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
						<LiComponent title='退出' onClick={()=>this.refs.logout.open()} />
					</ul>
				</header>
				<Router data={data} {...this.props}/>
				<Confirm 
					ref='logout' 
					msg='确认退出登录？'
					onOk={()=>{
						$http.submit(null,'index/logout',{ loadingText:'退出登录中...' }).then(data=>{
							this.refs.logout.close()
							$fn.remove()
							message.then(f=>f.default.success('退出登录成功'))
							$fn.replace(this,'/login')
						})
					}}
				/>
			</Page>
		)
	}
}

export default  withRouter(Frame)
