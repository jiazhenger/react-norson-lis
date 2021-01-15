import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
// ===================================================================== common
import coms from '@/private/js/common.js'
// ===================================================================== global declare
const { $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
const SubmitForm1 = $async(() => import('./tp/submit-form'))
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		deviceStadius:[],
	}
	forms = [
		{ label:'权限名称',         name:'perm_name'},
		{ label:'权限代码',         name:'perm_code'},
        { label:'权限类型',         name:'perm_type',       type:'select',      data:[]},
        { label:'权限级别',         name:'level',       type:'select',      data:[]},
    ]
    id = $fn.query('id')
    type = $fn.query('type')
	model = {uuid: this.id}
    deleteFn(rows, api) {
        const param = {uuid: rows.uuid} 
        coms.interfaceConfirm(api, '删除', param, () => {
            this.fetch(this.type, this.model)
        })
    }
	componentDidMount(){
        // 权限类型
		$fn.getDisItem({
            code: 900,
            callback: data=>{
                this.forms[2].data = data
            }
        })
        // 权限级别
		$fn.getDisItem({
            code: 800,
            callback: data=>{
                this.forms[3].data = data
            }
        })
        if (this.type === 'process') { // 流程授权列表
            this.fetch('fl-process-auth/permissionlist', this.model)
        } else if (this.type === 'group') { // 分组
            this.fetch('groups/permissionlist', this.model)
        } else if (this.type === 'position') { // 职位
            this.fetch('position/permissionlist', this.model)
        } else if (this.type === 'role') { // 角色
            this.fetch('role/permissionlist', this.model)
        } else if (this.type === 'employee') { // 员工
            this.fetch('employee/permissionlist', this.model)
        }
	}
	// paging
	fetch = (api, param) => $fn.fetch.call(this,api, param)
	// table
	cols = [
		{ title: '权限名称',    field: 'perm_name'},
		{ title: '权限代码',    field: 'perm_code'},
		{ title: '英文名称',    field: 'perm_name_en'},
		{ title: '权限级别',        field: 'level_name'},
		{ title: '权限类型',        field: 'perm_type_name'},
		{ title: '操作',        align:'tc',         render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='删除' ghost onClick={e=>{
						if (this.type === 'process') { // 流程授权列表
                            this.deleteFn(rows, 'process/delperm')
                        } else if (this.type === 'group') { // 分组
                            this.deleteFn(rows, 'group/delperm')
                        } else if (this.type === 'position') { // 职位
                            this.deleteFn(rows, 'position/delperm')
                        } else if (this.type === 'role') { // 角色
                            this.deleteFn(rows, 'role/delperm')
                        } else if (this.type === 'employee') { // 员工
                            this.deleteFn(rows, 'employee/delperm')
                        }
					}}  />
				</div>
			)
		}},
	]
	ButtonGroup = () => {
		return [
			{ label:'添加 F2', code:'F2', onClick:()=>{
                this.refs.modal.open()
			} },
			{ label:'取消', ghost:true, onClick:()=>{
				$fn.back(this)
			} },
		]
	}
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='关联权限库' ButtonGroup={this.ButtonGroup()}>
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
				<Modal ref = 'modal' title	= '添加' width = {1000} noFooter >
					<SubmitForm1
                        type    = { this.type }
                        id      = { this.id }
						onClose = { ()=>this.refs.modal.close() }
					/>
				</Modal>
			</Page>
		)
	}
}