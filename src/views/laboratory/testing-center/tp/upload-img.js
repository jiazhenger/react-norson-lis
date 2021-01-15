/* 薛玉梅 | 2020-12-29 14:15:11 | desc: 检测中心上传图片组件 */
import React from 'react'
// ===================================================================== global declare
import coms from '@/private/js/common.js'
import { ArrowLeftOutlined, ArrowRightOutlined, ZoomInOutlined, DeleteOutlined } from '@ant-design/icons';
import Modal from '@antd/modal'
const { $async, $fn } = window

// ===================================================================== antd
const Upload = $async(() => import('@antd/upload')) 
const message = import('@antd/message')
const PImg = $async(()=>import('@cpt/p-img'))

// ===================================================================== component
const Title = ({ title, titleChildren }) => (
    <h3 className='fxm h30'><i className='r100px mr5' style={{ width: 5, height: 5, background: '#333' }}></i><span>{title}</span><div className='ex tr'>{titleChildren}</div></h3>
)
// ===================================================================== component
export default class extends React.Component {
    state = {
        data: [],
        imgModel: false,
        zoomImg: ''
    }
    uploads = (v) => { 
        const _data = $fn.hasArray(v) ? v.map(i => i.img_path) : [];
        const d = [..._data, ...this.state.data];
        this.setState({data: d}) 
        this.handleChange(d)
    }
    sortImg = (value, index, number) => {
        const { data } = this.state
        if (index === 0 && number === -1) { 
            message.then(f=>f.default.error('已经是第一个了'))
        } else if (index === data.length - 1 && number === 1) {
            message.then(f=>f.default.error('已经是最后一个了')) 
        } else {
            let d = data.filter(i => i !== value)
            d.splice(index + number, 0, value); 
            this.setState({data: d}) 
            this.handleChange(d)
        }
    }
    zoomImg = (item) => {
        this.setState({zoomImg: item, imgModel: true}) 
        this.refs.modal.open()
    }
    deleteImg = (value, index) => {
        const { data } = this.state
        data.splice(index, 1) 
        this.setState({data: data})
        this.handleChange(data)
    } 
    handleChange = (v) => { 
        this.props.handleChange && this.props.handleChange({[this.props.name]: v}, this.props.name) 
    } 
	componentWillReceiveProps ({value}) { 
        if (value !== this.state.data) {
            this.setState({data: $fn.hasArray(value) ? value : []})
        }
    } 
    componentDidMount () {
        const { value } = this.props 
        this.setState({data: $fn.hasArray(value) ? value : []})
    }
    render() {
        const { data } = this.state
        const { title } = this.props
        return (
            <>
                <Title title={title ? title : '图形'} titleChildren={
                    <Upload mode='upBtn' multiple={true} api='upload/img' params={{ modular: 126 }} onChange={(val) => this.uploads(val)} />
                } />
                <div className='fxw' style={{ minHeight: '100px', width: '100%' }}>
                    {data && data.map((j, i) => {
                        return (
                        <div key={i} className='bor1 upload-img-box' style={{position: 'relative', width: '100px', height: '100px', marginRight: '6px', marginBottom: '6px' }}>
                            <img style={{width: '100%', height: '100%',objectFit: 'contain'}} src={coms.img_domain_url(j)} />
                            <div className='upload-img-operation' style={{ position: 'absolute', zIndex: 50, bottom: '0', width: '100%', height: '30px', lineHeight: '30px', background: 'rgba(0,0,0,0.6)', textAlign: 'center', color: '#ffffff'}}>
                                <ArrowLeftOutlined style={{fontSize: '14px', marginRight: '10px'}} onClick={() => this.sortImg(j,i,-1)} />
                                <ArrowRightOutlined style={{fontSize: '14px', marginRight: '10px'}} onClick={() => this.sortImg(j,i,1)}  />
                                <ZoomInOutlined style={{fontSize: '14px', marginRight: '10px'}} onClick={() => this.zoomImg(j)} />
                                <DeleteOutlined style={{fontSize: '14px'}} onClick={() => this.deleteImg(j,i)} />
                            </div>
                        </div> 
                        )
                    })} 
                </div>  
                {/* 查看图片 */}  
                <Modal ref='modal' noTitle={true} width={0} noFooter mask={false} closable={false}>
                    <div className='view-image full'>
						<PImg src={this.state.zoomImg} onClose={() => {
                            this.setState({imgModel: false})
                            this.refs.modal.close()
                        }} /> 
					</div>
                </Modal>
            </>
        )
    }
}