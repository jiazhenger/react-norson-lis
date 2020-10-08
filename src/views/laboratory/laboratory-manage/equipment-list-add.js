import React from 'react'
// ===================================================================== antd
import Confirm from '@antd/confirm'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== global template
const Text = $async(()=>import('@tp/text'))
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// ===================================================================== private template
const Page = $async(()=>import('#tp/content/content-aside'))
const Container = $async(()=>import('#tp/box/container'))
// ===================================================================== private component

// ===================================================================== component
export default class extends React.Component{
	state = {
		
	}
	
	componentDidMount(){
		
	}
	render(){
		return (
			<Page>
				<Container title='添加设备'>
					4564554
				</Container>
			</Page>
		)
	}
}