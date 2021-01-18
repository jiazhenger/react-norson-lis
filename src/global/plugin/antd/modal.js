/* ====================================== toast  ====================================== */
import React from 'react'
import { Modal } from 'antd'
import Button from '@antd/button'
// ===================================================================== 选择字典表数据
export default class extends React.Component {
    state = {
       
    }
	enter = e => {
		const code = e.code
		if(code === 'NumpadEnter'){
			e.preventDefault()
			this.onOk()
		}
	}
	componentDidMount(){
		window.addEventListener('keydown',this.enter)
	}
	componentWillUnmount(){
		window.removeEventListener('keydown',this.enter)
	}
    
    onOk = () => {
    	const { onOk } = this.props
    	onOk && onOk()
    }
    
    onCancel = () => {
    	const { onCancel} = this.props
    	this.close()
    	onCancel && onCancel()
    }
    
    open = () => this.setState({show:true})
    close = () => this.setState({show:false})
    
    Footer = ({ okText, noText, loading }) => (
    	<footer className='fxmc'>
			<Button round loading={loading} onClick={this.onCancel} style={{width:'100px'}} size='large' ghost type='primary'>{noText||'取消'}</Button>
			<Button round loading={loading} onClick={this.onOk} style={{width:'100px', marginLeft:'25px'}} size='large' type='primary'>{okText || '确认 Enter'}</Button>
    	</footer>
    )
    
    render(){
    	const { title, children, width, noFooter, centered, onClose, bodyStyle, mask, closable, noTitle } = this.props
		const visible = this.state.show === undefined ? this.props.show : this.state.show
    	return (
			<Modal
				title			= { noTitle ? '' : title || '提示' }
				width			= { width }
				visible 		= { visible }
				onOk			= { this.onOk }
				onCancel		= { this.onCancel }
				maskClosable 	= { false }
				centered		= { centered===undefined ? true : centered }
				footer			= { noFooter ? null : <this.Footer {...this.props} /> }
				destroyOnClose 	= { true }
				afterClose 		= { onClose }
				bodyStyle 		= { bodyStyle }
				forceRender		= { true }
				mask            = { String(mask) ? mask : true } // 显示蒙层
				closable        = { String(closable) ? closable : true } // 显示关闭图标
			>
				{ children }
			</Modal>
		)
    }
}