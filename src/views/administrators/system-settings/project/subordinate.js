import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
import coms from '@/private/js/common.js'
import SubordinateForm from './tp/subordinate-form'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// ===================================================================== global template
const Text = $async(()=>import('@tp/text'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container-scroll'))
// ===================================================================== private component
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== 页面常量
const isDefaultOption = [
    { name: '是', value: '1' },
    { name: '否', value: '0' },
]
const convFieldOption = [
    { name: '结果',		value: 'result' },
    { name: '报告结果',	value: 'result1' },
    { name: '结果2',	value: 'result2' },
    { name: '结果3',	value: 'result3' },
]
export default class extends React.Component{
	state = {
        data1:[],
        data2: [],
        data3: [],
        data4: [],
		pag1: {},
		pag2: {},
		pag3: {},
		pag4: {},
		selectedKeys1:[],
		selectedKeys2:[],
		selectedKeys3:[],
        selectedKeys4:[],
        submit1: [
            { label: '结果代码',				name:'result_code',			full: true,		width: '100%'},
            { label: '结果内容',				name:'result_content',		full: true,		width: '100%',	type: 'textarea',},
            { label: '结果内容(英文)',			name:'en_result_content',	full: true,		width: '100%',	type: 'textarea',},
            { label: '是否默认',				name:'is_default',			full: true,		width: '100%',	type: 'textarea',},
        ],
        submit2: [
            { label: '建议与解释代码',			name:'sugg_code',			full: true,		width: '100%'},
            { label: '建议与解释内容',			name:'sugg_content',		full: true,		width: '100%',	type: 'textarea',},
            { label: '建议与解释内容(英文)',	name:'en_sugg_content',		full: true,		width: '100%',	type: 'textarea'},
            { label: '是否默认',				name:'is_default',			full: true,		width: '100%',	type: 'switch'},
        ],
        submit3: [
            { label: '结果转换名称',			name:'conv_name',			full: true,		width: '100%'},
            { label: '转换条件',				name:'conv_field',			type: 'select',	data: [],		placeholder: '转化数据'},
            { label: '',						name:'conv_condition',		type: 'select',	data: [],		placeholder: '转化规则'},
            { label: '',						name:'conv_val',			placeholder: '转化条件值'},
            { label: '关联结果内容',			name:'result_info_id',		type: 'select',	data: [],		nameStr: 'result_content',	idStr: 'uuid',	full: true,	width: '100%'},
            { label: '关联建议解释',			name:'result_sugg_id',		type: 'select',	data: [],		nameStr: 'sugg_content',	idStr: 'uuid',	full: true,	width: '100%'},
        ],
        submit4: [
            { label: '结果代码',				name:'result_code',			type: 'textarea',	full: true,	width: '100%'},
            { label: '结果内容',				name:'result_content',		type: 'textarea',	full: true,	width: '100%'},
            { label: '结果内容(英文)',			name:'en_result_content',	type: 'textarea',	full: true,	width: '100%'},
            { label: '是否默认',				name:'is_default',			type: 'switch',		full: true,	width: '100%'},
        ],
        projectData: [],
        sexOption: [],
        uuid: '',
        forms: {}
    }
    kind_status = $fn.query('kind_status')
    kind_id = $fn.query('id')
    kind_rel_id = ''
    model = {kind_id: this.kind_id, keyword: ''}
	componentDidMount(){
        const { submit3 } = this.state
        submit3[1].data = convFieldOption
        $fn.getDisItem({
            code: 45700,
            callback: data=>{
                this.setState({sexOption: data})
            }
        })
        $fn.getDisItem({
            code: 1300,
            callback: data=>{
                submit3[2].data = data
            }
        })
        // this.getResultSelect()
        this.getProjectInfo({uuid: this.kind_id})
        this.getResultInfo() // 报告结果字典
        this.getResultSuggestion() // 建议与解释
        this.getResultConvRule() // 结果转换规则
        this.getReferenceRange() // 参考范围
    }
    getResultSelect() {
        const { submit3 } = this.state
        // 关联结果内容
        $http.submit(null, 'report-result-info/select', { param: {kind_id: this.kind_id} }).then(data=>{
            submit3[4].data = data
        })
        // 关联建议解释
        $http.submit(null, 'report-result-suggestion/select', { param: {kind_id: this.kind_id} }).then(data=>{
            submit3[5].data = data
        })
    }
    // 报告结果字典
    getResultInfo() {
        this.fetch(this.model, 'report-result-info/index', 'pag1', data=>{
            this.setState({data1: data})
        })
    }
    // 建议与解释
    getResultSuggestion() {
        this.fetch(this.model, 'report-result-suggestion/index', 'pag2', data=>{
            this.setState({data2: data})
        })
    }
    // 结果转换规则
    getResultConvRule() {
        this.fetch(this.model, 'result-conv-rule/index', 'pag3', data=>{
            this.setState({data3: data})
        })
    }
    // 参考范围
    getReferenceRange() {
        $http.pull(null, 'kd-reference-range/index', { param: {...this.model} }).then(data=>{
            this.setState({data4: data.items || []})
        })
    }
    // 获取项目信息
    getProjectInfo(param) {
        $http.submit(null, 'kd-subordinate-set/info', { param }).then(data=>{
            console.log(data, 'data')
            this.setState({forms: data})
            
        })
    }
    // 设置表单参数
    setFormParams = () => {
        const { form } = this.refs.formInfo
		const param = form && form.getFieldsValue()
        for (let i in param) {
            if (param[i] === undefined) {
                param[i] = ''
            }
        }
        return param
    }
    // 保存
    saveData(val) {
        const param = this.setFormParams()
        param.result_formula = $fn.handleSymbol(param.result_formula)
        if (val) {
            param[val] = 1;
		}
		console.log(param)
        // $http.submit(null, 'kd-subordinate-set/edit', { param }).then(data=>{
        //     message.then(f => f.default.success('操作成功'))
        // })
    }
    // paging
    fetch = (param, api, pag, cb) => {
        $http.paging(this,api,{ param:{...param, ...this.model }, loading:false, pag: pag, callback: data=>{
            const result = data.items || data
            this.setState({data: result})
            cb&&cb(result)
		} } )
    }
	// table - 报告结果字典
	cols1 = [
        { type: 'checkbox',			width: 40 },
		{ title: '是否默认',		field: 'is_default',			width: 120, render: ({rows})=>{
            let d = isDefaultOption.filter(i => i.value === rows.is_default)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
		{ title: '结果内容',		field: 'result_content',		width: 120},
		{ title: '结果内容(英文)',	field: 'en_result_content',		width: 120},
		{ title: '结果代码',		field: 'result_code',			width: 120},
    ]
    // table - 建议与解释
    cols2 = [
        { type: 'checkbox',			width: 40 },
		{ title: '是否默认',		field: 'is_default',			width: 120, render: ({rows})=>{
            let d = isDefaultOption.filter(i => i.value === rows.is_default)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
		{ title: '建议与解释代码',	field: 'sugg_code',				width: 120},
		{ title: '建议与解释内容(英文)',        field: 'en_sugg_content',		width: 120},
    ]
    // table - 结果转换规则
    cols3 = [
        { type: 'checkbox',			width: 40 },
		{ title: '转换数据',		field: 'conv_field',			width: 120, render: ({rows})=>{
            let d = convFieldOption.filter(i => i.value === rows.conv_field)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
		{ title: '转换符号',		field: 'conv_condition',		width: 120},
		{ title: '转换值',			field: 'conv_val',				width: 120},
		{ title: '关联结果内容',	field: 'result_content',		width: 120},
		{ title: '关联建议解释',	field: 'sugg_content',			width: 120},
    ]
    // table - 参考范围
    cols4 = [
        { type: 'checkbox',				width: 40 },
		{ title: '参考值代码',			field: 'reference_code',	width: 120},
		{ title: '参考别名名称',		field: 'ref_type_name',		width: 120},
        { title: '参考别名名称(英文)',	field: 'en_ref_type_name',	width: 120},
        { title: '性别',				field: 'sex',				width: 120, render: ({rows})=>{
            let d = this.state.sexOption.filter(i => i.value === rows.sex)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
		{ title: '年龄值(低)',			field: 'age_min_val',		width: 120},
		{ title: '年龄值(高)',			field: 'age_max_val',		width: 120},
		{ title: '年龄单位',			field: 'age_unit_name',		width: 120},
		{ title: '危急值(低)',			field: 'crisis_min_val',	width: 120},
		{ title: '危急值(高)',			field: 'crisis_max_val',	width: 120},
		{ title: '参考值(低)',			field: 'reference_min_val',	width: 120},
		{ title: '参考值(高)',			field: 'reference_max_val',	width: 120},
		{ title: '参考值描述',			field: 'description',		width: 120},
		{ title: '参考值描述(英)',		field: 'description_en',	width: 120},
    ]
    
	ButtonGroup = () => {
		const arr = [
			{ label:'保存', onClick:()=>{
                this.saveData()
			} },
			{ label:'审批', onClick:()=>{
				$http.submit(null, 'kd-subordinate-set/audit', { param: {uuid: this.kind_id} }).then(data=>{
                    message.then(f => f.default.success('审批成功'))
                })
			} },
			{ label:'保存并提交审批', onClick:()=>{
				this.saveData('audit')
			} },
			{ label:'发布', onClick:()=>{
				$http.submit(null, 'kd-subordinate-set/push', { param: {uuid: this.kind_id} }).then(data=>{
                    message.then(f => f.default.success('发布成功'))
                    $fn.push(this, $fn.getRoot().root + `system-settings/project-settings`)
                })
			} },
			{ label:'取消', ghost: true, onClick:()=>{
				$fn.back(this)
			} },
        ]
        const arr1 = [
			{ label:'下架', onClick:()=>{
				$http.submit(null, 'kind-info/off', { param: {kind_id: this.kind_id} }).then(data=>{
                    message.then(f => f.default.success('下架成功'))
                    $fn.push(this, $fn.getRoot().root + `system-settings/project-settings/subordinate?id=${this.kind_id}&kind_status=0`)
                })
            } },
            { label:'返回', ghost: true, onClick:()=>{
				$fn.back(this)
			} },
        ]
		return this.kind_status === '0' || this.kind_status === '1' ? arr : arr1
	}
	render(){
        const { data1, data2, data3, data4, pullLoading, pag1, pag2, pag3, pag4, forms, submit1, submit2, submit3, submit4 } = this.state
		return (
			<Page title='新增从属项目' ButtonGroup={this.ButtonGroup()}>
                <SubordinateForm
                    ref='formInfo'
                    className='fx-int'
                    info={forms}
                />
				{/* 表格 */}
                <div className='fx'>
                    <div className='ex fv mr15'>
                        <div className='fxmj'>
                            <h6 className="xmlr h40 b">报告结果字典</h6>
                            <div className='fxm'>
                                <Button label='添加' ghost={true} size='small' className='mr15 dkm' onClick={() => {
                                    this.refs.modal1.open()
                                    submit1.forEach(item => {
                                        item.value = ''
                                    })
                                    this.isEdit1 = false
                                    this.setState({ submit1 })
                                }} />
                                <Button label='编辑' disabled={!this.rows1} ghost={true} size='small' className='mr15 dkm' onClick={() => {
                                    $http.submit(null,'report-result-info/info',{ param:{uuid: this.rows1.uuid} }).then(data=>{
                                        this.refs.modal1.open()
                                        data.is_default = data.is_default == '1' ? true : false
                                        this.rows1 = data
                                        this.isEdit1 = true
                                        $fn.setSubmitValues(submit1, data, ()=>{this.setState({submit1})})
                                    })
                                }} />
                                <Button label='删除' ghost={true} disabled={!this.state.selectedKeys1.length} size='small' className='mr15 dkm' onClick={() => {
                                    const param = {uuid: this.state.selectedKeys1.map(v=>v.uuid)} 
                                    coms.interfaceConfirm('report-result-info/del', '删除', param, () => {
                                        this.getResultInfo()
                                        this.setState({selectedKeys1: []})
                                        this.rows1 = null
                                        this.getResultSelect()
                                    })
                                }} />
                            </div>
                        </div>
                        <Table
                            cols			= { this.cols1 }
                            data 			= { data1 }
                            loading 		= { pullLoading }
                            onRow			= { (v, rows) => {
                                this.setState({ selectedKeys1: v })
                                this.rows1 = rows
                            } }
                            pag				= { pag1 }
                            onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
                        />
                    </div>
                    <div className='ex fv'>
                        <div className='fxmj'>
                            <h6 className="xmlr h40 b">建议与解释</h6>
                            <div className='fxm'>
                                <Button label='添加' ghost={true} size='small' className='mr15 dkm' onClick={() => {
                                    this.refs.modal2.open()
                                    submit2.forEach(item => {
                                        item.value = ''
                                    })
                                    this.isEdit2 = false
                                    this.setState({ submit2 })
                                }} />
                                <Button label='编辑' disabled={!this.rows2} ghost={true} size='small' className='mr15 dkm' onClick={() => {
                                    $http.submit(null,'report-result-suggestion/info',{ param:{uuid: this.rows2.uuid} }).then(data=>{
                                        this.refs.modal2.open()
                                        data.is_default = data.is_default == '1' ? true : false
                                        this.rows2 = data
                                        this.isEdit2 = true
                                        $fn.setSubmitValues(submit2, data, ()=>{this.setState({submit2})})
                                    })
                                }} />
                                <Button label='删除' ghost={true} disabled={!this.state.selectedKeys2.length} size='small' className='mr15 dkm' onClick={() => {
                                    const param = {uuid: this.state.selectedKeys2.map(v=>v.uuid)} 
                                    coms.interfaceConfirm('report-result-suggestion/del', '删除', param, () => {
                                        this.getResultSuggestion()
                                        this.setState({selectedKeys2: []})
                                        this.rows2 = null
                                        this.getResultSelect()
                                    })
                                }} />
                            </div>
                        </div>
                        <Table
                            cols			= { this.cols2 }
                            data 			= { data2 }
                            loading 		= { pullLoading }
                            onRow			= { (v, rows) => {
                                this.setState({ selectedKeys2: v })
                                this.rows2 = rows
                            } }
                            pag				= { pag2 }
                            onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
                        />
                    </div>
                </div>
                <div className='ex'>
                    <div className='fxmj'>
                        <h6 className="xmlr h40 b">结果转换规则</h6>
                        <div className='fxm'>
                            <Button label='添加' ghost={true} size='small' className='mr15 dkm' onClick={() => {
                                this.refs.modal3.open()
                                submit3.forEach(item => {
                                    item.value = ''
                                })
                                this.isEdit3 = false
                                this.setState({ submit3 })
                                this.getResultSelect()
                            }} />
                            <Button label='编辑' disabled={!this.rows3} ghost={true} size='small' className='mr15 dkm' onClick={() => {
                                $http.submit(null,'result-conv-rule/info',{ param:{uuid: this.rows3.uuid} }).then(data=>{
                                    this.refs.modal3.open()
                                    this.rows3 = data
                                    this.isEdit3 = true
                                    $fn.setSubmitValues(submit3, data, ()=>{this.setState({submit3})})
                                    this.getResultSelect()
                                })
                            }} />
                            <Button label='删除' ghost={true} disabled={!this.state.selectedKeys3.length} size='small' className='mr15 dkm' onClick={() => {
                                const param = {uuid: this.state.selectedKeys3.map(v=>v.uuid)} 
                                coms.interfaceConfirm('result-conv-rule/del', '删除', param, () => {
                                    this.getResultConvRule()
                                    this.setState({selectedKeys3: []})
                                    this.rows3 = null
                                })
                            }} />
                        </div>
                    </div>
                    <Table
                        cols			= { this.cols3 }
                        data 			= { data3 }
                        loading 		= { pullLoading }
                        onRow			= { (v, rows) => {
                            this.setState({ selectedKeys3: v })
                            this.rows3 = rows
                        } }
                        pag				= { pag3 }
                        onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
                    />
                </div>
                <div className='ex'>
                    <div className='fxmj'>
                        <h6 className="xmlr h40 b">参考范围</h6>
                        <div className='fxm'>
                            <Button label='添加' ghost={true} size='small' className='mr15 dkm' onClick={() => {
                                $fn.push(this, $fn.getRoot().root + `system-settings/project-settings/reference-range?kind_id=${this.kind_id}`)
                            }} />
                            <Button label='编辑' disabled={!this.rows4} ghost={true} size='small' className='mr15 dkm' onClick={() => {
                                $fn.push(this, $fn.getRoot().root + `system-settings/project-settings/reference-range?kind_id=${this.kind_id}&uuid=${this.rows4.uuid}`)
                            }} />
                            <Button label='删除' ghost={true} disabled={!this.state.selectedKeys4.length} size='small' className='mr15 dkm' onClick={() => {
                                const param = {uuid: this.state.selectedKeys4.map(v=>v.uuid)} 
                                coms.interfaceConfirm('kd-reference-range/delete', '删除', param, () => {
                                    this.getReferenceRange()
                                    this.setState({selectedKeys4: []})
                                    this.rows4 = null
                                })
                            }} />
                        </div>
                    </div>
                    <Table
                        cols			= { this.cols4 }
                        data 			= { data4 }
                        loading 		= { pullLoading }
                        onRow			= { (v, rows) => {
                            this.setState({ selectedKeys4: v })
                            this.rows4 = rows
                        } }
                    />
                </div>
                {/* 报告结果字典 */}
                <Modal ref='modal1' title={this.isEdit1 ? '编辑' : '添加'} width={648} noFooter>
					<SubmitForm
						modal
						data = { submit1 }
						onSubmit = { v => {
                            const d = {
                                is_default: v.is_default ? '1' : '0',
                                kind_id: this.kind_id
                            }
                            if (this.isEdit1) {
                                $http.submit(null, 'report-result-info/edit', {param: {...v, ...d, uuid: this.rows1.uuid}}).then(data=>{
                                    message.then(f => f.default.success('操作成功'))
                                    this.refs.modal1.close()
                                    this.getResultInfo()
                                    this.getResultSelect()
                                    this.rows1 = null
                                })
                            } else {
                                $http.submit(null, 'report-result-info/add', {param: {...v, ...d}}).then(data=>{
                                    message.then(f => f.default.success('操作成功'))
                                    this.refs.modal1.close()
                                    this.getResultInfo()
                                    this.getResultSelect()
                                    this.rows1 = null
                                })
                            }
						}}
                        onClose = { ()=>{
                            this.refs.modal1.close()
                            this.isEdit1 = null
                        } }
                        init    = { form => this.form1 = form }
					 />
				</Modal>
                {/* 建议与解释 */}
                <Modal ref='modal2' title={this.isEdit2 ? '编辑' : '添加'} width={648} noFooter>
					<SubmitForm
						modal
						data = { submit2 }
						onSubmit = { v => {
                            const d = {
                                is_default: v.is_default ? '1' : '0',
                                kind_id: this.kind_id
                            }
                            if (this.isEdit2) {
                                $http.submit(null, 'report-result-suggestion/edit', {param: {...v, ...d, uuid: this.rows2.uuid}}).then(data=>{
                                    message.then(f => f.default.success('操作成功'))
                                    this.refs.modal2.close()
                                    this.getResultSuggestion()
                                    this.getResultSelect()
                                    this.rows2 = null
                                })
                            } else {
                                $http.submit(null, 'report-result-suggestion/add', {param: {...v, ...d}}).then(data=>{
                                    message.then(f => f.default.success('操作成功'))
                                    this.refs.modal2.close()
                                    this.getResultSuggestion()
                                    this.getResultSelect()
                                    this.rows2 = null
                                })
                            }
						}}
                        onClose = { ()=>{
                            this.refs.modal2.close()
                            this.isEdit2 = null
                        } }
                        init    = { form => this.form2 = form }
					 />
				</Modal>
                {/* 结果转换规则 */}
                <Modal ref='modal3' title={this.isEdit3 ? '编辑' : '添加'} width={800} noFooter>
					<SubmitForm
						modal
						data = { submit3 }
						onSubmit = { v => {
                            const d = {
                                kind_id: this.kind_id
                            }
                            if (this.isEdit3) {
                                $http.submit(null, 'result-conv-rule/edit', {param: {...v, ...d, uuid: this.rows3.uuid}}).then(data=>{
                                    message.then(f => f.default.success('操作成功'))
                                    this.refs.modal3.close()
                                    this.getResultConvRule()
                                    this.rows3 = null
                                })
                            } else {
                                $http.submit(null, 'result-conv-rule/add', {param: {...v, ...d}}).then(data=>{
                                    message.then(f => f.default.success('操作成功'))
                                    this.refs.modal3.close()
                                    this.getResultConvRule()
                                    this.rows3 = null
                                })
                            }
						}}
                        onClose = { ()=>{
                            this.refs.modal3.close()
                            this.isEdit3 = null
                        } }
                        init    = { form => this.form3 = form }
					 />
				</Modal>
			</Page>
		)
	}
}