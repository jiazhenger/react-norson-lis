/* ====================================== toast  ====================================== */
import React from 'react'
// ===================================================================== image
import DefImage from './svg/def-img'
// ===================================================================== 
const Center = props => {
	const { wrapClassName, wrapStyle, wrapWidth, wrapHeight, size, onWrapClick } = props
	const width = size ? size : wrapWidth
	const height = size ? size : wrapHeight
	return (
		<div onClick={onWrapClick} className={`fxmc ${wrapClassName||''}`} style={{...wrapStyle,width,height}}>
			<Image className={`${size ? 'h' : ''}`} {...props}/>
		</div>
	)
}

class Image extends React.Component{
	static Center = Center
	render(){
		const { src, width, height, style, className, onClick, alt, round, size } = this.props
		return src ? 	<img onClick={onClick} className={`w ${className||''} ${round?'r100px':''}`} style={{width:width,height,...style}} src={src} alt={alt||''}/> : 
						<DefImage size={size||width} />
	}
}

export default Image