import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
import coms from '@/private/js/common.js'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		submit: [
			{ label: '药物名称',	name: 'drug_name',		    required: true},
			{ label: '英文名称',	name: 'name_en'},
			{ label: '简写',        name: 'short_name' },
			{ label: '通道号',		name: 'channel_number'},
			{ label: '描述',		name: 'description',		full: true,         width: '100%',  type: 'textarea'},
		],
	}
	forms = [
		{ label:'药物名称',     name:'drug_name'},
		{ label:'英文名称',     name:'name_en'},
		{ label:'通道号',       name:'channel_number'},
		{ label:'所属药敏组合', name:'group_id',        type:'select',      data:[],    nameStr: 'group_name'},
	]
	model = {}
	componentDidMount(){
		cacheApi.then(f => {
            const d = f.default
            // 药敏组合列表
            $fn.getCache({
                cache: d.drugGroupSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        this.forms[3].data = data
                    } else {
                        $http.submit(null, 'drug-group/selectList').then(data => {
                            this.forms[3].data = data.items
                            $fn.setCache()
                        })
                    }
                }
            })
        })
        this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'drug-sensitivity/index', param)
	// table
	cols = [
		{ type:'checkbox' },
		{ title: '抗菌药物名称', 	field: 'drug_name' },
		{ title: '英文名称',        field: 'name_en'},
		{ title: '描述',           field: 'description'},
		{ title: '简写',            field: 'short_name' },
		{ title: '通道号',          field: 'channel_number' },
		{ title: '操作', align:'tc', render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='编辑' ghost onClick={e=>{
						this.refs.modal.open()
						const { submit } = this.state
						$http.submit(null,'drug-sensitivity/info',{ param:{uuid: rows.uuid} }).then(data=>{
							this.rows = data
                            this.isEdit = true
                            $fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
                        })
					}}  />
				</div>
			)
		}},
	]
	ButtonGroup = () => {
		return [
			{ label:'添加 F2', code:'F2', onClick:()=>{
				this.refs.modal.open()
				const { submit } = this.state
				submit.map(item => {
                    item.value = ''
                })
				this.isEdit = false
				this.setState({ submit })
			} },
			{ label:'删除', ghost:true, disabled:this.state.selectedKeys.length===0, onClick:()=>{
				const param = {uuid: this.state.selectedKeys.map(v=>v.uuid)} 
				coms.interfaceConfirm('drug-sensitivity/del', '删除', param, () => {
					this.fetch(this.model)
					this.setState({selectedKeys: []})
				})
			} },
		]
	}
	render(){
		const { data, pullLoading, pag, submit } = this.state
		return (
			<Page title='药敏' ButtonGroup={this.ButtonGroup()}>
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
                            const data = {
                                name_en: v.name_en || '',
                                short_name: v.short_name || '',
                                channel_number: v.channel_number || '',
                                description: v.description || ''
                            }
							if (this.isEdit) {
								const param = { ...v, uuid: this.rows.uuid}
								$http.submit(null,'drug-sensitivity/edit',{ param }).then(data=>{
									message.then(f=>f.default.success('编辑成功'))
									this.refs.modal.close()
									this.fetch(this.model)
								})
							} else {
								const param = { ...v, ...data }
								$http.submit(null, 'drug-sensitivity/add', { param }).then(data => {
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
			</Page>
		)
	}
}