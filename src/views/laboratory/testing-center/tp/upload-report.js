/* 薛玉梅 | 2020-12-29 15:14:46 | desc: 检测中心上传报告单组件 */ 
import React from 'react'
// ===================================================================== global declare
import coms from '@/private/js/common.js'
import ReportClose from '@img/rp-close.png' 
import ReportImg from '@img/report.png' 
const { $async } = window
// ===================================================================== antd
const Upload = $async(() => import('@antd/upload'))  

// ===================================================================== component
const Title = ({ title, titleChildren }) => (
    <h3 className='fxm h30'><i className='r100px mr5' style={{ width: 5, height: 5, background: '#333' }}></i><span>{title}</span><div className='ex tr'>{titleChildren}</div></h3>
)
// ===================================================================== component
export default class extends React.Component {
    state = {
        imgs: ''
    }
    uploads = (v) => { 
        console.log(v)
        this.setState({imgs: v})   
        this.handleChange(v)
    } 
    deleteImg = () => { 
        this.setState({imgs: ''}) 
        this.handleChange()
    } 
    opendImg = () => {
        window.open(coms.img_domain_url(this.state.imgs))
    }
	componentWillReceiveProps ({value}) {
        if (value !== this.state.imgs) {
            this.setState({imgs: typeof(value) === 'string'} ? value : '') 
        }
    } 
    handleChange = (v) => { 
        this.props.handleChange && this.props.handleChange({[this.props.name]: v}, this.props.name) 
    } 
    render() {
        const { imgs } = this.state
        const { title } = this.props
        return (
            <>
                <Title title={title ? title : '报告单'} titleChildren={
                    <Upload mode='upBtn' multiple={false} api='upload/img' params={{ modular: 126, type: 2 }} onChange={(val) => this.uploads(val)} />
                } />
                <div className='fxw' style={{ minHeight: '100px', width: '100%' }}> 
                    { imgs && 
                        <div className='bor1 upload-img-box' style={{position: 'relative', width: '100px', height: '100px', marginRight: '6px', marginBottom: '6px', textAlign: 'center' }}>
                            <div>
                                <img className='db cp' style={{margin: '0 0 0 auto', height: '20px' }} src={ReportClose} onClick={() => this.deleteImg()} />
                            </div>
                            <img style={{width: '37px', height: '43px', display: 'inline', marginTop: '10px'}} src={ReportImg} onClick={() => this.opendImg()} /> 
                        </div> 
                    } 
                </div>   
            </>
        )
    }
}