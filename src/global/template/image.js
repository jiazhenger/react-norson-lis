/* ====================================== toast  ====================================== */
import React from 'react'
// ===================================================================== image
import DefImage from './svg/def-img'
// ===================================================================== 
export default ({ src, width, height, style, className, onClick, alt, round, size, wrap }) => {
	const _width = size ? size : width
	const _height = size ? size : height
	const wrapStyle = {width:_width,height:_height,...style}
	const _alt = alt || ''
	let img = <img draggable={false} onClick={onClick} className={`w ${className||''} ${round?'r100px':''}`} style={wrapStyle} src={src} alt={_alt}/>
	if(wrap){
		img = (
			<div className={`${className||''} ${round?'r100px':''}`} style={wrapStyle} onClick={onClick}>
				<img draggable={false} className={` ${size?'wh':'w'} ${round?'r100px':''}`}  src={src} alt={_alt}/>
			</div>
		)
	}
	return src ? img : <DefImage size={size||width} />
}