import React from 'react'
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const message = import('@antd/message')
const confirm = import('@antd/confirm')
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
const Button = $async(()=>import('@antd/button'))
// ===================================================================== component

export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		data1: {},
		userUuid: '',
		newUserUuid: '',
		id: '',
		submit: [
            { label: '区域名称',	name: 'region_name' },
			{ label: '区域编号',	name: 'region_num' },
			{ label: '上级区域',	name: 'pid', 		type: 'select', data: [] },
			{ label: '负责人',		name: 'leader_id',	type: 'select', data: [], },
			{ label: '排序',		name: 'sort' },
            { label: '状态',		name: 'status', 	type:'select', 	data:[], nameStr:'label', idStr:'value' },
		],
		submit1: [
            { label: '负责人',	name: 'leader_id',		type: 'select', data: [], full:true, width: '100%' },
        ],
	}
	status = [
		{ label: "启用", 	value: "1" },
		{ label: "未启用", 	value: "0" }
	]
	forms = [
		{ label:'区域名称',		name:'region_name',	},
        { label:'区域编号',		name:'region_num',	},
        { label:'状态',			name:'status',		type:'select', 	data:this.status, nameStr:'label', idStr:'value' },
	]
	model = {}
	componentDidMount(){
		const { submit, submit1 } = this.state
		submit[5].data = this.status
		cacheApi.then(f => {
			$fn.getCache({ // 上级区域
				cache: f.default.bsareaSelect, name: 'name', id: 'uuid', callback: (data) => {
					if ($fn.hasArray(data)) {
						submit[2].data = data
                    } else {
                        $http.submit(null, 'bs-area/select').then(data => {
							submit[2].data = data
							$fn.setCache()
                        })
					}
					this.setState({submit})
				}
			})
			$fn.getCache({ // 负责人
				cache: f.default.employeeSelect, name: 'name', id: 'uuid', callback: (data) => {
					if ($fn.hasArray(data)) {
						submit[3].data = data
						submit1[0].data = data
                    } else {
                        $http.submit(null, 'employee/select').then(data => {
							data.forEach(v => {
								v.empl_name = `${v.name} - ${v.number}`
							})
							submit[3].data = data
							submit1[0].data = data
							$fn.setCache()
                        })
					}
					this.setState({submit})
				}
			})
		})
		this.fetch()
	}

	fetch = param => $fn.fetch.call(this,'bs-area/index', param)
	cols = [
		{ type:'checkbox' },
		{ title: '区域名称', 	field: 'region_name', 	width:120 },
		{ title: '区域编号', 	field: 'region_num', 	width:120 },
        { title: '上级区域', 	field: 'parent_name', 	width:120 },
		{ title: '负责人', 		field: 'real_name', 	width:120 },
		{ title: '层级', 		field: 'level', 		width:120 },
		{ title: '状态', 		field: 'status', 		width:120,  
			render: ({rows}) => {
			return window.$fn.filterSelect(this.status, rows.status, 'label', 'value')
		} },
		{ title: '操作', 		align:'tc',				width:120,  render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='编辑' ghost onClick={()=>{
						const { submit } = this.state
						submit[3].disabled = true
						this.refs.modal.open()
						$http.submit(null,'bs-area/info', { param: { id: rows.id } } ).then(data=>{
							this.check = data
							this.isEdit = true
                            $fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
						})
					}}/>
					<Button label='更换负责人' className='ml20' ghost onClick={()=>{
						this.refs.modal1.open()
						const { submit1 } = this.state
						$http.submit(null,'bs-area/info', { param: { id: rows.id } } ).then(data=>{
							this.setState({id:data.id})
							this.setState({userUuid:data.leader_id})
							$fn.setSubmitValues(submit1, data, ()=>{this.setState({submit1})})
						})
					}}/>
				</div>
			)},
		},
	]
	ButtonGroup = () => {
		return [
			{ label:'添加F1', code:'F1', ghost:true, onClick:()=>{
					this.refs.modal.open()
					this.isEdit = false
					const { submit } = this.state
					submit[3].disabled = false
					submit[0].value = ''
					submit[1].value = ''
					submit[2].value = ''
					submit[3].value = ''
					submit[4].value = ''
					submit[5].value = ''
					this.setState({ submit })
				}
			},
			{ label:'删除', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				confirm.then(f=>{
					f.default({
						msg:'是否确认删除?',
						onOk: close => {
							let ids = []
							ids.push(this.state.data1.map(v=>v.id))
							$http.submit(null,'bill/endexport', { param: { ids: ids} } ).then(data=>{
								message.then(f=>f.default.success('删除成功'))
								window.location.href = data.url;
								close()
							})
						}
					})
				})
			} },
		]
	}
	render(){
		const { data, data1, pullLoading, pag, submit, submit1, userUuid, id, newUserUuid, selectedKeys } = this.state
		return (
			<Page title='业务区域' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) }
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
				/>
				{/* 表格 */}
				<Modal ref='modal' title={this.isEdit ? '编辑' : '添加'} width={648} noFooter>
					<SubmitForm
						modal
						data = { submit }
						onSubmit = { v => {
							if (this.isEdit) {
								const param = { absurd_id: this.props.uuid, ...v, uuid: this.rows.uuid}
								$http.submit(null,'bs-area/edit',{ param }).then(data=>{
									message.then(f=>f.default.success('编辑成功'))
									this.refs.modal.close()
									this.fetch(this.model)
								})
							} else {
								const param = { absurd_id: this.props.uuid, ...v }
								$http.submit(null, 'bs-area/add', { param }).then(data => {
									message.then(f => f.default.success('添加成功'))
									this.refs.modal.close()
									this.fetch(this.model)
								})
							}
						}}
                        onClose = { ()=>this.refs.modal.close() }
                        init    = { form => this.form = form }
					 />
				</Modal>
				<Modal ref='modal1' title='更换负责人' width={648} noFooter>
					<SubmitForm
						modal
                        data = { submit1 }
                        onChange    = {(v, press, { name, data }) => {
							const { submit1 } = this.state;
							this.setState({newUserUuid:v})
                        } } 
						onSubmit = { v => {
							const param = {
								id: id,
								userUuid: userUuid,
								newUserUuid: newUserUuid
							 }
							$http.submit(null, 'bs-area/changeRegionalSuper', { param }).then(data => {
								message.then(f => f.default.success('更换成功'))
								this.refs.modal1.close()
								this.fetch(this.model)
							})
						}}
                        onClose = { ()=>this.refs.modal1.close() }
                        init    = { form => this.formSubmit = form }
					 />
				</Modal>
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= {current => {
						this.setState({data1:current})
						this.setState({selectedKeys:current})
					}}
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
					// sort
					onSort			= { v => $fn.onSort.call(this, v) }
				/>
			</Page>
		)
	}
}