/* ======================================  Input  ====================================== */
import React from 'react'
const { $fn } = window
// =====================================================================
class Input extends React.Component{
	state={
		value:this.props.value
	}
	
	onChange = e => {
		let value = e.target.value
		this.setState({value:value,change:true},()=>{
			this.props.onChange && this.props.onChange({[this.props.name]:value})
		})
	}
	
	componentDidMount(){
		if(this.props.value){ this.setValue(this.props.value) }
	}
	
	setValue = value => this.setState({value:value})
	
	clear = () => this.setValue('')
	
	render(){
		const { isFocus } = this.state
		const { className, p, readOnly, disabled, type, style, width, height, onClick, max, onFocus, onBlur } = this.props
		let value = this.state.value ? this.state.value : this.props.value
		if(!$fn.isValid(value)){ value = '' }
		return (
			<>
				{
					type ==='textarea' ?(
						<div className={`${className||''}`}>
							<textarea
								value		 = { value }
								placeholder	 = { p } 
								readOnly	 = { readOnly }
								onChange	 = { this.onChange }
								disabled     = { disabled ? 'disabled' : false }
								className	 = 'wh f14'
								style 		 = {{border:0,background:isFocus?'#fff':'transparent',padding:'5px 10px',color:'#2F364C',...style}}
								maxLength	 = { max }
								onFocus 	 = { ()=>this.setState({isFocus:true}) }
								onBlur 	 	 = { ()=>this.setState({isFocus:false}) }
							></textarea>
						</div>
					) : (
						<div className={`${className||''}`} style={{width:width,height:height,lineHeight:height,...style}}>
							<input
								value		 = { value }
								placeholder	 = { p } 
								readOnly	 = { readOnly }
								onChange	 = { this.onChange }
								onClick		 = { onClick }
								disabled     = { disabled ? 'disabled' : false }
								type 		 = { type || 'text' }
								className	 = { `wh f14 plr10 ${onClick?'tap':''}` }
								style 		 = {{border:0,background:'transparent',color:'#2F364C'}}
								maxLength	 = { max }
								onFocus 	 = { onFocus }
								onBlur 	 	 = { onBlur }
							/>
						</div>
					)
				}
			</>
		)
	}
}

export default class extends React.Component{
	static Textarea = props => <Input type='textarea' {...props} />
	
	render(){
		return <Input {...this.props} />
	}
}
