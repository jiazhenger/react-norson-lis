/* ====================================== toast  ====================================== */
import React from 'react'
import { Input } from 'antd'
// ===================================================================== Select

export default class extends React.Component {
	state = { }

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
		const  { p, type, width, size, clear, style, isCenter, readOnly, className, mode, disabled, prefix, iconRender, bordered, onPressEnter } = this.props
		const value = this.state.value === undefined ? this.props.value : this.state.value
		let centerStyle = isCenter ? {textAlign:'center'} : null
		const borderedValue = bordered === false ? false : true
		const MyInput = mode === 'password' ? Input.Password : Input
		const props = mode === 'password' ? { iconRender : iconRender } : {}
		return (
			<MyInput
				ref 			= 'inputRef'
				className		= { className?className:'' }
				allowClear 		= { clear === false ? false : true } 
				type			= { type } 
				size			= { size || 'small' } 
				onChange		= { this.onChange }
				onPressEnter	= { this.onPressEnter }
				value		 	= { value }
				style			= {{width,...centerStyle,...style}}
				placeholder		= { p } 
				readOnly		= { readOnly }
				disabled		= { disabled }
				prefix			= { prefix }
				prefix			= { prefix }
				bordered		= { borderedValue }
				{...props}
			/>
		)
	}
}