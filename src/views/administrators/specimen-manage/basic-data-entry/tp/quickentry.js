import React from 'react' 
// ===================================================================== antd
import { Image } from 'antd' 
// ===================================================================== common
import coms from '@/private/js/common.js'
// ===================================================================== global declare
const { $http, $fn, $async } = window 
// const Button = $async(()=>import('@antd/button'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table')) 
const PatientDetails = $async(()=>import('./patient-details')) 
const TableDatas = $async(()=>import('./quickentry-table-datas')) 
// // ===================================================================== 缓存 
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {}, 
		pullLoading: false,
		selectedRow: {}, 
		isScan: false, // 是否扫码录入
		img_url: '' // 图片地址
	}    
	statusOption = [
        { value: "", label: "全部" },
        { value: 0, label: "待录入" },
        { value: 1, label: "待审核" }
    ]
	model = {}  
	forms = [
		{ label:'条码号',		name:'spec_code',		type:'input' },
		{ label:'医院',			name:'hosp_id',			type:'select', data:[], nameStr:'name', idStr:'value' },
		{ label:'接收时间',		name:'date', 			type:'date-range', names:['start_at','end_at'] }, 
		{ label:'状态',			name:'status',			type:'select', data:this.statusOption, nameStr:'label', idStr:'value' },
	]
	cols = [
		{ title: '条码号', 		field: 'spec_code', 		width: 120 },
		{ title: '送检医院', 	field: 'hosp_name', 		width: 110 },
		{ title: '接收时间', 	field: 'check_time', 		width: 150 }
	]
	fetch = param => $fn.fetch.call(this,'app-upload-pic/index', {...param, entry_type: 'left'})
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
		this.fetch()
	}  
	ButtonGroup = () => {
		return [
			{ label:'返回',  onClick:()=>{ $fn.back(this) } },
			{ label:'扫码录入 F1', code:'F1', ghost:true, onClick:()=> this.PatientDetailsRef.handleScanInput() },
			{ label:'仅保存 F2', code:'F2', ghost:true, onClick:()=> this.PatientDetailsRef.quickentrySaves() },
			{ label:'保存并审核 F3', code:'F3', ghost:true, onClick:()=> this.PatientDetailsRef.saveAndAudit() },
			{ label:'下一个 F4', code:'F4', ghost:true, onClick:()=> this.PatientDetailsRef.nextSpec() },
		]   
	} 
	render(){
		const { data, pullLoading, pag, img_url } = this.state
		return (
			<Page title='快捷录入' ButtonGroup={this.ButtonGroup()}> 
				<div className='ex xplr fx p10'> 
					<div className='ex fv' style={{width: 0}}>
						<div className='ex mb10 r4px fv oh' style={{border: '1px solid #F2F2F2'}}>
							<div className='b p10' style={{borderBottom: '1px solid #F2F2F2'}}>图片预览</div>
							<div className='fxmc' style={{height: '400px'}}>
								<Image className='quickentry-img' src={img_url} />
							</div>
						</div>
						<div className='r4px fv ex oh' style={{ border: '1px solid #F2F2F2'}}>
							<SearchForm
								data		= { this.forms }   
								onChange	= { (v,press)=> $fn.onChange.call(this,v,press) } 
								onSubmit	= { $fn.onSubmit.bind(this) } 
								onReset		= { $fn.onReset.bind(this,this.forms) }
								loading		= { pullLoading }
							/>
							<div className='fx ex' style={{padding: '0 4px 4px 4px', height: 0}}>
								<div className='ex bor1'>
									<Table 
										className       = 'h'
										cols			= { this.cols }
										data 			= { data }
										loading 		= { pullLoading } 
										onRow			= { (rows, index) => { 
											this.setState({ selectedRow: rows, img_url: rows.img_url})  
											this.PatientDetailsRef.quickentryEdits(rows) 
										}}
										pag				= { pag }
										onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) } 
										onSort			= { v => $fn.onSort.call(this, v) }
									/>
								</div>
								<div className='ex bor1 ml10'>
									<TableDatas onRef={ref => this.TableDatasRef = ref} />
								</div>
							</div>
						</div>
					</div>
					<div className='fv r4px' style={{width: '450px', border: '1px solid #F2F2F2', marginLeft: '10px'}}>
						<div className='b p10'>信息修改</div>
						<div className='ex oxys p10' style={{paddingTop: 0 }}>
							<PatientDetails 
								onRef={ref => this.PatientDetailsRef = ref} 
								noEditor={false} 
								isScan={this.state.isScan} 
								changeImgUrl={(url) => {
									this.setState({img_url: url})
								}}
								getpage={() => {
									this.fetch(this.model)  
									this.TableDatasRef.fetch()
								}} />
						</div>
					</div>
				</div> 
			</Page>
		)
	}
}