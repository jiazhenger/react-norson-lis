/* ====================================== toast  ====================================== */
import React from 'react'
import Modal from './modal'
// ===================================================================== 选择字典表数据
export default class extends React.Component {
    onYes = () => {
    	const { onOk } = this.props
    	onOk && onOk()
    }

    open = () => this.refs.modal.open()
    
    close = () => this.refs.modal.close()
    
    render(){
    	const { title, loading, msg } = this.props
		return (
			<Modal loading={loading} title={title || '提示'} ref='modal' onOk={this.onYes} maskClose={false}>
				<p className='tc g2 f16'>{msg || '确认提交？'}</p>
			</Modal>
		)
    }
}