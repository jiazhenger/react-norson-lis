import React from 'react'
// ===================================================================== material
import FormControl from './form-control'
import Select from './select'
// =====================================================================
const Wrap = props => (
	<div className={props.className?props.className:''}>
		<SelectField {...props} />
	</div>
)
export default class SelectField extends React.Component{
	static Wrap = Wrap
	
	componentDidMount(){
		if(this.props.value){ this.setValue(this.props.value) }
	}
	
	setValue = value => { this.setState({value: value }) }
	
	reset = () => this.setState({ value:'' })
	
	render(){
		const { label, auto, size, disabled, p, error, data, name, onChange, value } = this.props
		return (
			<FormControl label={label} id='a'>
				<Select
					labelId 	= 'a'
					value 		=  { value }
					name 		= { name }
					data 		= { data }
					disabled	= { disabled }
					label 		= { label }
					size 		= { size }
					className 	= {`${auto?'':'w'}`}
					onChange	= {onChange }
					placeholder	= { p ? p : '选择' + label }
					error		= { error }
					classes 	= {{
						
					}}
				/>
			</FormControl>
			
		)
	}
}
