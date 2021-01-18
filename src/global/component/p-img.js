/* 薛玉梅 | 2020-12-28 14:45:55 | desc: 查看图片 */
import React from 'react'
// ===================================================================== global declare
import { CloseCircleOutlined, PlusCircleOutlined, MinusCircleOutlined, UndoOutlined, RedoOutlined } from '@ant-design/icons';
// ===================================================================== common
import coms from '@/private/js/common.js'
// ===================================================================== component
export default class extends React.Component{
	state = { 
        rotate: 0, 
        scale: 1,
        offsetX: 0, 
        offsetY: 0
	}  
	componentDidMount(){ 
    } 
    handleScale (to) {
        const { scale } = this.state
        if (to === 'add') {
            this.setState({scale: scale + 0.2}) 
        } else {    
            if (scale <= 0.4) { // 图片最小缩小为0.2倍
                this.setState({scale: 0.2}) 
            } else {
                this.setState({scale: scale - 0.2}) 
            }
        } 
    }
    handleRotate (to) {
        const { rotate } = this.state
        if (to === 'left') {
            this.setState({rotate: rotate - 90})
        } else {
            this.setState({rotate: rotate + 90})
        }  
    } 
    handleMove(e) {
        const { offsetX, offsetY } = this.state;
        const startX = e.pageX;
        const startY = e.pageY; 
        console.log(startX, startY)  
    } 
	render(){
		const { src } = this.props
		const { scale, rotate, offsetX, offsetY } = this.state
		return (
            <div className='fv h oh'>
                <div className='fxmr' style={{position:'relative', zIndex: 11, height: '40px', lineHeight: '40px', color: '#ffffff', borderBottom: '1px solid rgba(0,0,0,0.2)', paddingRight: '12px'}}>
                    <PlusCircleOutlined className='cp' style={{fontSize: '22px', marginRight: '16px'}} onClick={() => this.handleScale('add')} />
                    <MinusCircleOutlined className='cp' style={{fontSize: '22px', marginRight: '16px'}} onClick={() => this.handleScale('sub')} />
                    <UndoOutlined className='cp' style={{fontSize: '22px', marginRight: '16px'}} onClick={() => this.handleRotate('left')} />
                    <RedoOutlined className='cp' style={{fontSize: '22px', marginRight: '26px'}} onClick={() => this.handleRotate('right')} />
                    <CloseCircleOutlined className='cp' style={{fontSize: '25px', color: '#000000'}} onClick={() => this.props.onClose()} />
                </div>
                <div className='ex fxc oh'>
                    <img className='img-contain cp' style={{transform: `scale(${scale}) rotate(${rotate}deg)`, transition: 'transform 0.3s ease 0s', marginLeft: `${offsetX}px`, marginTop: `${offsetY}px`}}
                    src={coms.img_domain_url(src)} alt='暂无图片'
                    onMouseDown={e => this.handleMove(e)} />
                </div>
            </div>
		)
	}
}