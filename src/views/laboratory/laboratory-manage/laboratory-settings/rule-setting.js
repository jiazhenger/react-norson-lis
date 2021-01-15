import React from 'react'
import { Radio } from 'antd';
// ===================================================================== global declare
const { $http, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== component
export default class extends React.Component{
	state = {
        check_user_conf: ''
    }
    form = [
        { label: '主检、审核不能为同一人',          value: '0' },
        { label: '主检、批准不能为同一人',          value: '1' },
        { label: '审核、批准不能为同一人',          value: '2' },
        { label: '主检、审核、批准不能为同一人',    value: '3' },
    ]
	componentDidMount(){
		$http.submit(null, 'conf-lab-settings/info').then(data => {
            setTimeout(() => {
                this.setState({check_user_conf: data.check_user_conf})
            })
        })
    }
    onChange = e => {
        this.setState({
            check_user_conf: e.target.value,
        });
    };
	render(){
        const { check_user_conf } = this.state
		return (
			<Page title='规则设置'>
                <div className='ex fv xplr pt10'>
                    <h6 className="w xmlr h40 bbor1 mb10">报告单基础信息</h6>
                    <div className='mb20'>
                        <Radio.Group onChange={this.onChange} value={check_user_conf}>
                            {
                                this.form.map(item => {
                                    return <div className='mb20' key={item.value}><Radio value={item.value}>{item.label}</Radio></div>
                                })
                            }
                        </Radio.Group>
                    </div>
                    <div className='mt20 tc'>
                        <Button label='保存' size='large' className='mr15' width={90} onClick={() => {
                            $http.submit(null, 'conf-lab-settings/add', {param: {check_user_conf}}).then(data => {
                                message.then(f => f.default.success('保存成功'))
                            })
                        }} />
                    </div>
                </div>
			</Page>
		)
	}
}