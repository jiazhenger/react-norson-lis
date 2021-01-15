// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== common
import coms from '@/private/js/common.js'
// ===================================================================== antd
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $fn, $async, $http } = window 
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table')) 
const AccessrecordForm = $async(()=>import('@views/administrators/specimen-manage/tp/accessrecord-form'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
        selectedKeys:[],
        infos: {}
    } 
    isEdit = false 
    typeOptions =[
        { label: "样本信息和结果沟通", value: 1 },
        { label: "样本危急值通知", value: 2 },
        { label: "咨询通知", value: 3 },
        { label: "其他", value: 4 }
    ]
    statusOptions = [
        { label: "待处理", value: "0" },
        { label: "已处理", value: "1" },
        { label: "已完成", value: "2" }
    ]
    lookbackOptions = [
        { label: "是", value: 1 },
        { label: "否", value: 2 },
        { label: "不需要", value: 3 }
    ]
	forms = [
		{ label:'标本条码',	    name:'spec_code',		type:'input' }, 
        { label:'沟通类型',		name:'type',		    type:'select', data:this.typeOptions, nameStr:'label', idStr:'value' },
        { label:'状态',		    name:'status',		    type:'select', data:this.statusOptions, nameStr:'label', idStr:'value' },
        { label:'时间',		    name:'date',			type:'date-range', names:['start_date', 'end_date'] }
	]
	model = {type: '', status: ''}
	componentDidMount(){
		this.fetch(this.model)
	}  
	// paging
	fetch = param => $fn.fetch.call(this,'sp-customer-log/index', param)
	cols = [ 
		{ title: '条码号',		    field: 'spec_code',			width:110 },
		{ title: '自然项目',		field: 'kind_name',			width:160 },
		{ title: '沟通类型',		field: 'type',			    width:120, render: ({rows}) => {
            return window.$fn.filterSelect(this.typeOptions, rows.type, 'label', 'value') 
        } },
		{ title: '岗位',    		field: 'project_name',	    width:90 },
		{ title: '反馈人',		    field: 'contact_user',		width:90 },
		{ title: '反馈日期',		field: 'contact_at',		width:140 },
		{ title: '反馈原因',		field: 'contact_reason',	width:200 },
		{ title: '送检医院',		field: 'inspec_unit',		width:200 },
		{ title: '反馈电话',		field: 'phone',     		width:100 },
		{ title: '送检科室',		field: 'depart_name',		width:100 },
		{ title: '反馈内容',		field: 'inspec_content',    width:200 },
		{ title: '回顾',		    field: 'look_back',         width:60, render: ({rows}) => {
            return window.$fn.filterSelect(this.lookbackOptions, rows.type, 'label', 'value') 
        } },
        { title: '状态',		    field: 'status',            width:60, render: ({rows}) => {
            return window.$fn.filterSelect(this.statusOptions, rows.type, 'label', 'value') 
        } },  
        { title: '操作',	        width:120, render: ({rows}) => {
            let d = ''
            switch (rows.status) {
                case "0":
                    d = <React.Fragment>
                        <Button label='编辑' ghost className='mlr5' onClick={()=> {
                            this.refs.modal.open() 
                            this.isEdit = true
                            $http.submit(null, 'sp-customer-log/info', { param: {uuid: rows.uuid}} ).then(data => { 
                                this.setState({infos: data})
                            }) 
                        } } /> 
                        <Button label='审核' ghost className='mlr5' onClick={()=> {
                            const param = {uuid: rows.uuid}
                            coms.interfaceConfirm('sp-customer-log/audit', '审核', param, () => { this.fetch(this.model) })
                        } } />  
                    </React.Fragment>
                    break;
                case "1":
                    d =  <Button label='完成' ghost className='mlr5' onClick={()=> {
                            const param = {uuid: rows.uuid}
                            coms.interfaceConfirm('sp-customer-log/complete', '完成', param, () => { this.fetch(this.model) })
                        } } />   
                    break;
                default:
                    break;
            }   
            return d
        } } 
    ]
	ButtonGroup = () => {
		return [ 
            { label:'添加 F2', code:'F2', onClick:()=> {
                this.refs.modal.open()
                this.setState({infos: {}})
                this.isEdit = false 
            } } 
        ]
    }
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='客户反馈' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
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
                <Modal ref='modal' title={this.isEdit ? '编辑' : '添加'} width={648} onOk={() => { 
                    this.addsubtractRef.submits()
                }}>
                    <AccessrecordForm onRef={ref => this.addsubtractRef = ref} rows={this.state.infos} type={this.isEdit} close={() => {
                        this.refs.modal.close()
		                this.fetch(this.model)
                    }} />
				</Modal>
			</Page>
		)
	}
}