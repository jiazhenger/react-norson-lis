/* ====================================== toast  ====================================== */
import React from 'react'
import { Checkbox } from 'antd'
// ===================================================================== Select
export default class Index extends React.Component {
	state = {
		
	}
	onChange = e => {
		const { onChange, name } = this.props
		this.setState({ value: e.target.checked }, ()=>{
			let rs = this.state.value ? true : false
			onChange && onChange( name ? { [name]: rs } : rs )
		})
	}
	
	setValue = value => this.setState({ value })
	
	clear = () => this.setValue(false)
	
	render(){
		const  { size, disabled, loading, label, indeter, value, outer, onChange } = this.props
		let _value = null
		if(outer){
			_value = value
		}else{
			_value =  this.state.value === undefined ? value : this.state.value
		}
		return (
			<Checkbox
				size			= { size || 'small' } 
				onChange		= { outer ? onChange : this.onChange }
				checked		 	= { _value }
				indeterminate	= { indeter }
				disabled		= { disabled }
				loading			= { loading }
			>
				{label}
			</Checkbox>
		)
	}
}