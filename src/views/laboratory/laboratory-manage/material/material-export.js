import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const message = import('@antd/message')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		deviceStadius:[],
		submit: [
			{ label: '申请单',      name: 'apply_form_id',      type:'select',          data:[],            idStr: 'uuid'},
			{ label: '物料名称',	name: 'mate_id',		    required: true,         type:'select',      data:[]},
			{ label: '出库数量',	name: 'out_qty',            required: true },
            { label: '领取人',      name: 'receive_user',       required: true },
            { label: '检测组',      name:'pgroup_id',           required: true,         type:'select',          data:[],    idStr: 'uuid'},
			{ label: '审核人',		name: 'reviewer',			required: true},
			{ label: '出库码',      name: 'out_code'},
		]
	}
	forms = [
		{ label:'物料名称',     name:'material',        type:'select',      data:[]},
        { label:'检测组',       name:'pproject',        type:'select',      data:[],    idStr: 'uuid'},
        { label:'领取人',       name:'receive_user'},
        { label: '采购时间',    name:'date',			type:'date-range',	names:['start_date','end_date'], value:[] },
	]
	model = {}
	componentDidMount(){
		const { submit } = this.state
		cacheApi.then(f => {
            const d = f.default
            // 申请单
            $fn.getCache({
                cache: d.mtApplyFormSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        submit[0].data = data
                    } else {
                        $http.submit(null, 'mt-apply-form/select').then(data => {
                            submit[0].data = data
                            $fn.setCache()
                        })
                    }
                }
            })
            // 检测组列表
            $fn.getCache({
                cache: d.ProjectTeamSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        this.forms[1].data = data
                        submit[4].data = data
                    } else {
                        $http.submit(null, 'project-team/select').then(data => {
                            this.forms[1].data = data
                            submit[4].data = data
                            $fn.setCache()
                        })
                    }
                }
            })
            // 物料名称
            $fn.getCache({
                cache: d.materialSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        this.forms[0].data = data
                        submit[1].data = data
                    } else {
                        $http.submit(null, 'material/select').then(data => {
                            this.forms[0].data = data
                            submit[1].data = data
                            $fn.setCache()
                        })
                    }
                }
            })
            this.setState({submit})
        })
        this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'material-out/index', param)
	// table
	cols = [
		{ title: '申请单编号', 	    field: 'apply_form_id' },
		{ title: '出库单编号', 	    field: 'out_form_number'},
		{ title: '物料名称', 	    field: 'mate_name'},
		{ title: '物料编号',        field: 'mate_number'},
		{ title: '出库量',          field: 'out_qty'},
		{ title: '出库时间', 	    field: 'out_time',          align:'tc' },
		{ title: '出库码',          field: 'out_code'},
		{ title: '审核人',          field: 'reviewer'},
		{ title: '检测组', 	        field: 'project_name'},
		{ title: '领取人号',        field: 'receive_user'},
	]
	ButtonGroup = () => {
		return [
			{ label:'添加 F2', code:'F2', onClick:()=>{
				this.refs.modal.open()
				const { submit } = this.state
				submit[0].value = ''
				submit[1].value = ''
				submit[2].value = ''
				submit[3].value = ''
				submit[4].value = ''
				submit[5].value = ''
				submit[6].value = ''
				this.isEdit = false
				this.setState({ submit })
            } },
            { label:'查看申请单', onClick:()=>{
				$fn.push(this, $fn.getRoot().root + 'laboratory-manage/material-export/application')
            } },
		]
	}
	render(){
		const { data, pullLoading, pag, submit } = this.state
		return (
			<Page title='物料出库记录列表' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
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
				<Modal ref='modal' title={this.isEdit ? '编辑' : '添加'} width={648} noFooter>
					<SubmitForm
						modal
						data = { submit }
						onSubmit = { v => {
							if (this.isEdit) {
							} else {
								const param = { ...v }
								$http.submit(null, 'material-out/add', { param }).then(data => {
									message.then(f => f.default.success('添加成功'))
									this.refs.modal.close()
									this.fetch(this.model)
								})
							}
							
						}}
						onClose = { ()=>this.refs.modal.close() }
					 />
				</Modal>
			</Page>
		)
	}
}