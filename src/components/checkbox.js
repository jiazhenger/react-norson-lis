/* ====================================== toast  ====================================== */
import React from 'react'
import { Checkbox } from 'antd'
// ===================================================================== Select
export default class Index extends React.Component {
	state = {
		
	}
	onChange = e => {
		const { onChange, name } = this.props
		this.setState({ value: e.target.checked },()=>{
			let rs = this.state.value ? false : true
			onChange && onChange( name ? { [name]: rs } : rs )
		})
	}
	
	setValue = value => this.setState({ value })
	
	clear = () => this.setValue(false)
	
	render(){
		const  { size, disabled, onClick, loading } = this.props
		const value = this.state.value === undefined ? this.props.value : this.state.value
		return (
			<Checkbox
				size			= { size || 'small' } 
				onChange		= { this.onChange }
				checked		 	= { value }
				disabled		= { disabled }
				loading			= { loading }
			/>
		)
	}
}