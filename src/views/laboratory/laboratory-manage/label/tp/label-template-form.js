import React from 'react'
// ================================================================== global declare
const { $fn, $async } = window
// ================================================================== global antd
const Form = $async(() => import('@antd/form/form'))
const Item = $async(() => import('@antd/form/item'))
const Button = $async(() => import('@antd/button'))
const Input = $async(() => import('@antd/form/input'))
const Select = $async(() => import('@antd/form/select'))
const Checkbox = $async(()=>import('@antd/form/checkbox'))
const Title = $async(()=>import('#tp/title'))
// =================================================================
const addItem = { sortLabel: '位置排序', sortName: 'sort', contentLabel: '内容', contentName: 'content' }
export default class extends React.Component {
    state = {
        paperTypeOption: [],
        checked: false,
        loading: false,
        addList: [
            { sortLabel: '位置排序', sortName: 'sort', contentLabel: '内容', contentName: 'content' },
        ]
    }
    componentDidMount(){
		$fn.getDisItem({
			code: 38000,
			callback: (data) => {
				this.setState({paperTypeOption: data})
			}
		})
    }
    
    render() {
        const { paperTypeOption, addList, checked, loading } = this.state
        const { onClose } = this.props
        return (
            <Form className='submit-form small-form fv ex ' layout='horizontal'>
                <div className='ex rel'>
                    <div className='fxw'>
                        <Item label='标签模板名称' name='tpl_number' rules={[{ required: true }]}>
                            <Input p='请输入标签模板名称' width={180} bordered={false} size='middle' />
                        </Item>
                        <Item label='纸型' name='tpl_number'>
                            <Select data={paperTypeOption} p='请选择纸型' width={180} bordered={false} size='middle' onChanged={(n,press) => {}}/> 
                        </Item>
                    </div>
                    <div className='mt15 ml20'><Checkbox value={checked} label='只显示当前打印机支持的纸型' onChange={v=>{}} /></div>
                    <div className={`wh fv r5px bcf`}>
                        <Title title='内容设置' noPadding={true}>
                            <Button label='增加' loading={loading} onClick={v=>{
                                const list = addList
                                list.push(addItem)
                                this.setState({addList: list})
                                console.log(addList)
                            }} />
                        </Title>
                    </div>
                    <div className=''>
                        {
                            $fn.hasArray(addList) && addList.map((item, index) => {
                                return (
                                    <div  key={index} className='fxw fxm mt20'>
                                        <Item label={item.sortLabel} name={item.sortName} rules={[{ required: item.required }]}>
                                            <Input p={`请输入${item.sortLabel}`} width={120} bordered={false} size='middle' />
                                        </Item>
                                        <Item label={item.contentLabel} name={item.contentName} rules={[{ required: item.required }]}>
                                            <Select data={paperTypeOption} p='请选择内容' width={120} bordered={false} size='middle' onChanged={(n,press) => {}}/>
                                        </Item>
                                        <Button className='ml40' label='删除' loading={loading} onClick={v=>{}} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='fxmc mt20'>
					<Button label='取消' ghost className='mr15' size='middle' width={90} onClick={onClose} />
					<Button label='确定 Enter' htmlType='sbumit' size='middle' width={90} />
				</div>
            </Form>
        )
    }
}