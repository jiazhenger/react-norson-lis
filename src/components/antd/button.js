/* ====================================== toast  ====================================== */
import React from 'react'
import { Button } from 'antd'
//import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { SearchOutlined } from '@ant-design/icons'
// ===================================================================== 按钮集合

const Search = props => <Btn htmlType='submit' loading={props.loading} {...props}>查询 <SearchOutlined/></Btn>
const Submit = props => <Btn htmlType='submit' loading={props.loading} {...props} />

export default class Btn extends React.Component{
	static Search = Search
	static Submit = Submit
	render(){
		const { type, size, icon, children, label, width, minWidth, className, onClick, loading, htmlType, disabled, style, ghost, round } = this.props
		let height = {}
		let radius = round ? {borderRadius:'100px'} : {borderRadius: '3px'}
		if(size === 'x'){
			height = { height:'44px', fontSize:'16px'}
		}else if( size === 'small'){
			height = { height:'30px', fontSize:'13px'}
		}
		return (
			<Button 
				className	= { className?className:'' } 
				style		= {{ width, minWidth, ...height, ...radius,  ...style }} 
				size		= { size||'large' } 
				type		= { type||'primary' } 
				loading		= { loading } 
				disabled	= { disabled } 
				onClick		= { onClick }
				htmlType 	= { htmlType }
				ghost 		= { ghost }
				icon 		= { icon }
			>
				{label||children}
			</Button>
		)
	}
}