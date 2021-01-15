// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== common
import coms from '@/private/js/common.js' 
// ===================================================================== 图片
import is_pic_s from '@img/is_pic_s.png'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const message = import('@antd/message')
const Checkbox = $async(()=>import('@antd/form/checkbox'))
const Button = $async(()=>import('@antd/button'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
const PImg = $async(()=>import('@cpt/p-img'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table'))
const PatientDetails = $async(()=>import('./tp/patient-details')) 
// ===================================================================== 缓存
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		selectedRow: {},
		batchEditFlag: false,
		isEditor: true, // 显示编辑按钮
		isSave: true, // 显示保存按钮
		isAudit: true, // 显示审核按钮
		imgModel: false, // 查看图片
	} 
	statusSelect = [
		{ value: "99", label: "全部" },
		{ label: "审核未通过", value: -1 },
		{ label: "待完善", value: 0 },
		{ label: "待审核", value: 1 },
		{ label: "审核通过", value: 2 }
	]  
	forms = [
		{ label:'状态',			name:'status',			type:'select', data:this.statusSelect, nameStr:'label', idStr:'value' },
		{ label:'医院',			name:'hospital_id',		type:'select', data:[], nameStr:'name', idStr:'value' },
		{ label:'条码号',		name:'spec_code',		type:'input' },
		{ label:'病人姓名',		name:'patient_name',	type:'input' },
		{ label:'接收日期',		name:'date', 			type:'date-range', names:['start_date','end_date'] },
		{ label:'仅显示有图',	name:'view_pic',			type:'checkbox'}
	]
	sexSelect = []
	model = {}
	componentDidMount(){
		cacheApi.then(f => {
			$fn.getCache({
				cache: f.default.BsHospitalSelect, name: 'name', id: 'value', callback: (data) => {
					if ($fn.hasArray(data)) {
                        this.forms[1].data = data
                    } else {
                        $http.submit(null, 'bs-hospital/select').then(data => {
                            this.forms[1].data = data
                            $fn.setCache()
                        })
                    }
				}
			})
		}) 
		$fn.dataSave('dis-item-45700-data').then(local => {
			if($fn.hasArray(local)){ 
			this.sexSelect = local
			}else{
			  $http.submit(null,'dis-item/item', { param:{dis_code:45700}, loading:false}).then(data=>{
				this.sexSelect = data 
				$fn.dataSave('dis-item-45700-data', data)
			  }) 
			}
		}) 
		this.fetch()
	}
	fetch = param => $fn.fetch.call(this,'spec-case-info/index', param)
	cols = [
		{ type:'checkbox' }, 
		{ title: '申请单条码', 		field: 'spec_code', 		width: 130,		sort: true, render: ({rows}) => {
			return <div>{rows.spec_code} {rows.pic_path && <img src={is_pic_s} />}</div>
		} },
		{ title: '审核状态', 		field: 'status', 			width: 80, render: ({rows})  => {
			return window.$fn.filterSelect(this.statusSelect, rows.status, 'label', 'value') 
		} },
		{ title: '受检人姓名', 		field: 'patient_name', 		width: 110 },
		{ title: '性别', 			field: 'sex', 				width: 50, render: ({rows})  => {
			return window.$fn.filterSelect(this.sexSelect, rows.sex, 'name', 'value') 
		} }, 
		{ title: '年龄', 			field: 'age', 				width: 75 },
		{ title: '受检人电话', 		field: 'patient_phone',		width: 100 },
		{ title: '身份证号', 		field: 'card_no', 			width: 150 },
		{ title: '送检单位', 		field: 'hosp_name', 		width: 220 },
		{ title: '送检科室', 		field: 'department_name', 	width: 100 }, 
		{ title: '送检医生', 		field: 'doctor', 			width: 100 }, 
		{ title: '医生电话', 		field: 'doctor_phone', 		width: 100 }, 
		{ title: '接收时间', 		field: 'receive_time', 		width: 160 }, 
		{ title: '采样时间', 		field: 'coll_time', 		width: 160 }, 
	]
	
    Derivedform() { 
		$http.submit(this, 'spec-case-info/viewsexport', {param: this.model, submitLoading:'infoLoading'}).then(data => {
			if (data) {
				window.location.href = data.url;
			} else {
				message.then(f => f.default.error('操作失败')) 
			}
		}) 
	}
	// 详情-判断条码状态
	setStatus = (status) => { 
		if (status) {
			if (String(status) === "0") { 
				this.setState({isSave: true, isAudit: true, isEditor: false})
			} else if (String(status) === "1") { 
				this.setState({isSave: true, isAudit: false, isEditor: false})
			} else if (String(status) === "2"){ 
				this.setState({isSave: true, isAudit: true, isEditor: false})
			} else {
				this.setState({isSave: true, isAudit: true, isEditor: false})
			}
		} else {
			this.setState({isSave: true, isAudit: true, isEditor: true})

		} 
	} 
	// 详情-下一条
	nextSpec = (rows) => {
		console.log(rows)
	}

	ButtonGroup = () => {
		return [    
		{ label:'文件导入', ghost:true, onClick:()=>{}},
		{ label:'快捷录入', ghost:true, onClick:()=>{
			$fn.push(this, $fn.getRoot(2).root + 'basic-data-entry/index/quickentry') 
		}},
		{ label:'双录入', ghost:true, onClick:()=>{
			$fn.push(this, $fn.getRoot(2).root + 'basic-data-entry/index/doubleentry') 
		}}, // 要判断是否显示双录入
		{ label:'导出', ghost:true, onClick:() => {
			coms.exportExcel({
				api: 'spec-case-info/viewsexport',
				param: {param: this.model}
			})
		} },
		{ label:'批量审核', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
            const param = {data: this.state.selectedKeys.map(v=> {
                return {uuid:v.uuid, status:v.status}
            })}
			coms.interfaceConfirm('spec-case-info/batchpasscaseinfo', '批量审核', param, () => { this.fetch(this.model) })
        }}
		]
	} 
	handleImg () {
		if (this.state.selectedRow.pic_path) {
			this.setState({imgModel: true})
		} else {
			message.then(f => f.default.error('暂无图片'))
		} 
	}
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='基础资料录入' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms }   
					onChange	= { (v,press)=> {
						if (Object.keys(v)[0] === 'view_pic') { 
							$fn.onChange.call(this,{view_pic: v.view_pic ? 1 : 0},press)
						} else {
							$fn.onChange.call(this,v,press)
						}  
					} } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
				/>
				{/* 表格 */}
				<div className='fx xplr ex'>
					<Table 
						cols			= { this.cols }
						data 			= { data }
						loading 		= { pullLoading } 
						onRow			= { (select, rows, index) => {
							this.setState({ selectedKeys: select, selectedRow: rows })  
							if (!$fn.isEmpty(rows)) {
								this.PatientDetailsRef.getInfos(rows) 
							} else { 
								this.setState({isSave: true, isAudit: true, isEditor: true})
								this.PatientDetailsRef.setState({noEditor: true})
							} 
						}}
						pag				= { pag }
						// selectedKeys    = { ['7234'] }
						onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) } 
						onSort			= { v => $fn.onSort.call(this, v) }
					/>
					{/* 查看图片 */} 
					{this.state.imgModel && 
						<div className='view-image' style={{width: 'calc(100% - 500px)', height: 'calc(100vh - 200px)', top: '130px', left: '30px'}}>
							<PImg src={this.state.selectedRow.pic_path} onClose={() => this.setState({imgModel: false})} /> 
						</div>
					}
					<div className='fv r4px' style={{width: '450px', border: '1px solid #F2F2F2', marginLeft: '10px'}}>
						<div className='b p10'>病人详细信息</div>
						<div className='ex oxys p10' style={{paddingTop: 0 }}>
							<div className='fxm mb10'>
								<Button label='查看图片' className='mr10' disabled={!$fn.hasObject(this.state.selectedRow)} ghost onClick={() => this.handleImg()} /> 
								<Button label='保存' className='mr10' disabled={this.state.isSave} ghost onClick={() => this.PatientDetailsRef.saves()} /> 
								<Button label='审核' className='mr10' disabled={this.state.isAudit} ghost onClick={() => this.PatientDetailsRef.audits()} /> 
								<Button label='编辑' className='mr10' disabled={this.state.isEditor} ghost onClick={() => this.PatientDetailsRef.edits()} /> 
								<Checkbox label='批量编辑' value={this.state.batchEditFlag} onChange={(value) => this.setState({batchEditFlag: value})} /> 
							</div>
							<PatientDetails onRef={ref => this.PatientDetailsRef = ref} setStatus={v => this.setStatus(v) } setVisible={v => this.setState(v)} batchEditFlag={this.state.batchEditFlag} 
							nextSpec={v => this.nextSpec(v)} />
						</div>
					</div>
				</div>
			</Page>
		)
	}
}