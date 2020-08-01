/* ====================================== toast  ====================================== */
import React from 'react'
import { DatePicker } from 'antd'
import moment from 'moment'
const { $fn } = window
const prefix = '请选择'
// ===================================================================== DatePicker
class Picker extends React.Component{
	state = {}
	
	onChange = value => {
		const { onChange, name, isRange } = this.props
		
		const format = value => $fn.format(value, { format: this.props.format, v:1 }) 	// 将时间格式化为字符串
		
		this.setState({ value },()=>{
			if(onChange){
				let param = null
				if(isRange){
					if($fn.isArray(value)){
						let start = format(value[0])
						let end = format(value[1])
						param = $fn.isArray(name) ? { [name[0]]:start, [name[1]]: end } : { start, end }
					}else{
						param = $fn.isArray(name) ? { [name[0]]:null, [name[1]]: null } : { start:null, end:null }
					}
				}else{
					let time = format(value)
					param = name ? { [name]: time } : time
				}
				onChange(param)
			}
		})
	}
	
	setValue = value =>  this.setState({ value: value})
	
	clear = () => this.setState({ value: '' })
	
	disabledBefore = current =>{
		if(this.props.disabledBefore){
			return current && (current < Date.now() - 8.64e7)
		}else{
			return null
		}
	}
	
	render(){
		const { type, width, size, isP, isRange, className } = this.props
		const format = this.props.format || 'YYYY-MM-DD'
		let p = this.props.p || '日期'
		
		let value = this.state.value === undefined ? this.props.value : this.state.value
			
		if($fn.isArray(value) && isRange){ 
			value = [moment(value[0], format), moment(value[1], format)]
			p = this.props.p || ''
		}else{
			value = value ? moment(value, format) : null
		}
		
		return (
			isRange ? (
				<DatePicker.RangePicker
					type 		= { type }
					value		= { value } 
					size		= { size || 'large' } 
					onChange	= { this.onChange }
					style		= {{ width }} 
					format 	 	= { format }
					className 	= { className?className:''}
					placeholder = { [
							(isP ? prefix + p : p) + '开始日期',
							(isP ? prefix + p : p) + '结束日期'
					] }
				/>
			) : <DatePicker 
				type 		= { type }
				value		= { value } 
				size		= { size || 'large' } 
				format  	= { format }
				onChange	= { this.onChange } 
				style		= {{ width }} 
				className 	= { className?className:''}
				placeholder = { isP ? prefix + p : p } 
				disabledDate = { this.disabledBefore }
			/>
		)
	}
}

export default class extends React.Component{
	static Range = props => <Picker isRange {...props} />
	render(){
		return <Picker {...this.props} />
	}
}
