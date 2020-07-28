import React from 'react'
// ===================================================================== material-ui
import { Select, MenuItem, InputAdornment, IconButton } from '@material-ui/core'
import { HighlightOff } from '@material-ui/icons'
// ===================================================================== declare
const { $fn } = window
// =====================================================================
const Wrap = props => (
	<div className={props.className?props.className:''}>
		<Selects {...props} />
	</div>
)
export default class Selects extends React.Component{
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
		const { type, label, auto, size, disabled, p, error, data, id, native, value, hideClear } = this.props
		return (
			<Select
				value		= {  $fn.isValid(this.state.value) ? this.state.value : ($fn.isValid(value)?value:'') }
				disabled	= { disabled }
				id 			= { id }
				label 		= { label }
				size 		= { size }
				className 	= {`${auto?'':'w'}`}
				onChange	= { this.onChange }
				type 		= { type }
				placeholder	= { p ? p : '请选择' + label }
				error		= { error }
				native 		= { native }
				classes 	= {{
					
				}}
				endAdornment={
					($fn.isValid(this.state.value) && !hideClear) && <InputAdornment className='mr5' position='end'><IconButton onClick={this.onClear}><HighlightOff /></IconButton></InputAdornment>
				}
			>
				{
					$fn.hasArray(data) && data.map((v,i)=>(
						native ? <option key={i} value={v.value}>{v.label}</option> : 
								 <MenuItem key={i} value={v.value}>{v.label}</MenuItem>
					))
				}
			</Select>
		)
	}
}
