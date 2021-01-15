import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Input = $async(()=>import('@antd/form/input'))
const Button = $async(()=>import('@antd/button'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== component
export default class extends React.Component{
	state = {
        form: {},
		id:$fn.query('id'),
		model: {}
	}
	async getDataAsync() {
		const { id } = this.state
		if (id) {
			$http.submit(null, 'kd-report-spec/info', {param: {uuid: id}}).then(data => {
				setTimeout(() => {
                    this.setState({form: data})
				})
			})
		}
	}
	componentDidMount(){
		this.getDataAsync()
	}
	render(){
		const { form, id } = this.state
		return (
			<Page title={id ? '查看报告单' : ''}>
				<div className='ex fv xplr pt10'>
                    <h6 className="w xmlr h40 bbor1 mb10">报告单基础信息</h6>
                    <div className='fxw'>
                        <div className='ant-row mb20' style={{width: '25%'}}>
                            <span>编号：</span><span className='b'>{form.spec_num}</span>
                        </div>
                        <div className='ant-row mb20' style={{width: '25%'}}>
                            <span>标本条码：</span><span className='b'>{form.spec_code}</span>
                        </div>
                        <div className='ant-row mb20' style={{width: '25%'}}>
                            <span>报告单路径：</span><span className='b'>{form.report_path}</span>
                        </div>
                        <div className='ant-row mb20' style={{width: '25%'}}>
                            <span>所属医院：</span><span className='b'>{form.hosp_name}</span>
                        </div>
                        <div className='ant-row mb20' style={{width: '25%'}}>
                            <span>所属派送人：</span><span className='b'>{form.salesman_name}</span>
                        </div>
                        <div className='ant-row mb20' style={{width: '25%'}}>
                            <span>生成时间：</span><span className='b'>{form.created_at}</span>
                        </div>
                        <div className='ant-row mb20' style={{width: '25%'}}>
                            <span>派送完成时间：</span><span className='b'>{form.update_at}</span>
                        </div>
                        <div className='ant-row mb20' style={{width: '25%'}}>
                            <span>报告单状态：</span><span className='b'>{form.status_name}</span>
                        </div>
                    </div>
                    <h6 className="w xmlr h40 bbor1 mb10">报告单数据</h6>
                    <Input value={form.json_data} width='100%' mode='textarea' rows={12} />
                    <div className='mt20 tc'>
                        <Button label='返回' size='large' ghost className='mr15' width={90} onClick={() => {
                            $fn.back(this)
                        }} />
                    </div>
				</div>
			</Page>
		)
	}
}