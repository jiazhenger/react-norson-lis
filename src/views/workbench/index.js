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
	componentDidMount(){
		
	}
	render(){
		return (
			<Page>
				index
			</Page>
		)
	}
}