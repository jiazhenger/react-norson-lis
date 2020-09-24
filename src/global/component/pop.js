/* ====================================== toast  ====================================== */
import React from 'react'
import AddLast from './add-last'
import Close from './svg/close'
const $fn = window.$fn
// ===================================================================== 
export default class extends React.Component{
	state = {
		show:this.props.show
	}
	// 打开
	open = () => {
		const { onOpen } = this.props
		this.setState({show:false},()=>{
			setTimeout(()=>{
				this.setState({show:true},()=>{
					onOpen && onOpen()
				})
			})
		})
	}
	// 关闭
	close = () => {
		const { onClose } = this.props
		this.setState({show:false},()=>{
			onClose && onClose()
		})
	}
	// 遮罩关闭
	onMaskClose = () => {
		if(this.props.maskClose || this.props.mode === 'down'){ this.close() }
	}
	render(){
		const { show } = this.state
		const { children, width, mode, title, hideClose, titleAlign, height, borderRadius, className, style, footer, minHeight, maxHeight, contentStyle,contentClassName, top, headerStyle, el, isScroll} = this.props
		const radius = borderRadius || '5px' 	// 弹窗圆角
		let popWidth = width ||'90%' 			// 弹窗宽度
		const minStyle = minHeight === null ? {} : { minHeight:minHeight || '150px'}
		// 默认隐藏样式
		const defaultStyle = {
			zIndex: -1,
			opacity: 0,
			background:'rgba(0,0,0,.6)'
		}
		// 显示样式
		const showStyle = {
			opacity: 1,
			zIndex:1005,
			transform:'translateY(0)'
		}
		// 最外层的显示与隐藏样式
		const rsShowStyle = show ? showStyle: defaultStyle
		// 上滑、下滑样式判断
		const upShowStyle = show ? showStyle : { transform:'translateY(100%)' }
		const downShowStyle = show ? showStyle : { transform:'translateY(-100%)' }
		let slideStyle = {} 		// 弹窗显示与隐藏样式
		let site = 'fxmc' 			// 弹窗初始位置
		let contentRadius = radius 	// 弹窗圆角
		if(mode==='up'){ 
			slideStyle = upShowStyle
			site = 'xb'
			contentRadius = popWidth === '100%' ? 0 : `${radius} ${radius} 0 0`
		}else if(mode==='down'){ 
			slideStyle = downShowStyle
			site = 'xt'
			contentRadius = 0
			popWidth = '100%'
		}
		
		const CloseComponent = () => <div onClick={this.close} className='abs_rt fxmc tap oh h50' style={{width:'50px',borderRadius:`0 ${radius} ${radius} 0`}}><Close size='20px' /></div>
		return (
			<AddLast name='pop' isUpdate el={el}>
				<div className={`fix wh linear`} style={{background:'rgba(0,0,0,.6)',left:0,top:top||0,...rsShowStyle}}>
					<div className={`wh fxc ${site}`} onClick={this.onMaskClose}>
						<div 
							className	={ `bcf fv linear rel ${className||''}` } 
							style		={{ width: popWidth,height:height,maxHeight:maxHeight||'100%',borderRadius:contentRadius,...minStyle,...slideStyle,...style }} 
							onClick		={ e => e.stopPropagation() }
						>
							{
								$fn.isValid(title) ? (
									<header className={`h50 f16 bbor1 b rel ${titleAlign?titleAlign:'tc'}`} style={headerStyle}>
										{title}
									</header>
								) : null
							}
							<div className={`ex ${isScroll ? 'oys' : ''} rel ${contentClassName?contentClassName:''}`} style={contentStyle}>{children}</div>
							{ footer&& footer }
							{
								!hideClose && <CloseComponent />
							}
						</div>
					</div>
				</div>
			</AddLast>
		)
	}
}