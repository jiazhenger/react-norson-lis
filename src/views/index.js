import React from 'react'
import { useHistory } from 'react-router-dom'
// ===================================================================== image
import Logo from '@img/logo.png'
import InfoImage from '@img/index/info.png'
import BgImage from '@img/index/bg.png'

import Laboratory from '@img/index/menu-laboratory.png'
import Lgistics from '@img/index/menu-lgistics.png'
import Administrators from '@img/index/menu-administrators.png'
import Business from '@img/index/menu-business.png'
import Service from '@img/index/menu-service.png'
import Finance from '@img/index/menu-finance.png'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== global template
const Image = $async(()=>import('@tp/image'))
const Text = $async(()=>import('@tp/text'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/content/content-page'))
// ===================================================================== template

// ===================================================================== component
export default () => {
	const history = useHistory( )
	const [user, setUser] = React.useState({})
	const [news, setNews] = React.useState({})
	
	React.useEffect(()=>{
		setUser($fn.getUser())
		$http.pull(null,'msg-notice/getnewest', { loading:true }).then(data=>{
			setNews(data)
		})
	},[])
	// 菜单列表
	const LiComponent = React.useCallback(({ title, url, icon, path }) => (
		<li className='cp' onClick={()=>history.push(`/${path}`)}>
			<div className='fxmc bg' style={{width:180,height:180,background:`url(${BgImage}) no-repeat center/cover`}}>
				<div style={{width:100}}><Image src={icon}/></div>
			</div>
			<h3 className='tc mt20 f14'>{title}</h3>
		</li>
	), [history])
	
	return (
		<Page contentClassName='fv wh oh'>
			<header className='bcf fxm plr20 g6' style={{height:60}}>
				{/* logo */}
				<div style={{width:120}}><Image src={ Logo }/></div>
				{/* 消息 */}
				<div className='fxm ml50 ex'>
					<div style={{width:18}}><Image src={ InfoImage }/></div>
					<p className='g6 ml24 ml10 ex omits-1'><Text value={news.title} /></p>
				</div>
				{/* 账户创建时间 */}
				<time className='mr15'><Text value={user.created_at}/></time>
				{/* 头像 */}
				<Image wrap round size={40} src={user.head_portrait} className='bor1'/>
				{/* 姓名 */}
				<div className='ml10'><Text value={user.real_name} /></div>
				{/* 职位 */}
				<div className='ml15'><span className='mr5'>职位:</span><Text value={user.position} /></div>
			</header>
			<section className='ex bcm fv cf'>
				<div className='ex fv' style={{width:1200,margin:'0 auto'}}>,
					{/* 文本 */}
					<hgroup style={{paddingTop: '2%' }}>
						<h2 className='lh' style={{fontSize:38,letterSpacing:10}}>诺森检验</h2>
						<h3 className='lh f16 mt20'>致力于做民众身边的健康管理专家</h3>
						<div className='bcf mt15' style={{height:3,width:100}}></div>
					</hgroup>
					{/* 菜单 */}
					<div className='ex fxm'>
						<ul className='lh30 ex fxmj index-menu-list'>
							<LiComponent title='实验室系统' icon={Laboratory} path='laboratory' />
							<LiComponent title='物流系统' icon={Lgistics} path='lgistics' />
							<LiComponent title='管理员系统' icon={Administrators} path='administrators' />
							<LiComponent title='业务系统' icon={Business} path='business' />
							<LiComponent title='客服系统' icon={Service} path='service' />
							<LiComponent title='财务系统' icon={Finance} path='finance' />
						</ul>
					</div>
				</div>
				<footer className='f12 tc h50 i'>成都诺森医学检验-LIS系统（试运行版）</footer>
			</section>
			<footer className='f12 fxmc c0 h40'>
				<p>电话：<span className='ar'>028-61037888</span> 传真：<span className='ar'>028-61037888</span> 邮箱：<span className='ar'>norson@norsonmed.com</span></p>
				<p className='mlr5'>|</p>
				<p><span className='ar'>Copyright@2017</span> 诺森医学检验版权所有​ 网站备案号： 蜀ICP备16034622号</p>
			</footer>
		</Page>
	)
}