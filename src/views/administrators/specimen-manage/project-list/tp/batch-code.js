// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== common
// import coms from '@/private/js/common.js'
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
        keys: 0
	}  
	componentDidMount(){ 
        this.props.onRef(this)  
    }   
	// fetch = param => $fn.fetch.call(this,'', param)
	cols = [ 
        { title: '条码号',		    field: 'spec_code',			width:120 },
        { title: '医院',		    field: 'hosp_name',			width:120 },
        { title: '姓名',		    field: 'patient_name',		width:120 },
        { title: '性别',		    field: 'sex_name',			width:120 },
        { title: '科室',		    field: 'department_name',	width:120 },
        { title: '操作',		    width:60,                   render: ({rows}) => {
            return String(rows.show_btn) === '1' ? <Button onClick={() => this.delRows(rows)}  ghost type='primary'>删除</Button> : ''
        }, align: 'tc'} 
    ] 
    delRows = (rows) => {  
        let d = this.state.data.filter(item => item.uuid !== rows.uuid);
        this.setState({data: d})
        this.props.changeBatchCode(d)
    }
    getPage = (data) => {
        console.log(data)
        this.setState({data: data, keys: this.state.keys + 1})
    }
	render(){
		const { data, pullLoading, keys } = this.state
		return (
			<Table
                key={keys}
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