import React from 'react'
import coms from '@/private/js/common.js'
// ===================================================================== antd
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
const Table = $async(()=>import('#cpt/table'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== component
export default class extends React.Component{
	state = {
        data:[],
        pag: {},
        selectedKeys:[],
        submit: [
            { label: '选项',    name: 'num_key',   full: true,     width: '100%',      type: 'select', data: [],    required: true,    onChange: (v, press, {name, data}) => {
                this.selectChange(v)
            } },
            { label: '结果',    name: 'result',    full: true,     width: '100%',      type: 'textarea'},
            { label: '注释',    name: 'notes',     full: true,     width: '100%',      type: 'textarea'},
            { label: '排序',    name: 'sort',      full: true,     width: '100%',},
        ],
        uuid: ''
    }
    model = {}
    selectChange(v) {
        const { submit } = this.state
        const d = submit[0].data.filter(i => i.value === v)
        if ($fn.hasArray(d)) {
            this.option = d[0].name
        }
    }
	componentDidMount(){
        const { submit } = this.state
        cacheApi.then(f => {
            const d = f.default
            // TCT选项
			$fn.getCache({
				cache: d.conftctSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
						submit[0].data = data
                    } else {
                        $http.submit(null, 'conf-tct/selectSum').then(data => {
							submit[0].data = data
                            $fn.setCache()
                        })
                    }
				}
            })
		})
		this.fetch(this.model)
    }
    // paging
    fetch = param => $fn.fetch.call(this,'conf-tct/index', param)
    // table
	cols = [
		{ type:'checkbox' },
		{ title: '选项',    field: 'option',    width: 300,     tdCss: 'wpn' },
		{ title: '结果',    field: 'result',    width: 240,     tdCss: 'wpn'},
		{ title: '注释',    field: 'notes',     width: 500,     tdCss: 'wpn'},
        { title: '数值',    field: 'num_key',   width: 100},
        { title: '排序',    field: 'sort',      width: 60},
		{ title: '操作', align:'tc',   width: 150, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button className='mr10' label='编辑' ghost onClick={e=>{
						this.refs.modal.open()
						const { submit } = this.state
						$http.submit(null,'conf-tct/info',{ param:{uuid: rows.uuid} }).then(data=>{
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
				coms.interfaceConfirm('conf-tct/del', '删除', param, () => {
                    this.fetch(this.model)
                    this.setState({selectedKeys: []})
                })
			} },
		]
	}
	render(){
        const { submit, pullLoading, data, pag } = this.state
		return (
			<Page title='TCT规则设置' ButtonGroup={this.ButtonGroup()}>
                <Table
                    className		= 'xplr'
                    cols			= { this.cols }
                    data 			= { data }
                    loading 		= { pullLoading }
                    onRow			= { (v) => this.setState({selectedKeys: v})}
                    pag				= { pag }
                    onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
                    onSort			= { v => $fn.onSort.call(this, v) }
                />
                <Modal ref='modal' title={this.isEdit ? '编辑' : '添加'} width={648} noFooter>
                    <SubmitForm
                        modal
                        data = { submit }
                        onSubmit = { v => {
                            if (this.isEdit) {
                                const param = { ...v, option: this.option || '', uuid: this.rows.uuid}
                                $http.submit(null,'conf-tct/edit',{ param }).then(data=>{
                                    message.then(f=>f.default.success('编辑成功'))
                                    this.refs.modal.close()
                                    this.fetch(this.model)
                                })
                            } else {
                                const param = { ...v, option: this.option || '' }
                                $http.submit(null, 'conf-tct/add', { param }).then(data => {
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