import React from 'react'
// ==============================================================
import Modal from '@antd/modal'
import { Input } from 'antd';
const { $http, $fn, $async } = window
// ============================================================== antd
const Form = $async(()=>import('@antd/form/form'))
const Item = $async(()=>import('@antd/form/item'))
const Button = $async(()=>import('@antd/button'))
const Input1 = $async(()=>import('@antd/form/input'))
const Select = $async(()=>import('@antd/form/select'))
const message = import('@antd/message')
// ============================================================== private component
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const cacheApi = import('@/private/api/cacheApi')
// ==============================================================
const _bordered = false
const _width = '50%'
const _width2 = '25%'
const _size = 'middle'
const mb = 20
export default class extends React.Component{
    state = {
        checkMethodOption: [],
        resultUnitOption: [],
        resultTypeOption: [],
        resultTipsOption: [],
        resultDisOption: [],
        forms: {
            kind_name: '',
            short_name: '',
            name_en: '',
            name_short_en: '',
            kind_code: '',
            check_method: '',
            debit_code: '',
            memo: '',
            superiorquality: '',
            result_type: '',
            result_tips_temp: '',
            result_default_value: '',
            result_dis_code: '',
            result_formula: '',
            result_unit: '',
            decimal_point: '',
            clinical_range: '',
            clinical_range_end: '',
            linear_range: '',
            linear_range_end: ''
        },
        submit: [
            { label: '字典名称',	name:'item_name',	full: true,	width: '100%'},
            { label: '描述',		name:'remark',		full: true,	width: '100%',	type: 'textarea'},
        ]
    }
    componentDidMount() {
        cacheApi.then(f => {
            const d = f.default
			// 所属字典分类
			$fn.getCache({
				cache: d.dictionarySelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
						this.setState({resultDisOption: data})
                    } else {
                        $http.submit(null, $fn.replaceApi(d.dictionarySelect)).then(data => {
							this.setState({resultDisOption: data})
                            $fn.setCache()
                        })
                    }
				}
            })
            // 结果提示类型
            $fn.getCache({
				cache: d.resultTipsTempSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
						this.setState({resultTipsOption: data})
                    } else {
                        $http.submit(null, $fn.replaceApi(d.resultTipsTempSelect)).then(data => {
							this.setState({resultTipsOption: data})
                            $fn.setCache()
                        })
                    }
				}
            })
        })
        // 检测方法
        $fn.getDisItem({
            code: 16000,
            callback: data=>{
                this.setState({checkMethodOption: data})
            }
        })
        // 结果单位
        $fn.getDisItem({
            code: 18000,
            callback: data=>{
                this.setState({resultUnitOption: data})
            }
        })
        // 结果类型
        $fn.getDisItem({
            code: 1200,
            callback: data=>{
                this.setState({resultTypeOption: data})
            }
        })

    }

    initForm = form => {
       this.form = form
       setTimeout(()=>{
           if($fn.hasObject(this.props.info)){
                this.form && this.form.setFieldsValue(this.props.info)
                this.setState({forms: this.props.info})
           }
       },500)
    }
    onChange = (v, name) => {
        const {forms} = this.state  
        let d = Object.assign({}, forms, {[name]: v})
        this.setState({forms: d})
    }
    onClick = () => {
		const { submit } = this.state
		this.refs.modal.open()
		submit.forEach(i=>i.value='')
    }
    
    render() {
        const { forms, submit } = this.state
        return (
            <>
                <Form className='submit-form small-form fv fx' layout='horizontal' init={this.initForm}>
                    <div className='fxw'>
                        <h6 className='w xmlr h40 bbor1 mb10'>项目基本信息</h6>
                        <Item label='项目全称' name='kind_name' width={_width} mb={mb}>
                            <Input1 p='请输入项目全称' bordered={_bordered} size={_size} value={forms.kind_name} />
                        </Item>
                        <Item label='项目简称' name='short_name' width={_width} mb={mb}>
                            <Input1 p='请输入项目简称' bordered={_bordered} size={_size} value={forms.short_name} />
                        </Item>
                        <Item label='英文全称' name='name_en' width={_width} mb={mb}>
                            <Input1 p='请输入英文全称' bordered={_bordered} size={_size} value={forms.name_en} />
                        </Item>
                        <Item label='英文简称' name='name_short_en' width={_width} mb={mb}>
                            <Input1 p='请输入英文简称' bordered={_bordered} size={_size} value={forms.name_short_en} />
                        </Item>
                        <Item label='项目代码' name='kind_code' width='20%' mb={mb}>
                            <Input1 p='请输入项目代码' bordered={_bordered} size={_size} disabled value={forms.kind_code} />
                        </Item>
                        <Item label='检测方法' name='check_method' width='25%' mb={mb}>
                            <Select size={_size}  bordered={_bordered} data={this.state.checkMethodOption} p={`请选择检测方法`} value={forms.check_method} onChanged={(v)=>this.onChange(v, 'check_method')} /> 
                        </Item>
                        <Item>
                            <Button type='primary' className='ml10' onClick={this.onClick}>添加</Button>
                        </Item>
                        <Item label='助记码' name='debit_code' width={_width} mb={mb}>
                            <Input1 p='请输入助记码' bordered={_bordered} size={_size} value={forms.debit_code} />
                        </Item>
                        <Item label='备注' name='memo' width={_width}>
                            <Input1 p='请输入备注' bordered={_bordered} size={_size} mode='textarea' value={forms.memo} />
                        </Item>
                        <h6 className='w xmlr h40 bbor1 mb10'>结果信息</h6>
                        <Item label='上级质控' name='superiorquality' width={_width} mb={mb}>
                            <Input1 p='请输入上级质控' bordered={_bordered} size={_size} suffix='%' value={forms.superiorquality} />
                        </Item>
                        <Item label='结果类型' name='result_type' width={_width2} mb={mb}>
                            <Select size={_size}  bordered={_bordered} data={this.state.resultTypeOption} p={`请选择结果类型`} value={forms.result_type} /> 
                        </Item>
                        <Item label='结果提示类型' name='result_tips_temp' width={_width2} mb={mb}>
                            <Select size={_size}  bordered={_bordered} data={this.state.resultTipsOption} p={`请选择结果提示类型`} value={forms.result_tips_temp} nameStr='temp_name' idStr='uuid' /> 
                        </Item>
                        <Item label='结果默认值' name='result_default_value' width={_width2} mb={mb}>
                            <Input1 p='请输入结果默认值' bordered={_bordered} size={_size} value={forms.result_default_value} />
                        </Item>
                        <Item label='所属字典分类' name='result_dis_code' width={_width2} mb={mb}>
                            <Select size={_size}  bordered={_bordered} data={this.state.resultDisOption} p={`请选择所属字典分类`} value={forms.result_dis_code}/>
                        </Item>
                        <Item label='结果计算公式' name='result_formula' width={_width} mb={mb}>
                            <Input1 p='请输入结果计算公式' bordered={_bordered} size={_size} value={forms.result_formula} />
                        </Item>
                        <Item label='结果单位' name='result_unit' width={_width2} mb={mb}>
                            <Select size={_size}  bordered={_bordered} data={this.state.resultUnitOption} p={`请选择结果单位`} value={forms.result_unit} /> 
                        </Item>
                        <Item label='小数点位数' name='decimal_point' width={_width2} mb={mb}>
                            <Input1 p='请输入小数点位数' bordered={_bordered} size={_size} value={forms.decimal_point} />
                        </Item>
                        <Item label='临床可报告范围' width={_width}>
                            <Input.Group compact size={_size}>
                                <Input style={{ width: 100 }} placeholder='最小范围' value={forms.clinical_range} />
                                <Input
                                    className='site-input-split'
                                    style={{
                                        width: 30,
                                        borderLeft: 0,
                                        borderRight: 0,
                                        pointerEvents: 'none',
                                    }}
                                    placeholder='~'
                                    disabled
                                />
                                <Input style={{width: 100}} placeholder='最大范围' value={forms.clinical_range_end} />
                            </Input.Group>
                        </Item>
                        <Item label='线性范围' width={_width}>
                            <Input.Group compact size={_size}>
                                <Input style={{ width: 100 }} placeholder='最小范围' value={forms.linear_range} />
                                <Input
                                    className='site-input-split'
                                    style={{
                                        width: 30,
                                        borderLeft: 0,
                                        borderRight: 0,
                                        pointerEvents: 'none',
                                    }}
                                    placeholder='~'
                                    disabled
                                />
                                <Input style={{width: 100}} placeholder='最大范围' value={forms.linear_range_end} />
                            </Input.Group>
                        </Item>
                    </div>
                </Form>
                <Modal ref='modal' title='字典新增' width={648} noFooter>
					<SubmitForm
						modal
						data = { submit }
						onSubmit = { v => {
                            $http.submit(null, 'dis-item/codeAuto', {param: {...v, dis_code: 16000}}).then(data=>{
                                message.then(f => f.default.success('操作成功'))
								this.refs.modal.close()
								$fn.setCache()
                            })
						}}
                        onClose = { ()=>{
                            this.refs.modal.close()
                        } }
                        init    = { form => this.form = form }
					 />
				</Modal>
            </>
        )
    }
}