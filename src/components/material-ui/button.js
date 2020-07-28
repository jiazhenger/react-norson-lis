import React from 'react'
// ===================================================================== material-ui
import { Button } from '@material-ui/core'
// =====================================================================
const Wrap = props => (
	<div className={`${props.className?props.className:''} fxc`}>
		<Buttons {...props} />
	</div>
)
export default class Buttons extends React.Component{
	static Wrap = Wrap
	render(){
		const { type, label, onClick, children, loading, color, disabled, auto, size, variant, width, round, style, replace, push } = this.props
		let sizeStyle = { }
		let roundStyle = { }
		if(!size){
			sizeStyle={padding:'0 10px',height:'44px'}
		}
		if(round){
			roundStyle = {borderRadius:'20px'}
		}
		// 
		let click = onClick
		if(replace) click = ()=> this.props.history.replace(replace)
		else if(push) click = ()=> this.props.history.push(push)
		
		return (
			<Button
				type		= { type } 
				onClick		= { click }
				variant 	= { variant || 'contained' }  // 按钮类型
				disabled	= { disabled }
				color 		= { color ? color : 'primary' }
				className 	= {`${auto?'':'w'}`}
				size 		= { size || 'large' }
				style 		= {{ width, ...sizeStyle,...roundStyle,...style }}
			>
				{
					loading?<i className='ico-loading'></i>:null
				}
				<span>{label||children}</span>
			</Button>
		)
	}
}
