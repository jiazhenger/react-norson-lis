/* ====================================== toast  ====================================== */
import React from 'react'
import { Select } from 'antd'
const { $fn } = window
// ===================================================================== Select
export default class Index extends React.Component {
	state = {
		data:[],
	}
	
	onChange = (value, data) => {
		const { onChange, name } = this.props
		this.setState({ value },()=>{
			onChange && onChange( name ? {[name]:value} : value, data)
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
	
	render(){
		const { data, idStr, nameStr, p , width, size, style,isP, className, mode, disabled } = this.props
		const { key } = this.state
		const xdata = data || this.state.data
		const nStr = nameStr || 'label'
		const iStr = idStr || 'value'
		const t = p ? p : ''
		
		const value = this.state.value === undefined ? this.props.value : this.state.value
		
		let height = {}
		
		return (
			<Select 
				key 		= { key }
				size		= { size || 'large' } 
				onChange	= { this.onChange } 
				style		= {{ width,...height,...style }} 
				value 		= { value }
				className 	= { className||'w'}
				placeholder	= { isP ? '请选择' + t :  t  }
				disabled 	= { !$fn.hasArray(xdata) || disabled }
				mode		= { mode }
				onDropdownVisibleChange = {this.onDropdownVisibleChange}
				showSearch
				allowClear
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