import React from 'react'
// ===================================================================== antd
import coms from '@/private/js/common.js'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const Input = $async(()=>import('@antd/form/input'))
const Select = $async(()=>import('@antd/form/select'))
const message = import('@antd/message')
// ===================================================================== global template
const Text = $async(()=>import('@tp/text'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
const Title = $async(()=>import('#tp/title'))
// ===================================================================== private component
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== 页面常量
const kindStatusOption = [
    { value: '2',   name: "开启" },
    { value: '1',   name: "审核" },
    { value: '0',   name: "草稿" },
    { value: '-1',   name: "未开启" },
    { value: '-2',   name: "预添加" },
]
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		submit: [
			{ label: '项目中文名称',	name: 'kind_name',      title: '项目信息'},
			{ label: '中文简称',	    name: 'short_name', },
			{ label: '项目英文名称',	name: 'name_en', },
			{ label: '英文简称',	    name: 'name_short_en', },
			{ label: '组合项目代码',	name: 'kind_code', },
			{ label: '项目助记码',	    name: 'debit_code', },
			{ label: '绑定医院',	    name: 'hosp_id',        type: 'select',     data: [] },
        ],
        projectData: [],
        uuid: '',
        forms: {
            kind_name: '',
            short_name: '',
            name_en: '',
            name_short_en: '',
            kind_code: '',
            debit_code: '',
            report_id: '',
            spec_type: '',
            superiorquality: '',
            memo: '',
            sort: '',
            printing: '',
            result_formula: [],
            report_time_set: [
                {
                    start_at: '',
                    end_at: '',
                    postpone: 0,
                    week_at: [],
                    date_at: [],
                    selectDayType: 1
                }
            ],
            project_id: '',
            low_board_id: '',
            tag_id: '',
            careful: '',
            remark: '',
        }
    }
    kind_status = $fn.query('kind_status')
    kind_id = $fn.query('id')
    kind_rel_id = ''
    model = {kind_id: this.kind_id, keyword: ''}
	componentDidMount(){
        const { submit } = this.state
        cacheApi.then(f => {
            const d = f.default
			// 医院
			$fn.getCache({
				cache: d.BsHospitalSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
						submit[6].data = data
						this.setState({submit})
                    } else {
                        $http.submit(null, $fn.replaceApi(d.BsHospitalSelect)).then(data => {
							submit[6].data = data
							this.setState({submit})
                            $fn.setCache()
                        })
                    }
				}
            })
            // 项目明细 - 项目
            $fn.getCache({
				cache: d.kindItemSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
						this.setState({projectData: data})
                    } else {
                        $http.submit(null, $fn.replaceApi(d.kindItemSelect)).then(data => {
							this.setState({projectData: data})
                            $fn.setCache()
                        })
                    }
				}
            })
        })
        this.fetch(this.model)
        this.getProjectInfo(this.model)
    }
    // 获取项目kind_id
    getProjectInfo(param) {
        const { submit } = this.state
        $http.submit(null, 'kd-market/info', { param }).then(data=>{
            $fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
        })
    }
    getFieldValue(val) {
        return this.form.getFieldValue(val) || ''
    }
    // 保存
    saveData(val) {
        const param = {
            kind_id:        this.kind_id,
            kind_name:      this.getFieldValue('kind_name'),
            name_en:        this.getFieldValue('name_en'),
            short_name:     this.getFieldValue('short_name'),
            name_short_en:  this.getFieldValue('name_short_en'),
            debit_code:     this.getFieldValue('debit_code'),
            hosp_id:        this.getFieldValue('hosp_id'),
        }
        if (val) {
            param[val] = 1;
        }
        $http.submit(null, 'kd-market/edit', { param }).then(data=>{
            message.then(f => f.default.success('操作成功'))
        })
    }
	// paging
	fetch = param => $fn.fetch.call(this,'kd-market-rel/index', param)
	// table
	cols = [
        { type: 'checkbox',     width: 40 },
		{ title: '项目代码',	field: 'kind_code',			width: 120},
		{ title: '项目名称',	field: 'kind_name',			width: 160},
		{ title: '简称',        field: 'short_name',		width: 120},
		{ title: '检测方法',	field: 'check_method_name',	width: 160},
		{ title: '项目属性',	field: 'kind_type_name',	width: 160},
		{ title: '价格',		field: 'total_price',		width: 120},
		{ title: '状态',		field: 'kind_status',		width: 100,		render:({rows})=>{
			let d = kindStatusOption.filter(i => i.value === rows.kind_status)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
		}},
	]
	ButtonGroup = () => {
		const arr = [
			{ label:'保存', onClick:()=>{
                this.saveData()
			} },
			{ label:'审批', onClick:()=>{
				$http.submit(null, 'kd-market/audit', { param: {kind_id: this.kind_id} }).then(data=>{
                    message.then(f => f.default.success('审批成功'))
                })
			} },
			{ label:'保存并提交审批', onClick:()=>{
				this.saveData('audit')
			} },
			{ label:'发布', onClick:()=>{
				$http.submit(null, 'kd-market/push', { param: {kind_id: this.kind_id} }).then(data=>{
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
                    $fn.push(this, $fn.getRoot().root + `system-settings/project-settings/marketing?id=${this.kind_id}&kind_status=0`)
                })
            } },
            { label:'返回', ghost: true, onClick:()=>{
				$fn.back(this)
			} },
        ]
		return this.kind_status === '0' || this.kind_status === '1' ? arr : arr1
	}
	render(){
		const { data, pullLoading, pag, submit, projectData } = this.state
		return (
			<Page title='设定标准组合项目' ButtonGroup={this.ButtonGroup()}>
                <div>
                    <Title title='项目信息' />
                    <div className='fx'></div>
                </div>
				{/* 表格 */}
                <div className='fxmj'>
                    <h6 className="xmlr h40 b">项目明细</h6>
                    <div className='fxm'>
                        <div className='fxm'>
                            <Input size='middle' className='mr15' p='请输入关键字' width='100%' bordered={false} onChange={v=> this.model.keyword = v} />
                            <Button label='查询' ghost={true} size='small' className='mr15 dkm' onClick={() => {
                                this.fetch(this.model)
                            }} />
                            <Button label='删除' ghost={true} disabled={!this.state.selectedKeys.length} size='small' className='mr15 dkm' onClick={() => {
                                const param = {uuid: this.state.selectedKeys.map(v=>v.uuid)} 
                                coms.interfaceConfirm('kd-market-rel/delete', '删除', param, () => { this.fetch(this.model) })
                            }} />
                        </div>
                        <div className='fxm'>
                            <Select size='middle' p='请选择项目' data={projectData} width={200} bordered={false} onChanged={v => this.kind_rel_id = v} />
                            <Button label='添加' ghost={true} size='small' className='ml15 dkm' onClick={() => {
                                const param = {
                                    kind_rel_id: this.kind_rel_id,
                                    kind_id: this.kind_id
                                }
                                if (!this.kind_rel_id) {
                                    message.then(f => f.default.error('请选择项目'))
                                    return
                                }
                                $http.submit(null, 'kd-market-rel/add', {param}).then(data=>{
                                    message.then(f => f.default.success('操作成功'))
                                    this.fetch(this.model)
                                })
                            }} />
                        </div>
                    </div>
                </div>
				<Table
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { v => this.setState({ selectedKeys: v }) }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
				/>
			</Page>
		)
	}
}