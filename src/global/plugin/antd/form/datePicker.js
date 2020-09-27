/* ====================================== toast  ====================================== */
import React from 'react'
// ===================================================================== DatePicker
import { DatePicker, Pagination } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
// ===================================================================== declare
const { $fn } = window
moment.locale('zh-cn')
// ===================================================================== DatePicker
export default class extends React.Component{
	state = {}
	
	onChange = value => {
		const { onChange, name, range } = this.props
		
		const format = value => moment(value, { t: this.props.format}) 	// 将时间格式化为字符串
		
		this.setState({ value },()=>{
			if(onChange){
				let param = null
				if(range){
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
		const { type, width, size, showTime, className, range, p, disabled } = this.props
		const format = this.props.format || 'YYYY-MM-DD'
		
		let value = this.state.value === undefined ? this.props.value : this.state.value
			
		if($fn.isArray(value)){ 
			
		}else{
			
		}
		
		const Picker = range ? DatePicker.RangePicker : DatePicker
		return (
			<Picker
				value		= { value } 
				size		= { size || 'large' } 
				format  	= { format }
				onChange	= { this.onChange }
				showTime	= { showTime }
				style		= {{ width }} 
				className 	= { className?className:''}
				placeholder = { p } 
				disabledDate = { this.disabledBefore }
				disabled 	= { disabled }
			/>
		)
	}
}