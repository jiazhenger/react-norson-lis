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
const AddsubtractForm = $async(()=>import('@views/administrators/specimen-manage/tp/addsubtract-form'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
        selectedKeys:[],
        infos: {}
    } 
    isEdit = false
    statusOptions = [
        { label: "待处理", value: "0" },
        { label: "已处理", value: "1" },
        { label: "已完成", value: "2" }
    ]
	
    optypeSelect = [
        { label: '加做', value: '1' },
        { label: '减做', value: '2' }
    ]
	forms = [
		{ label:'标本条码',	    name:'spec_code',		type:'input' }, 
        { label:'状态',		    name:'status',		    type:'select', data:this.statusOptions, nameStr:'label', idStr:'value' },
        { label:'终止时间',		name:'date',			type:'date-range', names:['start_date', 'end_date'] }
	]
	model = {}
	componentDidMount(){
		this.fetch()
	} 
    ImgsDom (imgs) { 
        return (
            window.$fn.hasArray(imgs) && <Button label='查看图片' ghost className='mlr5' onClick={()=> {} } /> 
        )
    }
	// paging
	fetch = param => $fn.fetch.call(this,'sp-additional-item/index', param)
	cols = [
		{ title: '条码号',		    field: 'spec_code',			width:120 },
		{ title: '姓名',		    field: 'patient_name',		width:90 },
		{ title: '性别',			field: 'sex_name',	        width:50 },
        { title: '项目名称',		field: 'kind_name',		    width:150 },
        { title: '时间',		    field: 'op_time',		    width:130 },
        { title: '岗位',		    field: 'project_name',		width:170 },
        { title: '备注说明',		field: 'remark',		    width:100 },
        { title: '类型',		    field: 'item_type',		    width:70, render: ({rows}) => {
            return window.$fn.filterSelect(this.optypeSelect, rows.item_type, 'label', 'value') 
        } },
        { title: '状态',		    field: 'status',		    width:70, render: ({rows}) => {
            return window.$fn.filterSelect(this.statusOptions, rows.status, 'label', 'value') 
        } },
        { title: '操作',	        width:185, render: ({rows}) => {
            let d = ''
            switch (rows.status) {
                case "0":
                    d = <React.Fragment>
                        <Button label='编辑' ghost className='mlr5' onClick={()=> {
                            this.refs.modal.open() 
                            this.isEdit = true
                            $http.submit(null, 'sp-additional-item/info', { param: {uuid: rows.uuid}} ).then(data => { 
                                this.setState({infos: data})
                            }) 
                        } } /> 
                        <Button label='审核' ghost className='mlr5' onClick={()=> {
                            const param = {uuid: rows.uuid}
                            coms.interfaceConfirm('sp-additional-item/audit', '审核', param, () => { this.fetch(this.model) })
                        } } /> 
                        {this.ImgsDom(rows.imgs)}
                    </React.Fragment>
                    break;
                case "1":
                    d = <React.Fragment>
                        <Button label='完成' ghost className='mlr5' onClick={()=> {
                            const param = {uuid: rows.uuid}
                            coms.interfaceConfirm('sp-additional-item/complete', '完成', param, () => { this.fetch(this.model) })
                        } } /> 
                        {this.ImgsDom(rows.imgs)}
                    </React.Fragment>
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
			<Page title='加减项' ButtonGroup={this.ButtonGroup()}>
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
                    <AddsubtractForm onRef={ref => this.addsubtractRef = ref} rows={this.state.infos} type={this.isEdit} close={() => {
                        this.refs.modal.close()
		                this.fetch(this.model)
                    }} />
				</Modal>
			</Page>
		)
	}
}