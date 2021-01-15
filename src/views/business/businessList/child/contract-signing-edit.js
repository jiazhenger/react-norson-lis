
import React from 'react'
import coms from '@/private/js/common.js'
import Modal from '@antd/modal'
import { Upload } from 'antd'
// import reqwest from 'reqwest'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const message = import('@antd/message')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
const Button = $async(()=>import('@antd/button'))
const Table = $async(()=>import('#cpt/table')) 
const SubmitForm = $async(()=>import('#cpt/submit-form'))
// ===================================================================== private component
const cacheApi = import('@/private/api/cacheApi')

// ===================================================================== component
export default class extends React.Component{
	state = {
		data: [],
		pag: {},
		selectedKeys:[],
		deviceStadius: [],
		department: [],
		submit: [
			{ label:'合同编码', 	name:'code', },
			{ label:'合同名称', 	name:'name', },
			{ label:'客户名称', 	name:'hosp_id',	    type:'select', data:[], },
			{ label:'合同折扣率(小数点)',               name:'discount_rate', },
			{ label:'结算周期', 	name:'reckon_day',	type:'select', data:[],},
			{ label:'回款周期', 	name:'back_day',	type:'select', data:[], },
			{ label:'对票', 	    name:'right_vote',	type:'select', data:[], nameStr:'label', idStr:'value', },
			{ label:'信用期', 	    name:'credit', },
			{ label:'合并开票', 	name:'merge_vote',	type:'select', data:[], nameStr:'label', idStr:'value', },
			{ label:'状态', 	    name:'status',	    type:'select', data:[], nameStr:'label', idStr:'value', },
			{ label:'合同生效时间', name:'sign_at',		 type: 'date-time', },
			{ label:'合同到期时间', name:'contract_validity', type: 'date-time',  },
			{ label:'合同延期时间', name:'delay', },
            { label:'合同类型', 	name:'type',        type:'select', data:[], nameStr:'label', idStr:'value', },
        ],
        submit1: [
			{ label:'合同备注',			name:'remark',	type:'textarea', full:true, width:'100%', },
			{ label:'其他开票特殊要求', name:'special',  type:'textarea', full:true, width:'100%', },
			{ label:'结算单打印要求', 	name:'printing', type:'textarea', full:true, width:'100%', },
		],
        uuid: $fn.query('uuid'),
		fileName: '',
		fileList: [],
    	uploading: false,
	}
	hide_edit=$fn.query('hideEdit')
	model = {
		contract_id: $fn.query('uuid')
	}
    rightVoteList = [{ label: "是", value: "1" }, { label: "否", value: "0" }] // 对票、合并开票
    option = [ // 状态
        { label: "草稿", value: "0" },
        { label: "正常", value: "1" },
        { label: "已过期", value: "2" }
    ]
    contractTypeOption = [ // 合同类型
        { label: '预备合同', value: '1' },
        { label: '正式合同', value: '2'  }
    ]
	async getDataAsync() {
		const { submit } = this.state
		$fn.getDisItem({ // 结算周期
			code: 44300,
			callback: (data) => {
				submit[4].data = data
				this.setState({deviceStadius:data, submit})
			}
		})
		$fn.getDisItem({ // 回款周期
			code: 44400,
			callback: (data) => {
				submit[5].data = data
				this.setState({deviceStadius:data, submit})
			}
		})
	}
	componentDidMount(){
		const { submit, submit1, uuid, data } = this.state
		if (this.hide_edit == 1) {
			submit.map(item => {
				item.disabled = true
			})
			submit1.map(item => {
				item.disabled = true
			})
		}
        submit[6].data = this.rightVoteList
        submit[8].data = this.rightVoteList
        submit[9].data = this.option
        submit[13].data = this.contractTypeOption
		cacheApi.then(f => {
			$fn.getCache({ // 客户名称
				cache: f.default.BsHospitalSelect, name: 'name', id: 'uuid', callback: (data) => {
					if ($fn.hasArray(data)) {
						submit[2].data = data
                    } else {
                        $http.submit(null, 'bs-hospital/select').then(data => {
							submit[2].data = data
							$fn.setCache()
                        })
					}
					this.setState({submit})
				}
			})
		})
		this.getDataAsync()
		if (uuid) {
			$http.submit(null, 'bs-contract/info', { param: { uuid: uuid}, loading:false}).then(data=>{
				$fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
				$fn.setSubmitValues(submit1, data, ()=>{this.setState({submit1})})
			})
			this.fetch()
		}
	}
	submitForms() {
		const { submit, submit1, uuid } = this.state
		let obj = {}
		submit.map(v =>{
			obj[v.name] = v.value
		})
		submit1.map(v =>{
			obj[v.name] = v.value
		})
		if(uuid) { // 编辑
			const param = {
				uuid: uuid,
				...obj
			}
			$http.submit(null, 'bs-contract/edit',{ param }).then(data => {
				message.then(f=>f.default.success('操作成功'))
				$fn.back(this)
			})
		} else { // 新增
			const param = {
				...obj
			}
			$http.submit(null, 'bs-contract/add',{ param }).then(data => {
				message.then(f=>f.default.success('操作成功'))
				$fn.back(this)
			})
		}
	}
	fetch = param => $fn.fetch.call(this,'bs-file/index', {...param, ...this.model} )
	cols = [
        { title: '文件名', 		field: 'img_name', 		width:120 },
		{ title: '上传时间', 	field: 'update_at',		width:120 },
		{ title: '上传人', 		field: 'upload_user', 	width:120 },
		{ title: '操作', 		width:120, 				render:({rows})=>{
			let show = rows.file_name.substr(rows.file_name.lastIndexOf(".") + 1)
			let Exhibition = ''
			if (show === "pdf"||show === 'jpg'||show === 'png'||show === 'gif') {
				Exhibition = true 
			} else {
				Exhibition = false
			}
			return (
				<div className='plr5'>
					<Button label={Exhibition?'查看':'下载'} ghost className='ml15' onClick={() => {
						if (Exhibition) {
							this.setState({fileName: rows.file_name})
							this.refs.modal.open()
						} else {
							window.location.href = rows.file_name;
						}
					}} />
					<Button label='删除' ghost className='ml15' onClick={() => {
						coms.interfaceConfirm('bs-file/del', '删除', { uuid: rows.uuid }, () => { 
							this.fetch()
							this.setState({selectedKeys: []})
						 })
                    }} />
				</div>
			)
		} },
	]
	render(){
		const { data, pullLoading, pag, selectedKeys, submit, submit1, uuid, fileName, uploading, fileList } = this.state
		let that = this
		const props = {
			action: window.$config.api + ('upload/img'),
			headers:{
				Authorization: "Bearer " + window.$fn.getToken()
			},
			data: {type: 1, modular: '132'},
			onChange({ file }) {
				if (file.response) {
					that.setState({fileList: file.response.data[0]})
				}
			}
		}
		return (
			<Page title={uuid ? '合同管理新增' : '合同管理编辑'}>
				<div className='oxys'>
					<Button label='返回' size='small' className='dkm ml30 mt10' onClick={()=> $fn.back(this) } />
					<Button label='保存' size='small' className='dkm ml30 mt10' disabled={this.hide_edit == 1?true:false} onClick={()=> this.submitForms() } />
					<div className='mb20 p20'>
						<SubmitForm
							modal
							display = { true }
							data = { submit }
							onChange = {(v, press, { name, data }) => {
								submit.map(item => {
									if (item.name === name) {
										item.value = v
									}
								})
							} }
							init    = { form => this.form = form }
						/>
					</div>
					<Modal ref = 'modal' title = '查看' width={648} noFooter >
						<img className='w' style={{width: '600px'}} src={fileName} />
					</Modal>
					<div className='fxbc '>
						<h6 className="w xmlr pl20 h40 b">附件列表</h6>
						<Button label='上传' size='small' disabled={ this.dis} className='dkm mb10 mr10 fxmr' onClick={()=> {
							if (!uuid) {
								message.then(f=>f.default.error('请在编辑中上传文件'))
							} else {
								return ( this.refs.modal1.open() )
							}
							
						}} />
					</div>
					<Modal ref = 'modal1' title = '上传' width={400} noFooter >
						<Upload {...props}>
							<Button noStop>选择文件</Button>
						</Upload>
						<Button label='上传文件' size='small' className='mt10' style={{position: 'absolute', top: '56px', right: '24px',}} onClick={()=> {
							const param = {
								img_name: fileList.img_name,
								img_path: fileList.img_path,
								file_name: fileList.img_url,
								contract_id: $fn.query('uuid'),
							}
							$http.submit(null, 'bs-file/add', { param }).then(data => {
								message.then(f=>f.default.success('上传成功'))
								this.fetch()
								this.refs.modal1.close()
							})
						}} />
					</Modal>
					<Table
						className		= 'xplr'
						cols			= { this.cols }
						data 			= { data }
						loading 		= { pullLoading }
						onRow			= {current => {}}
						pag				= { pag }
						onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
						onSort			= { v => $fn.onSort.call(this, v) }
					/>
					<div className='ex fv xplr pt10'>
						<SubmitForm
							modal
							display = { true }
							data = { submit1 }
							onChange = {(v, press, { name, data }) => {
								submit1.map(item => {
									if (item.name === name) {
										item.value = v
									}
								})
							} }
							init    = { form => this.form = form }
						/>
					</div>
				</div>
			</Page>
		)
	}
}