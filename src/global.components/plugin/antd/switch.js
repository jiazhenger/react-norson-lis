/* ====================================== toast  ====================================== */
import React from 'react'
import { Switch } from 'antd'
// ===================================================================== Select
export default class Index extends React.Component {
	state = {
		
	}
	onChange = value => {
		const { onChange, name, bool } = this.props
		this.setState({ value },()=>{
			let rs = bool ? value : this.state.value
			onChange && onChange( name ? { [name]: rs } : rs )
		})
	}
	setValue = value => this.setState({ value })
	
	clear = () => this.setValue(false)
	
	render(){
		const  { size, disabled, onClick, loading, bool } = this.props
		let value = this.state.value === undefined ? this.props.value : this.state.value
		let rs = null
		if(bool){
			rs = value
		}else{
			rs =  value === 0 || value === true ? true : false
		}
		return (
			<Switch
				size			= { size || 'large' } 
				onChange		= { onClick ? null : this.onChange }
				onClick			= { onClick }
				checked		 	= { rs }
				disabled		= { disabled }
				loading			= { loading }
			/>
		)
	}
}