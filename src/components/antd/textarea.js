/* ====================================== toast  ====================================== */
import React from 'react'
import { Input } from 'antd'
// ===================================================================== Select
export default class Index extends React.Component {
	state = {
		value: this.props.value
	}
	onChange = e => {
		const { onChange, name } = this.props
		this.setState({ value: e.target.value},()=>{
			onChange && onChange( name ? {[name]:this.state.value} : this.state.value)
		})
	}
	setValue = value => {
		this.setState({ value: value})
	}
	clear = () => {
		this.setValue('')
	}
	render(){
		const  { p, type, width, size  } = this.props
		const value = this.state.value === undefined ? this.props.val : this.state.value
		return (
			<Input.TextArea 
				allowClear 		= {true }
				type			= { type } 
				size			= { size } 
				onChange		= { this.onChange }
				defaultValue 	= { value }
				style			= {{width}}
				placeholder		= {'请输入' + p } 
			/>
		)
	}
}