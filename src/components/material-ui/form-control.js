import React from 'react'
// ===================================================================== material-ui
import { FormControl, InputLabel } from '@material-ui/core'
// ===================================================================== declare
// =====================================================================
const Wrap = props => (
	<div className={props.className?props.className:''}>
		<FormControls {...props} />
	</div>
)
export default class FormControls extends React.Component{
	static Wrap = Wrap
	
	
	render(){
		const { id, label, children } = this.props
		return (
			<FormControl className='w'>
				<InputLabel htmlFor={id}>{label}</InputLabel>
				{ children }
			</FormControl>
		)
	}
}
