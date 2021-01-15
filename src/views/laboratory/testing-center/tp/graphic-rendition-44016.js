import React from 'react'
// ===================================================================== global declare
const { $async } = window 
// ===================================================================== component
const Button = $async(()=>import('@antd/button')) 
const Result1 = $async(()=>import('./result-44016-1'))
const Result2 = $async(()=>import('./result-44016-2'))
const Tabs = $async(()=>import('#tp/tabs')) 
// ===================================================================== component 
export default class extends React.Component{ 
	state = {
		status: 1
	}
	tabs = [
		{ title: '临床诊断', status: 1 },
		{ title: '图形与解释', status: 2 }, 
	]
	submits = () => {
		let ref = this.state.status === 1 ? 'Result1Ref' : 'Result2Ref'
		this[ref].submits()
	}
	render () {
		const { status } = this.state
		const { infos } = this.props
		return (
			<div className='bcf r5px fv h' style={{position: 'relative', width: '450px'}}>
				<Tabs 
					data={ this.tabs }
					onTabs = { (data, index) => { 
						this.setState({status: data.status} )
					}}
				/>
				<div style={{position: 'absolute', right: '10px', top: '0', height: '34px'}} className='fxmc' >
					<Button label='保存' className='ml10' onClick={() => this.submits()} />
				</div>
				{ status === 1 ?  
					<Result1 className='ex oxys' onRef={ ref => this.Result1Ref = ref } infos={infos} /> : <Result2 className='ex oxys' onRef={ ref => this.Result2Ref = ref } infos={infos} /> 
				}
			</div>
		) 
	}  
}