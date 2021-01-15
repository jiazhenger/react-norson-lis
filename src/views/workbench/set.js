import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== global template
const Text = $async(()=>import('@tp/text'))
const Box = $async(()=>import('#tp/box/box'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/content/content-aside'))
// ===================================================================== template
const Image = $async(()=>import('@tp/image'))
// ===================================================================== image

const LiComponent = ({ title, context }) => (
	<li className='mt15 f12 fxm'>
		<div className='r2px mr10' style={{width:'4px',height:'4px',background:'#999'}}></div>
		<span className='g9'>{title}</span>
		<b>{context}</b>
	</li>
)
const HeaderComponent = ({ title, context }) => (
	<div className='fxm mt20'>
		<div className='r5px' style={{width:'10px',height:'10px',background:'#dbeefa'}}></div>
		<div className='r5px bcm' style={{width:'10px',height:'10px'}}></div>
		<h3 className='f14 ml10'>{title}</h3>
		<p className='ml5 f12' style={{color:'red'}}>修改</p>
	</div>
)
const MainComponent = ({ title, context }) => (
	<div className=' bbor1 mt20 ml20 ex' style={{height:'80px'}}>
		<h4 className='rbor1 g9'>{title}</h4>
		<p className='mt20'>{context}</p>
	</div>
)
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:{}
	}
	componentDidMount(){
		$http.submit(this,'employee/currentuser', { loadingText:'数据加载中...' }).then(data=>{
			this.setState({ data })
		})
	}
	render(){
		const { data } = this.state
		return (
			<Page className='fxj'>
				<Box className='p30' style={{width:'300px'}}>
					<div className='fxc mt40'>
						<Image width={80} />
					</div>
					<h2 className='f16 tc mt20'>{data.real_name}</h2>
					<ul className='mt20'>
						<LiComponent title='部门：'  context={data.dept}/>
						<LiComponent title='岗位：'  context={data.pgroup}/>
						<LiComponent title='员工编号：'  context={data.empl_name}/>
						<LiComponent title='手机号码：'  context={data.phone}/>
						<LiComponent title='英文名：'  context={data.en_name}/>
					</ul>
				</Box>
				<Box className='p30 ml5 ex'>
					<HeaderComponent title='个人信息'/>
					<div className='fxm'>
						<MainComponent title='员工姓名'  context={data.real_name}/>
						<MainComponent title='员工邮箱'  context={data.email}/>
						<MainComponent title='员工详情'  context={data.empl_name}/>
					</div>
					<HeaderComponent title='登录密码'/>
					<MainComponent title='登录密码'  context='******* ' />
					<HeaderComponent title='个人签名'/>
				</Box>
			</Page>
		)
	}
}