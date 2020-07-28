import React from 'react'
// ===================================================================== material-ui
import { Dialog, Slide } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
// ===================================================================== private
const TransitionDown = React.forwardRef((props, ref) =>  <Slide direction='down' ref={ref} {...props} />)
const TransitionUp = React.forwardRef((props, ref) =>  <Slide direction='up' ref={ref} {...props} />)

const useStyles = makeStyles({
	paper: {
		background: 'none',
	}
})
const DialogComponent = ({ show, dir, children, onClick, fullScreen}) => {
	const classes = useStyles()
	let slide = ''
	if(dir === 'down') slide = TransitionDown
	else if(dir === 'up') slide = TransitionUp
	
	return (
		<Dialog
			open				= { show }
			TransitionComponent	= { slide }
			fullScreen			= { fullScreen }
			classes				= { classes }
			onClick 			= { onClick }
		>
			<div onClick={e=>e.stopPropagation()}>{ children }</div>
		</Dialog>
	)
}
// =====================================================================
export default class extends React.Component{
	state = {
		show:false
	}
	
	open = ()=> this.setState({show:true})
	close = ()=> this.setState({show:false})
	
	render(){
		const { show  } = this.state
		const { children, fullScreen, dir } = this.props
		return (
			<DialogComponent show={show} children={children} onClick={this.close} fullScreen={fullScreen} dir={dir} />
		)
	}
}
