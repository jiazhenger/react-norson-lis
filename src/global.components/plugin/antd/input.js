/* ====================================== toast  ====================================== */
import React from 'react'
import { Input } from 'antd'
// ===================================================================== Select

export default class MyInput extends React.Component {
	state = { }
	
	static Search = props => <MyInput {...props} mode='search' />
	
	onChange = e => {
		const { onChange, name } = this.props
		this.setState({ value: e.target.value},()=>{
			onChange && onChange( name ? {[name]:this.state.value} : this.state.value, this.state.value)
		})
	}
	
	onSearch = v => {
		const { onChange, name } = this.props
		onChange && onChange( name ? {[name]:this.state.value} : this.state.value, this.state.value)
	}
	
	setValue = value => this.setState({ value })
	getValue = () => this.state.value
	
	clear = () => this.setValue('')
	
	getRef = () => this.refs.inputRef.input
	
	render(){
		const  { p, type, width, size, isP, clear, style, isCenter, readOnly, className, mode, loading, disabled } = this.props
		const value = this.state.value === undefined ? this.props.value : this.state.value
		let centerStyle = isCenter ? {textAlign:'center'} : null
		let height = {}
		if(size === 'x'){
			height = { height:'44px', fontSize:'16px'}
		}
		return (
			<>
				{
					mode === 'search' && (
						<Input.Search
							ref 			= 'inputRef'
							className		= { className?className:'' }
							allowClear 		= { clear === false ? false : true } 
							type			= { type } 
							size			= { size || 'large' } 
							onChange		= { this.onChange }
							onSearch 		= { this.onSearch }
							value		 	= { value }
							style			= {{width,...height,...centerStyle,...style}}
							placeholder		= { isP ?  '请输入' + p : p } 
							readOnly		= { readOnly }
							disabled		= { disabled }
							loading 		= { loading }
						/>
					)
				}
				{
					!mode && (
						<Input
							ref 			= 'inputRef'
							className		= { className?className:'' }
							allowClear 		= { clear === false ? false : true } 
							type			= { type } 
							size			= { size || 'large' } 
							onChange		= { this.onChange }
							value		 	= { value }
							style			= {{width,...height,...centerStyle,...style}}
							placeholder		= { isP ?  '请输入' + p : p } 
							readOnly		= { readOnly }
							disabled		= { disabled }
						/>
					)
				}
			</>
		)
	}
}