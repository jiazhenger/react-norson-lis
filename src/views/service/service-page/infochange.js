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
const message = import('@antd/message')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
const InfochangeForm = $async(()=>import('@views/administrators/specimen-manage/tp/infochange-form'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
        selectedKeys:[],
        infos: {},
		submit: [
			{ label:'异常原因类型', 	name:'abnormal_type',	type: 'select', data: [], nameStr:'name', idStr:'value' },
			{ label:'原因', 			name:'reason',			type: 'textarea', full:true, width:'100%'}
		]
    } 
    isEdit = false
    statusOptions = [
        { label: "待处理", value: "0" },
        { label: "已处理", value: "1" },
        { label: "已完成", value: "2" }
    ]
	typeOptions = [
        { label: "修改病人资料", value: "1" },
        { label: "修改医院信息", value: "2" },
        { label: "其他类型", value: "3" }
      ]
    optypeSelect = [
        { label: '加做', value: '1' },
        { label: '减做', value: '2' }
    ]
	forms = [
		{ label:'标本条码',	    name:'spec_code',		type:'input' }, 
        { label:'状态',		    name:'status',		    type:'select', data:this.statusOptions, nameStr:'label', idStr:'value' },
        { label:'类型',		    name:'type',		    type:'select', data:this.typeOptions, nameStr:'label', idStr:'value' },
        { label:'创建时间',		name:'date',			type:'date-range', names:['start_date', 'end_date'] },
	]
	model = {}
	componentDidMount(){
        // 异常原因类型
        $fn.getDisItem({
            code: 62050,
            callback: (data) => {
                const { submit } = this.state
                submit[0].data = data
                this.setState({submit})
            }
        })
		this.fetch()
	} 
    ImgsDom (imgs) { 
        return (
            $fn.hasArray(imgs) && <Button label='查看图片' ghost className='mlr5' onClick={()=> {} } /> 
        )
    }
    updateData (row) {
        if (row.type === "1" && row.status === "0") {
            return <Button label='修改资料' ghost className='mlr5' onClick={()=> {}} />
        } else {
            return ''
        }
    } 
	// paging
	fetch = param => $fn.fetch.call(this,'sp-info-modify/index', param)
	cols = [
        { type: "checkbox" }, 
        { title: '条码号',		    field: 'spec_code',			width:120 },
        { title: '类型',		    field: 'type',			    width:100, render: ({rows}) => {
            return window.$fn.filterSelect(this.typeOptions, rows.type, 'label', 'value') 
        } },
        { title: '姓名',		    field: 'patient_name',		width:80 },
        { title: '医院',		    field: 'hosp_name',			width:150 },
        { title: '内容',		    field: 'content',			width:200 },
        { title: '创建时间',		field: 'created_at',		width:150 },
        { title: '状态',		    field: 'status',			width:80, render: ({rows}) => {
            return window.$fn.filterSelect(this.statusOptions, rows.status, 'label', 'value') 
        } }, 
        { title: '操作',	        width:230, render: ({rows}) => {
            let d = ''
            switch (rows.status) {
                case "0":
                    d = <React.Fragment>
                        <Button label='编辑' ghost className='mlr5' onClick={()=> {
                            this.refs.modal.open() 
                            this.isEdit = true
                            $http.submit(null, 'sp-info-modify/info', { param: {uuid: rows.uuid}} ).then(data => { 
                                this.setState({infos: data})
                            }) 
                        } } /> 
                        <Button label='审核' ghost className='mlr5' onClick={()=> { 
                            const param = {uuid: rows.uuid}
                            coms.interfaceConfirm('sp-info-modify/audit', '审核', param, () => { this.fetch(this.model) })
                        } } /> 
                        {this.ImgsDom(rows.imgs)}
                        {this.updateData(rows)}
                    </React.Fragment>
                    break;
                case "1":
                    d = <React.Fragment>
                        <Button label='完成' ghost className='mlr5' onClick={()=> {
                            const param = {uuid: rows.uuid}
                            coms.interfaceConfirm('sp-info-modify/complete', '完成', param, () => { this.fetch(this.model) })
                        } } /> 
                        <Button label='审核报告单' ghost className='mlr5' onClick={()=> {
                            const param = { spec_code: rows.spec_code }
                            coms.interfaceConfirm('sp-info-modify/upAudit', '审核报告单', param, () => { this.fetch(this.model) })
                        } } /> 
                        {this.ImgsDom(rows.imgs)}
                        {this.updateData(rows)}
                    </React.Fragment>
                    break;
                case "2":
                    d = <React.Fragment> 
                        <Button label='批准报告单' ghost className='mlr5' onClick={()=> {
                            const param = { spec_code: rows.spec_code }
                            coms.interfaceConfirm('sp-info-modify/assocApprove', '批准报告单', param, () => { this.fetch(this.model) })
                        } } /> 
                        {this.ImgsDom(rows.imgs)}
                        {this.updateData(rows)}
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
            } },
            { label:'导出', ghost: true, onClick:()=> {
                let param = {
                    spec_code: this.model.spec_code,
                    status: this.model.status,
                    type: this.model.type
                }
                coms.exportExcel({
                    api: 'sp-info-modify/export',
                    param: {param: param}
                }) 
            }},
            { label:'报告单终止', ghost: true, disabled: !$fn.hasArray(this.state.selectedKeys), onClick:()=> this.refs.modal1.open()}
        ]
    }
	render(){
		const { data, pullLoading, pag, submit } = this.state
		return (
			<Page title='信息修改' ButtonGroup={this.ButtonGroup()}>
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
                    <InfochangeForm onRef={ref => this.addsubtractRef = ref} rows={this.state.infos} type={this.isEdit} close={() => {
                        this.refs.modal.close()
		                this.fetch(this.model)
                    }} />
				</Modal>
                <Modal ref='modal1' title='报告单终止' width={648} noFooter>
                    <SubmitForm
						modal
						data = { submit }
						onSubmit = { v => {  
                            let param = {...v, uuid: this.state.selectedKeys.map(i => i.uuid)}
                            $http.submit(null, 'sp-info-modify/abort', { param: param }).then(data=>{
								message.then(f=>f.default.success('操作成功'))
								this.refs.modal1.close()
								this.fetch(this.model) 
							}) 
						}}
						onClose = { ()=>this.refs.modal.close() }
					 />
				</Modal> 
			</Page>
		)
	}
}