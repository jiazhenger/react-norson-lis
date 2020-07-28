import React from 'react'
// ===================================================================== material-ui
import { TextField, InputAdornment, IconButton } from '@material-ui/core'
import { HighlightOff } from '@material-ui/icons'

const { $fn } = window
// =====================================================================
const Wrap = props => (
	<div className={props.className?props.className:''}>
		<TextFields {...props} />
	</div>
)
export default class TextFields extends React.Component{
	static Wrap = Wrap
	
	state={
		value:''
	}
	
	onChange = e => {
		let value = e.target.value
		this.setState({value:value,change:true},()=>{
			this.props.onChange({[this.props.name]:value})
		})
	}
	
	componentDidMount(){
		if(this.props.value){ this.setValue(this.props.value) }
	}
	
	setValue = value => { this.setState({value: value }) }
	
	reset = () => this.setState({ value:'' })
	onClear = () => {
		this.reset()
		this.props.onChange && this.props.onChange({[this.props.name]:null})
		this.props.onClear && this.props.onClear()
	}
	
	render(){
		const { type, label, auto, size, disabled, p, error, value, variant, hideClear } = this.props
		return (
			<TextField
				value		= {  $fn.isValid(this.state.value) ? this.state.value : ($fn.isValid(value)?value:'') }
				disabled	= { disabled }
				label 		= { label }
				size 		= { size }
				className 	= {`${auto?'':'w'}`}
				onChange	= { this.onChange }
				type 		= { type }
				variant		= { variant }
				placeholder	= { p ? p : '请输入' + label }
				error		= { error }
				InputProps={{
					endAdornment: (
						($fn.isValid(this.state.value) && !hideClear) && <InputAdornment position='end' style={{margin:0}}><IconButton onClick={this.onClear}><HighlightOff /></IconButton></InputAdornment>
					)
				}}
			/>
		)
	}
}
