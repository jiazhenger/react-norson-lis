// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== common
import coms from '@/private/js/common.js'
// ===================================================================== global declare
const { $fn, $async } = window 
// ===================================================================== antd
const Button = $async(()=>import('@antd/button')) 
// ===================================================================== private component 
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[], 
        selectedKeys:[],
        params: {}
	}
	audit_statusSelect = [
		{ name: "已作废", value: "-3" }
	]
	forms = []
	model = {}
	componentDidMount(){ 
        this.props.onRef(this)  
    }   
	fetch = param => $fn.fetch.call(this,'specimen-kind/index', param)
	cols = [
		{ title: '项目代码',		field: 'kind_code',			width:120 },
        { title: '项目名称',		field: 'kind_name',			width:320 }, 
        { title: '项目状态',		field: 'enabled',			width:120,  render: ({rows}) => {
            const select = [
                { label: "已审核", value: "1" },
                { label: "待审核", value: "0" },
                { label: "待保存", value: "-2" }
            ]
			return window.$fn.filterSelect(select, rows.enabled, 'label', 'value') 
        }}, 
        { title: '操作',		    field: 'enabled', 		    width:60,  render: ({rows}) => {
            return <Button onClick={() => this.delRows(rows)}  ghost type='primary'>删除</Button>
        }, align: 'tc'}
    ] 
    delRows = (param) => { 
        coms.interfaceConfirm('specimen-kind/end', '删除', param, () => {
            this.fetch(this.state.params)
            this.props.onchanged()
        })
    }
    changeList = (rows) => {
        const param = {spec_id: rows.uuid, spec_code: rows.spec_code}
        this.setState({params: param})
        this.fetch(param) 
    }
	render(){
		const { data, pullLoading } = this.state
		return (
			<Table
                className		= 'xplr'
                cols			= { this.cols }
                data 			= { data }
                loading 		= { pullLoading }
                onRow			= { v => this.setState({ selectedKeys: v }) }
                onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
            /> 
		)
	}
}