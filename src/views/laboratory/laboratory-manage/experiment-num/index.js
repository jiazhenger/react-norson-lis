import React from 'react'
// =====================================================================
import ScanImage from '@img/saoma.svg'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const Input = $async(()=>import('@antd/form/input'))
const Select = $async(()=>import('@antd/form/select'))
const message = import('@antd/message')
// =====================================================================
const Image = $async(()=>import('@tp/image'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== component
export default class extends React.Component{
	state = {
        submit: [
            { label: '条码号',	    name: 'spec_code',      disabled: true,     full: true,     width: '100%' },
            { label: '标本架编号',  name: 'sf_number',      disabled: true,     full: true,     width: '100%' },
            { label: '实验号',      name: 'lb_tpl',         full: true,         width: '100%',  onChange: (v, press, {name}) => {
                this.form.lb_tpl = v
            } },
            { label: '创建人',      name: 'founder',        disabled: true },
            { label: '领取人',      name: 'receive_user',   disabled: true },
            { label: '创建时间',    name: 'created_at',     disabled: true },
            { label: '领取时间',    name: 'receive_time',   disabled: true },
            { label: '岗位',        name: 'job_id',         disabled: true },
            { label: '状态',        name: 'handover_type',  disabled: true,     type: 'select',     data: [
                { name: '未领取', value: '0' },
                { name: '已领取', value: '1' }
            ] },
        ],
        submit1: [
            { label: '模板名称',    name: 'lab_name',       disabled: true,     full: true,     width: '100%' },
            { label: '模板编号',    name: 'lab_number',     disabled: true,     full: true,     width: '100%' },
            { label: '当前实验号',  name: 'last_code',      disabled: true,     full: true,     width: '100%' },
            { label: '结束时间',    name: 'cycle_end',      disabled: true },
            { label: '状态',        name: 'enabled',        disabled: true,     type: 'select', data: [
                { name: '启用', value: '1' },
                { name: '禁用', value: '0' },
                { name: '删除', value: '-1' }
            ] },
            { label: '描述',        name: 'description',    disabled: true,     type: 'textarea',   rows: 4,    full: true, width: '100%' },
        ],
        lisLabTemData: []
    }
	componentDidMount(){
		cacheApi.then(f => {
            const d = f.default
            // 模板列表
            $fn.getCache({
                cache: d.lisLabTemplate, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        this.setState({lisLabTemData: data})
                    } else {
                        $http.submit(null, 'lis-lab-tag/select').then(data => {
                            this.setState({lisLabTemData: data})
                            $fn.setCache()
                        })
                    }
                }
            })
        })
    }
    // 条码号查询
    queryCode() {
        $http.submit(null, 'lis-lab-tag/getSpecInfo', {param: {spec_code: this.form.spec_code || ''}}).then(data => {
            this.form.setFieldsValue({...data})
            message.then(f => f.default.success('查询成功'))
            this.form.lb_tpl = data.lb_tpl || ''
            this.form.receive_time = data.receive_time || ''
        })
    }
	render(){
        const { submit, submit1, lisLabTemData } = this.state
		return (
			<Page title='实验号管理'>
                <div className='pt10 fx'>
                    <div className='bor1 r4px ex fv mr15'>
                        <h6 className="w xmlr pl20 h40 b">实验号修改</h6>
                        <div className='plr20 pb20 bbor1 fxmj'>
                            <div className='ex mr20'>
                                <Input size='middle' p='请输入条码号' width='100%' bordered={false} onChange={v=> this.form.spec_code = v} onPressEnter={v=>{
                                    this.queryCode()
                                }}  />
                            </div>
                            <div>
                                <Image className='mr15 dkm' src={ ScanImage } height='24px' width='24px'/>
                                <Button label='查询' size='small' className='mr15 dkm' onClick={() => {
                                    this.queryCode()
                                }} />
                                <Button label='保存' size='small' className='mr15 dkm' onClick={(v) => {
                                    const param = {
                                        spec_code: this.form.spec_code,
                                        new_lb_tpl: this.form.lb_tpl,
                                        receive_time: this.form.receive_time
                                    }
                                    $http.submit(null, 'lis-lab-tag/modifyLabTag', { param }).then(data => {
                                        message.then(f => f.default.success('保存成功'))
                                    })
                                }} />
                            </div>
                        </div>
                        <div className='mb20 p20'>
                            <SubmitForm
                                modal
                                display = { true }
                                data = { submit }
                                onChange = {(v, press, { name, data }) => {} } 
                                onSubmit = { v => {}}
                                onClose = { ()=>this.refs.modal.close() }
                                init    = { form => this.form = form }
                            />
                        </div>
                    </div>
                    <div className='bor1 r4px ex fv'>
                        <h6 className="w xmlr pl20 h40 b">实验号重置</h6>
                        <div className='plr20 pb20 bbor1 fxmj'>
                            <div className='ex mr20'>
                                <Select size='middle' p='请选择模板' data={lisLabTemData} width='100%' bordered={false} onChanged={v => {
                                    const d = lisLabTemData.filter(i => i.value === v)
                                    this.lab_number = $fn.hasArray(d) && d[0].lab_number
                                }} />
                            </div>
                            <div>
                                <Button label='查询' size='small' className='mr15 dkm' onClick={() => {
                                    $http.submit(null, 'lis-lab-tag/getLabTagInfo', {param: {lab_number: this.lab_number || ''}}).then(data => {
                                        this.form2.setFieldsValue({...data})
                                        this.form2.uuid = data.uuid || ''
                                        message.then(f => f.default.success('查询成功'))
                                    })
                                }} />
                                <Button label='重置' size='small' className='mr15 dkm' onClick={() => {
                                    $http.submit(null, 'lis-lab-tag/resetLabTag', {param: {uuid: this.form2.uuid || ''}}).then(data => {
                                        message.then(f => f.default.success('操作成功'))
                                    })
                                }} />
                            </div>
                        </div>
                        <div className='mb20 p20'>
                        <SubmitForm
                            modal
                            display = { true }
                            data = { submit1 }
                            onChange    = {(v, press, { name, data }) => {} } 
                            onSubmit = { v => {}}
                            onClose = { ()=>this.refs.modal.close() }
                            init    = { form => this.form2 = form }
                        />
                        </div>
                    </div>
                </div>
			</Page>
		)
	}
}