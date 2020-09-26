import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== global template
const Text = $async(()=>import('@tp/text'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/content/content-aside'))
// ===================================================================== template

// ===================================================================== component
export default class extends React.Component{
	param = this.props.match.params
	componentDidMount(){
		console.log(this.param)
	}
	render(){
		return (
			<Page>
				设备列表
			</Page>
		)
	}
}