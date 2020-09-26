/* ====================================== toast  ====================================== */
import React from 'react'
import { Modal } from 'antd'
import Button from '@antd/button'
// ===================================================================== 选择字典表数据
export default class Index extends React.Component {
    state = {
       
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
			<Button round loading={loading} onClick={this.onOk} style={{width:'100px', marginLeft:'25px'}} size='large' type='primary'>{okText || '确认'}</Button>
    	</footer>
    )
    
    render(){
    	const { title, children, maskClose, width, noFooter, centered, destroy, onClose, bodyStyle } = this.props
    	const visible = this.state.show === undefined ? this.props.show : this.state.show
    	return (
			<Modal
				title			= { title || '提示' }
				width			= { width }
				visible 		= { visible }
				onOk			= { this.onOk }
				onCancel		= { this.onCancel }
				maskClosable 	= { maskClose }
				centered		= { centered===undefined ? true : centered }
				footer			= { noFooter ? null : <this.Footer {...this.props} /> }
				destroyOnClose 	= { destroy }
				afterClose 		= { onClose }
				bodyStyle 		= {bodyStyle}
			>
				{ children }
			</Modal>
		)
    }
}