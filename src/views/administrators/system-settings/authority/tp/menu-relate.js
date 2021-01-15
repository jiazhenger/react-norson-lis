import React from 'react'
// ===================================================================== common
import coms from '@/private/js/common.js'
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
		data1: [],
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
		this.getTable2()
        this.fetch(this.model)
    }
    getTable2() {
        $http.submit(null, 'permission/bindmenulists', { param: {menu_id: this.props.uuid} }).then(data => {
			this.setState({data1: data})
		})
    }
	// paging
	fetch = param => $fn.fetch.call(this,'permission/index', param)
	// table
	cols = [
		{ type: 'checkbox' },
		{ title: '权限代码', 	field: 'perm_code',		width: 120, tdCss: 'wpn' },
		{ title: '权限名称',	field: 'perm_name',		width: 120, tdCss: 'wpn' },
		{ title: '权限类型',	field: 'type',          width: 80},
	]
	cols1 = [
		{ title: '权限代码', 	field: 'perm_code',		width: 120, tdCss: 'wpn' },
		{ title: '权限名称',	field: 'perm_name',		width: 120, tdCss: 'wpn' },
		{ title: '权限类型',	field: 'type',	        width: 80},
		{ title: '操作', align:'tc', width: 80, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button className='mr10' label='解绑' ghost onClick={e=>{
						const param = {uuid: rows.uuid} 
						coms.interfaceConfirm('permission/unbindmenu', '解绑', param, () => {
                            this.fetch(this.model)
							this.getTable2()
						})
					}}  />
				</div>
			)
		}},
	]
	render(){
		const { data, pullLoading, data1, pag, selectedKeys } = this.state
		const { onClose, uuid } = this.props
		// type=1:查看，2:添加
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
                <Table
                    className		= 'xplr'
                    cols			= { this.cols }
                    data 			= { data }
                    loading 		= { pullLoading }
                    onRow			= { v => {
                        this.setState({ selectedKeys: v })
                    } }
                    pag				= { pag }
                    onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
                />
				<div className='pb10 b'>已有权限</div>
				<Table
					className		= ''
					cols			= { this.cols1 }
					data 			= { data1 }
					loading 		= { pullLoading }
				/>
				<div className='tc'>
					<Button label='取消' size='middle' className='mr15 dkm' onClick={onClose} />
					<Button label='确定' ghost disabled={!selectedKeys.length} size='middle' className='mr15 dkm' onClick={(v) => {
						const param = {
							menu_id: uuid,
							per_ids: selectedKeys.map(i => i.uuid)
						}
						$http.submit(null, 'permission/bindmenu', { param }).then(data => {
							message.then(f => f.default.success('操作成功'))
							onClose()
						})
					}} />
				</div>
			</>
		)
	}
}