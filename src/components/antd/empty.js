/* ====================================== toast  ====================================== */
import React from 'react'
import { Empty, Spin } from 'antd'
const $fn = window.$fn
// ===================================================================== 

const Simple = props => <E image={Empty.PRESENTED_IMAGE_SIMPLE} {...props} />

export default class E extends React.Component{
	static Simple = Simple
	render(){
		const { data, children, text, image, loading, width, height, emptyClass } = this.props
		return (
			loading ? (
				<div className='fxmc' style={{height, width}}>
					<Spin tip='Loading...' style={{fontSize:'12px'}} />
				</div>
			) : (
				$fn.hasArray(data) || $fn.hasObject(data) ? children : (
					<div className={`w fxmc ${emptyClass?emptyClass:''}`} style={{height}}>
						<Empty image={image} description={text} style={{margin:0, color:'#999', fontSize:'12px'}} />
					</div>
				)
			)
			
		)
	}
}
