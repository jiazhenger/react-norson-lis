import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
const confirm = import('@antd/confirm')
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
		submit: [
			{ label: '设备名称',	    name: 'device_id',		    required: true,     type: 'select',     data: [],       nameStr: 'title', idStr:'value'},
            { label: '设备编号',	    name: 'device_number',	    disabled: true },
            { label: '设备项目名称',	name: 'device_pro_name',    required: true },
			{ label: '通道号',		    name: 'pass_num',           required: true },
			{ label: '描述',	        name: 'desc_info',         type:'textarea' },
		],
	}
	forms = [
		{ label: '设备名称',        name:'device_id',           type:'select', data: [], nameStr: 'title'},
		{ label: '设备型号',        name:'device_model'},
		{ label: '仪器项目名称',    name:'device_pro_name'},
		{ label: '通道号',          name:'item_name'},
	]
    model = {device_id: $fn.query('id') || ''}
	componentDidMount(){
        const { submit } = this.state
        cacheApi.then(f => {
            const d = f.default
            // 设备名称
            $fn.getCache({
                cache: d.deviceSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        data.forEach(v=> v.title = `${v.device_name}(${v.device_number}) - ${v.device_model}`)
                        submit[0].data = data
                        this.forms[0].data = data
                    } else {
                        $http.submit(null, 'device/select').then(data => {
                            data.forEach(v=> v.title = `${v.device_name}(${v.device_number}) - ${v.device_model}`)
                            submit[0].data = data
                            this.forms[0].data = data
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
	fetch = param => $fn.fetch.call(this,'de-pass-info/index', param)
	// table
	cols = [
        { type:'checkbox' },
		{ title: '设备名称', 	    field: 'device_name',		width: 150 },
		{ title: '设备编号',		field: 'device_number',		width: 100 },
		{ title: '设备型号', 		field: 'device_model',		width: 160 },
		{ title: '仪器项目名称', 	field: 'device_pro_name',			width: 100 },
		{ title: '通道号',			field: 'pass_num',		    width: 100 },
		{ title: '描述', 			field: 'desc_info',	        width: 130 },
		{ title: '操作', align:'tc', width:150, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='编辑' className='ml15' ghost onClick={e=>{
						const { submit } = this.state
						$http.submit(null, 'de-pass-info/info', {param: {uuid: rows.uuid}}).then(data => {
							this.refs.modal.open()
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
				submit[0].value = ''
				submit[1].value = ''
				submit[2].value = ''
				submit[3].value = ''
				submit[4].value = ''
                this.isEdit = false
				this.setState({ submit })
            } },
            { label: '删除', disabled: !this.state.selectedKeys.length, onClick: () => {
                confirm.then(f => {
                    f.default({
                        msg: '是否确认删除?',
                        onOk: close => {
                            const keys = this.state.selectedKeys.map(v=>v.uuid)
                            $http.submit(null, 'de-pass-info/del', { param: { uuid: keys } }).then(data => {
                                message.then(f => f.default.success('删除成功'))
								this.fetch(this.model)
								this.setState({selectedKeys: []})
                                close()
                            })
                        }
                    })
                })
            } },
			{ label:'文件导入', ghost:true, onClick:()=>{
				
			} },
		]
	}
	render(){
		const { data, pullLoading, pag, submit } = this.state
		return (
			<Page title='仪器通道管理' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
                    onChange    = {(v, press, { name, data }) => {
						$fn.onChange.call(this, v, press, () => {
							if (name && name === 'device_id') {
								return { device_name: data.device_name }
							}
						})
					} } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onAdd		= { this.onAdd } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
					init        = { form => form.setFieldsValue({device_id: this.model.device_id}) }
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
                        data 		= { submit }
                        onChange    = {(v, press, { name, data }) => {
                            const { submit } = this.state;
                            if (name === 'device_id') {
                                this.deviceInfo = submit[0].data.filter(i => i.value === v)
                                this.formSubmit.setFieldsValue({device_number: $fn.hasArray(this.deviceInfo) ? this.deviceInfo[0].device_number : ''})
                            }
                        } } 
						onSubmit 	= { v => {
                            if (this.isEdit) {
                                const param = { ...this.rows, ...v }
                                $http.submit(null, 'de-pass-info/edit', { param }).then(data => {
                                    message.then(f => f.default.success('编辑成功'))
                                    this.refs.modal.close()
                                    this.fetch(this.model)
                                })
                            } else {
                                const param = { ...v }
                                $http.submit(null, 'de-pass-info/add', { param }).then(data => {
                                    message.then(f => f.default.success('添加成功'))
                                    this.refs.modal.close()
                                    this.fetch(this.model)
                                })
                            }
						}}
                        onClose 	= { ()=>this.refs.modal.close() }
                        init    	= { form => this.formSubmit = form }
					 />
				</Modal>
			</Page>
		)
	}
}