import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
const confirm = import('@antd/confirm')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
        detailData: []
	}
	forms = [
		{ label: '条码号',        name:'spec_code'},
		{ label: '报告单编号',    name:'report_num'},
		{ label: '合并规则',      name:'merge_group_id',    type:'select', data: []},
	]
    model = {}
	componentDidMount(){
        cacheApi.then(f => {
            const d = f.default
            // 合并规则
            $fn.getCache({
                cache: d.mergeGroupSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        this.forms[2].data = data
                    } else {
                        $http.submit(null, 'merge-group/select').then(data => {
                            this.forms[2].data = data
                            $fn.setCache()
                        })
                    }
                }
            })
        })

		this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'merge-report/index', param)
	// table
	cols = [
		{ title: '条码号', 	        field: 'spec_code', 	        width: 130 },
		{ title: '报告单编号',		field: 'report_num',		    width: 100 },
		{ title: '报告单模板', 		field: 'report_name',		    width: 120 },
		{ title: '姓名', 	        field: 'patient_name',			width: 100 },
		{ title: '规则名称',		field: 'merge_name',		    width: 160 },
		{ title: '处理方法', 		field: 'handle_type_name',	    width: 100 },
		{ title: '创建日期', 		field: 'created_at',	        width: 160,         align: 'tc' },
		{ title: '操作', align:'tc', width:300, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='预览报告单' className='ml15' ghost onClick={e=>{
						
					}}  />
                    <Button label='召回报告单' ghost className='ml15' onClick={() => {
						confirm.then(f => {
							f.default({
								msg: '是否确认召回报告单?',
								onOk: close => {
									$http.submit(null, 'merge-report/stop', { param: { report_num: rows.report_num } }).then(data => {
										message.then(f => f.default.success('操作成功'))
										this.fetch(this.model)
										close()
									})
								}
							})
						})
					} } />
                    <Button label='查看项目明细' ghost className='ml15' onClick={() => {
						$http.submit(null, 'merge-report/kindlists', { param: { merge_report_id: rows.uuid } }).then(data => {
                            this.setState({detailData: data.items})
                        })
                        this.refs.modal.open()
					} } />
				</div>
			)
		}},
    ]
    detailCols = [
        { title: '条码号', 	        field: 'spec_code',             width: 130 },
        { title: '自然项目',        field: 'parent_kind_name',      width: 180 },
        { title: '实验号', 	        field: 'experiment_num',        width: 100 },
        { title: '项目名称',        field: 'kind_name', 	        width: 150 },
        { title: '姓名',            field: 'patient_name', 	        width: 100 },
        { title: '结果', 	        field: 'result',                width: 150 },
        { title: '接收时间',        field: 'receive_time', 	        width: 160 }
    ]
	render(){
		const { data, pullLoading, pag, detailData } = this.state
		return (
			<Page title='合并项目列表'>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
                    onChange    = {(v, press, { name, data }) => $fn.onChange.call(this,v,press) }
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onAdd		= { this.onAdd } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
				/>
				{/* 表格 */}
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { v => this.setState({ selectedKeys: v }) }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
				/>
				<Modal ref='modal' title='查看项目明细' width={1200} noFooter>
                    <Table
                        className		= 'xplr'
                        cols			= { this.detailCols }
                        data 			= { detailData }
                        loading 		= { pullLoading }
                        onRow			= { v => this.setState({ selectedKeys: v }) }
                        pag				= { pag }
                        onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
                    />
				</Modal>
			</Page>
		)
	}
}