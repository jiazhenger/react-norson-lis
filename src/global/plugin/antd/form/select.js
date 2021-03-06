/* ====================================== Select  ====================================== */
import React from 'react'
import { Select } from 'antd'
const { $fn } = window
// ===================================================================== 
export default class Index extends React.Component {
	state = {
		data:[],
	}
	
	onChange = (value, data) => {
		const { name, onChanged } = this.props
		const v = $fn.isEmpty(value) ? '' : value
		this.setState({ v },()=>{
			const obj = name ? { [name]: v } : v
			onChanged && onChanged(obj , data, name)
		})
	}
	
	setValue = value => this.setState({ value })
	getValue = () => this.state.value
	
	clear = () => this.setState({ value: '', key:this.state.key+1 })
	
	onDropdownVisibleChange = () => {
		setTimeout(()=>{
			Array.prototype.slice.call(document.querySelectorAll('.ant-select-dropdown'),0).forEach(v=>{
				v.addEventListener('mouseup',e => e.stopPropagation() )
			})
		}, 10);
	}
	dropdownRender = (menu) => {
		const { dropdownRender } = this.props
		dropdownRender && dropdownRender(menu)
		if (dropdownRender) {
			return dropdownRender(menu)
		} else {
			return <React.Fragment>{menu}</React.Fragment>
		}
	}
	
	render(){
		const { data, value, idStr, nameStr, p , width, size, style,isP, className, mode, disabled, loading, bordered, auto, noClear } = this.props
		const { key } = this.state
		const xdata = data || this.state.data
		const nStr = nameStr || 'name'
		const iStr = idStr || 'value'
		const t = p ? p : ''
		const borderedValue = bordered === false ? false : true
		const _size = size || 'small'
		const _value = this.state.value === undefined ? value : this.state.value
		const isClear = noClear ? false : true
		
		return (
			<Select 
				key 		= { key }
				size		= { _size } 
				onChange	= { this.onChange } 
				style		= {{ width,...style }} 
				value 		= { _value }
				className 	= {`${className?className:'w'} ${bordered===false ? 'input-bordered':''}`}
				placeholder	= { isP ? '请选择' + t :  t  }
				disabled 	= { !$fn.hasArray(xdata) || disabled }
				mode		= { mode }
				loading		= { loading }
				bordered	= { borderedValue }
				onDropdownVisibleChange = {this.onDropdownVisibleChange}
				showSearch
				allowClear  = { isClear }
				dropdownClassName = { _size === 'small' ? 'dropdown-small' : ''}
				dropdownMatchSelectWidth = {auto ? false : true}
				filterOption = { (inputValue, opiton)=>{
					return opiton.children.indexOf(inputValue) !== -1
				}}
				dropdownRender = {menu => this.dropdownRender(menu)}
			>
				{
					$fn.hasArray(xdata) && xdata.map((v,i)=>{
						return (
							<React.Fragment key={i}> 
								{
									v.group ? (
										<Select.OptGroup key={i} label={v.group}>
											{
												$fn.hasArray(v.children) && v.children.map((p, j) => <Select.Option key={p[iStr]} value={p[iStr]} style={{marginRight:'20px'}}>{p[nStr]}</Select.Option>)
											}
										</Select.OptGroup>
									): <Select.Option key={i} value={v[iStr]} style={{marginRight:'20px'}}>{v[nStr]}</Select.Option>
								}
							</React.Fragment>
						)
					})
				}
			</Select>
		)
	}
}