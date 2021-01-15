// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== common
import coms from '@/private/js/common.js'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button')) 
const Select = $async(()=>import('@antd/form/select')) 
const message = import('@antd/message')
// ===================================================================== private component 
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[], 
        selectedKeys:[],
        params: {},
        spec_typeOption: [], 
        param: {}
	}
    audit_statusSelect = []
    enabledSelect = [
        { label: "已审核", value: "1" },
        { label: "待审核", value: "0" },
        { label: "待保存", value: "-2" }
    ] 
	model = {}
	componentDidMount(){ 
        this.props.onRef(this)  
		$fn.dataSave('dis-item-2000-data').then(local => {
			if($fn.hasArray(local)){ 
            this.setState({spec_typeOption: local})
			}else{
			  $http.submit(null,'dis-item/item', { param:{dis_code:2000}}).then(data=>{
                this.setState({spec_typeOption: data})
				$fn.dataSave('dis-item-2000-data', data)
			  }) 
			}
		}) 
    }   
	fetch = param => $fn.fetch.call(this,'specimen-kind/index', param)
	cols = [ 
		{ title: '项目代码',		field: 'kind_code',			width:120 },
		{ title: '项目名称',		field: 'kind_name',			width:200 },
		{ title: '项目属性',		field: 'kind_type_name',	width:120 },
		{ title: '项目类别',		field: 'category_name',	    width:120 },
		{ title: '子项目',		    field: 'child_kind_name',	width:240 },
		{ title: '岗位',		    field: 'project_name',		width:120 },
		{ title: '项目状态',		field: 'enabled',			width:120,      render: ({rows}) => {
            return window.$fn.filterSelect(this.enabledSelect, rows.enabled, 'label', 'value') 
        } },
        { title: '标本类型',		field: 'spec_type',			width:160,      render: ({rows, index}) => { 
            return <Select name='spec_type' data={this.state.spec_typeOption} p='请选择标本类型' nameStr='name' idStr='value' value={rows.spec_type}  onChanged={(v, data) => this.onChanges(v, data, rows, index)} width={150} />
        } },
        { title: '操作',		    field: 'enabled', 		    width:110,  render: ({rows}) => {
            return String(rows.enabled) === '1' ? '' : <Button onClick={() => this.delRows(rows)}  ghost type='primary'>删除</Button> 
        }, align: 'tc'} 
    ] 
	onChanges = (v, dt, rows, index) => {    
        console.log(v, dt, index)
		const { data } = this.state 
		data[index][Object.keys(v)[0]] = $fn.hasObject(dt) ? dt.value : ''
        this.setState({data: data})   
        if (Object.keys(v)[0] === 'spec_type') {
            const param = {
                spec_type: dt.value,
                uuid: rows.uuid
            } 
            $http.submit(null, 'specimen-kind/savespectype', { param }).then(data => {
                message.then(f => f.default.success('操作成功')) 
            })
        }  
	}
    delRows = (rows) => { 
        console.log(this.props)
        const { isBatch, speceDataList } = this.props
        const param = {
            kind_id: rows.uuid,
            spec_id: [rows.spec_id],
            to_spec_ids: isBatch ? speceDataList.map(i => i.uuid) : []
        }
        coms.interfaceConfirm('specimen-kind/del', '删除', param, () => {
            message.then(f => f.default.success('删除成功')) 
            this.getPage(this.state.param) 
            // let d = this.state.data.filter(item => item.uuid !== param.kind_id);
            // this.setState({data: d})
        }) 
    }
    getPage = (param) => { 
        this.setState({param: param})
        if (param) {
            this.fetch(param)  
        } else {
            this.setState({data: []})
        }
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