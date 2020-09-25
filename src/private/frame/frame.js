import React from 'react'
import { withRouter, NavLink } from 'react-router-dom'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== private template
const Page = $async(()=>import('@tp/content'))
// ===================================================================== global template
const Image = $async(()=>import('@tp/image'))
// ===================================================================== private component
const Router = $async(()=>import('#frame/router'))
// ===================================================================== image

// ===================================================================== component
class Frame extends React.Component{
	state = {
		
	}
	componentDidMount(){
		const { token } = $fn.getQuery()
		if(token){
			$fn.local('user',{token})
		}
	}
	render(){
		const { data } = this.props
		
		return (
			<Page className='fv'>
				<header style={{height:'56px'}}>
					{
						data.map((v,i)=><NavLink key={i} to={v.path} activeClassName='c0' >{v.title}</NavLink>)
					}
				</header>
				<Router data={data} {...this.props} rect/>
			</Page>
		)
	}
}

export default  withRouter(Frame)
