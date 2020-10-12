/* ====================================== toast  ====================================== */
import React from 'react'
// ===================================================================== DatePicker
import { DatePicker } from 'antd'
import $time from '@utils/moment'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
// ===================================================================== declare
const { $fn } = window
// ===================================================================== DatePicker
export default class extends React.Component{
	state = {}
	
	onChange = value => {
		const { onChange, name, range, format } = this.props
		const formatType = format === 1 ? 'ymd' : 'full'
		
		const $format = value => $time.format(value, { t: formatType }) 	// 将时间格式化为字符串
		
		this.setState({ value },()=>{
			let param = null
			if(range){
				if($fn.isArray(value)){
					let start = $format(value[0])
					let end = $format(value[1])
					param = $fn.isArray(name) ? { [name[0]]:start, [name[1]]: end } : { start, end }
				}else{
					param = $fn.isArray(name) ? { [name[0]]:null, [name[1]]: null } : { start:null, end:null }
				}
			}else{
				let time = $format(value)
				param = name ? { [name]: time } : time
			}
			if(onChange){
				
				onChange(param)
			}
		})
	}
	
	setValue = value =>  this.setState({ value: value})
	
	clear = () => this.setState({ value: '' })
	
	disabledBefore = current =>{
		if(this.props.before){
			return current && (current < Date.now() - 8.64e7)
		}else{
			return null
		}
	}
	disabledAfter = current =>{
		if(this.props.after){
			return current && (current > Date.now())
		}else{
			return null
		}
	}
	
	render(){
		const { width, size, showTime, className, range, p, disabled, format, value, bordered, before, after } = this.props
		const formatType = format === 1 ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
		let _value = this.state.value === undefined ? value : this.state.value
			
		if($fn.isArray(_value) && range){ 
			_value = [moment(_value[0], formatType), moment(_value[1], formatType)]
		}else{
			_value = _value ? moment(_value, formatType) : null
		}
		
		const Picker = range ? DatePicker.RangePicker : DatePicker
		return (
			<Picker
				value		= { _value } 
				size		= { size || 'small' } 
				format  	= { formatType }
				onChange	= { this.onChange }
				showTime	= { showTime }
				style		= {{ width }} 
				className 	= {`${className?className:''} ${bordered===false ? 'input-bordered':''}`}
				placeholder = { p } 
				disabledDate = { (before ? this.disabledBefore : (after ? this.disabledAfter : null)) }
				disabled 	= { disabled }
				bordered	= { bordered }
			/>
		)
	}
}