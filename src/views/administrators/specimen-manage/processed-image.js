// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== common
import coms from '@/private/js/common.js'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== global template
// const Image = $async(()=>import('@tp/image'))
// ===================================================================== antd
const Button = $async(()=>import('@antd/button')) 
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table')) 
const PImg = $async(()=>import('@cpt/p-img'))

// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		imgModel: false,
		rows: {}
	}
	
	forms = [
		{ label:'选择状态', name:'status', type:'select', data:[], nameStr:'name', idStr:'value' }
	]
	model = {}
	componentDidMount(){
		$fn.dataSave('dis-item-43700-data').then(local => {
			if($fn.hasArray(local)){
			  this.forms[0].data = local
			}else{
			  $http.submit(null,'dis-item/item', { param:{dis_code:43700}, loading:false}).then(data=>{
				this.forms[0].data = data 
				$fn.dataSave('dis-item-43700-data', data)
			  }) 
			}
		}) 
		this.fetch()
	}
	// paging
	fetch = param => $http.paging(this,'app-upload-pic/index',{ param:{...param, pageSize:this.pageSize, ...this.model, entry_type: 'pic'}, loading:false } )
	cols = [
		{ title: '条码号', 		field: 'spec_code', 		width:120 },
		{ title: '图片编码', 	field: 'pic_name', 			width:320 },
		{ title: '上传时间', 	field: 'created_at', 		width:150 },
		{ title: '上传人', 		field: 'operator_name', 	width:100 },
		{ title: '状态', 		field: 'pic_status_name', 	width:80 },
		{ title: '审核备注', 	field: 'audit_remark', 		width:120 }, 
		{ title: '操作', 		align:'tc', 				width:150, render:({rows})=>{
			return (
				<div className='plr5 fx'>
					{/* 查看-未完成 */}
					<Button label='查看' ghost className='mlr5' onClick={()=> this.setState({imgModel: true, rows: rows}) }/> 
					{String(rows.pic_status) !== "43703" && <Button label='删除' ghost className='mlr5' onClick={()=> {
						const param = {uuid: rows.uuid}
						coms.interfaceConfirm('app-upload-pic/del', '删除', param, () => { this.fetch() })
					}} /> }
				</div>
			)
		}} 
	]
	ButtonGroup = () => {
		return [
			{ label:'图片上传 F2', code:'F2', onClick:()=>{
				$fn.push(this, $fn.getRoot(2).root + 'processed-image/upload')
			} },
			{ label:'条码关联', onClick:()=>{
				$fn.push(this, $fn.getRoot(2).root + 'processed-image/relevance')
			} },
			{ label:'图片审核', onClick:()=>{
				$fn.push(this, $fn.getRoot(2).root + 'processed-image/audit')
			} }
		]
	}
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='申请单上传' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
					onAdd		= { ()=> $fn.push(this, $fn.getRoot().root + 'specimen-manage/processed-image/upload') }
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
				{/* 查看图片 */} 
				{this.state.imgModel && 
					<div className='view-image full'>
						<PImg src={this.state.rows.pic_path} onClose={() => this.setState({imgModel: false})} /> 
					</div>
				}
			</Page>
		)
	}
}