import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// ===================================================================== private component
const Table = $async(()=>import('#cpt/table'))
const SearchForm = $async(()=>import('#cpt/search-form'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
	}
	forms = [
		{ label:'关键字',	name:'keyword'},
		{ label:'权限代码',	name:'perm_code'},
		{ label:'权限类型',	name:'perm_type', type: 'select', data: []},
	]
    model = {}
	componentDidMount(){
        // 权限类型
		$fn.getDisItem({
            code: 900,
            callback: data=>{
                this.forms[2].data = data
            }
        })
        const { type, id } = this.props
        if (type === 'process') { // 流程授权列表
            this.btnType = 'process_id'
            this.model = {filter: 'process', process_id: id}
        } else if (type === 'group') { // 分组
            this.btnType = 'group'
            this.model = {filter: 'groups', group_id: id}
        } else if (type === 'position') { // 职位
            this.btnType = 'position'
            this.model = {filter: 'position', pos_id: id}
        } else if (type === 'role') { // 角色
            this.btnType = 'role'
            this.model = {filter: 'role', role_id: id}
        } else if (type === 'employee') { // 员工
            this.btnType = 'employee'
            this.model = {filter: 'employee', empl_id: id}
        }
        this.fetch(this.model)
    }
    addFn(api, param, onClose) {
        $http.submit(null, api, { param }).then(data => {
            message.then(f => f.default.success('操作成功'))
            this.fetch(this.model)
            onClose && onClose()
        })
    }
	// paging
	fetch = param => $fn.fetch.call(this, 'permission/index', param)
	// table
	cols = [
		{ type:'checkbox' },
		{ title: '权限代码', 	field: 'perm_code',		width: 150, tdCss: 'wpn' },
		{ title: '权限名称',		field: 'perm_name',		width: 150, tdCss: 'wpn'},
		{ title: '权限级别',			field: 'level',	width: 60},
		{ title: '权限类型',			field: 'type',	width: 60},
    ]
    cols1 = [
		{ type:'checkbox' },
		{ title: '权限代码', 	field: 'perm_code',		width: 150, tdCss: 'wpn' },
		{ title: '权限名称',		field: 'perm_name',		width: 150, tdCss: 'wpn'},
		{ title: '权限说明',			field: 'perm_desc',	width: 150, tdCss: 'wpn'},
	]
	render(){
		const { data, pullLoading, pag, selectedKeys } = this.state
		const { onClose, id, type } = this.props
		return (
			<>
                <SearchForm
                    className	= 'pb10'
                    data		= { this.forms } 
                    onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
                    onSubmit	= { $fn.onSubmit.bind(this) } 
                    onAdd		= { this.onAdd } 
                    onReset		= { $fn.onReset.bind(this,this.forms) }
                    loading		= { pullLoading }
                />
                {
                    type === 'process' && <Table
                        className		= 'xplr'
                        cols			= { this.cols1 }
                        data 			= { data }
                        loading 		= { pullLoading }
                        onRow			= { v => { this.setState({ selectedKeys: v }) } }
                        pag				= { pag }
                        onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
                    />
                }
                {
                     type !== 'process' && <Table
                        className		= 'xplr'
                        cols			= { this.cols }
                        data 			= { data }
                        loading 		= { pullLoading }
                        onRow			= { v => { this.setState({ selectedKeys: v }) } }
                        pag				= { pag }
                        onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
                    />
                }
				<div className='tc'>
					<Button label='取消' size='middle' className='mr15 dkm' onClick={onClose} />
					<Button label='确定' ghost size='middle' className='mr15 dkm' onClick={(v) => {
						const param = {
                            perm_id: selectedKeys.map(i => i.uuid)
                        }
                        param[this.btnType] = id
                        if (type === 'process') { // 流程授权列表
                            this.addFn('fl-process-auth/addpermission', param, onClose)
                        } else if (type === 'group') { // 分组
                            this.addFn('groups/addPermission', param, onClose)
                        } else if (type === 'position') { // 职位
                            this.addFn('position/addPermission', param, onClose)
                        } else if (type === 'role') { // 角色
                            this.addFn('role/addPermission', param, onClose)
                        } else if (type === 'employee') { // 员工
                            this.addFn('employee/addpermission', param, onClose)
                        }
						
					}} />
				</div>
			</>
		)
	}
}