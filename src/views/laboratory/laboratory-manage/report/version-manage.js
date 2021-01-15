import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// ===================================================================== global template
const Text = $async(()=>import('@tp/text'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== 页面常量
const isDefaultOptions = [
    { name: "是", value: "1" },
    { name: "否", value: "0" }
] // 是否默认
const enabledOptions = [
    { name: "启用", value: "1" },
    { name: "禁用", value: "0" }
] // 状态
// ===================================================================== component
export default class extends React.Component{
	state = {
        data: [],
        pag: {},
        selectedKeys: [],
		id:$fn.query('id'),
	}
    model = {report_tpl_id: $fn.query('id') || ''}
    form = {
        report_name: $fn.query('report_name') || '--',
        report_num: $fn.query('report_num') || '--',
        report_en: $fn.query('report_en') || '--',
        enabled: $fn.query('enabled') == '1' ? '启用' : '禁用',
        route_name: $fn.query('route_name') || '--',
    }
	componentDidMount(){
        this.fetch(this.model)
    }
    // paging
    fetch = param => $fn.fetch.call(this,'kd-report-from-version/index', param).then(data => {
        const d = $fn.hasArray(data) && data.filter(i => i.is_default === '1')
        if ($fn.hasArray(d)) {
            this.setState({selectedKeys: [d[0].uuid]})
        }
    })
    // table
    cols = [
        { title: '默认模板',        field: 'is_default',        type: 'radio',  width: 100},
		{ title: '版本号',          field: 'version_num' },
		{ title: '所属报告单模板',  field: 'report_num'},
		{ title: '上传时间',        field: 'created_at'},
		{ title: '是否默认',        field: 'is_default',        render: ({ rows }) => {
            const d = isDefaultOptions.filter(i => i.value === rows.is_default)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
        { title: '状态',            field: 'enabled',           render: ({ rows }) => {
            const d = enabledOptions.filter(i => i.value === rows.enabled)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
	]
	render(){
        const { data, pullLoading, pag, selectedKeys } = this.state
		return (
			<Page title='版本管理'>
				<div className='ex fv xplr pt10'>
                    <h6 className="w xmlr h40 bbor1 mb10">模板信息</h6>
                    <div className='fxw'>
                        <div className='ant-row mb20' style={{width: '20%'}}>
                            <span>模板名称：</span><span className='b'>{decodeURI(this.form.report_name)}</span>
                        </div>
                        <div className='ant-row mb20' style={{width: '20%'}}>
                            <span>模板编号：</span><span className='b'>{decodeURI(this.form.report_num)}</span>
                        </div>
                        <div className='ant-row mb20' style={{width: '20%'}}>
                            <span>模板英文名称：</span><span className='b'>{decodeURI(this.form.report_en)}</span>
                        </div>
                        <div className='ant-row mb20' style={{width: '20%'}}>
                            <span>状态：</span><span className='b'>{decodeURI(this.form.enabled)}</span>
                        </div>
                        <div className='ant-row mb20' style={{width: '20%'}}>
                            <span>路径：</span><span className='b'>{decodeURI(this.form.route_name)}</span>
                        </div>
                    </div>
                    <h6 className="w xmlr h40 bbor1 mb10">版本列表</h6>
                    {/* 表格 */}
                    <Table
                        className		= 'xplr'
                        cols			= { this.cols }
                        data 			= { data }
                        loading 		= { pullLoading }
                        onRow			= { v => this.setState({ selectedKeys: [v.uuid] }) }
                        pag				= { pag }
                        idStr           = 'uuid'
                        selectedKeys    = { selectedKeys }
                        onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
                    />
                    <div className='mt20 tc'>
                        <Button label='保存' size='large' className='mr15' width={90} onClick={() => {
                            $http.submit(null, 'kd-report-from-version/setdefault', {param: {uuid: selectedKeys[0] || ''}}).then(data => {
                                message.then(f => f.default.success('保存成功'))
                                $fn.back(this)
                            })
                        }} />
                        <Button label='返回' size='large' ghost className='mr15' width={90} onClick={() => {
                            $fn.back(this)
                        }} />
                    </div>
				</div>
			</Page>
		)
	}
}