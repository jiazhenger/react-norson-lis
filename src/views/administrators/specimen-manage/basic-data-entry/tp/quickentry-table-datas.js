// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== global declare
const { $fn, $async } = window
// ===================================================================== private component
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
        selectedKeys:[],
        sexOptions: []
	} 
	model = {}
	componentDidMount(){  
        this.props.onRef(this)   
        $fn.getDisItem({ // 性别
            code: 45700,
            callback: (data) => { 
                this.setState({sexOptions: data})
            }
        })
		this.fetch()
	} 
	fetch = param => $fn.fetch.call(this,'specimen/fastEntryCaseInfo', param) 
	cols = [ 
		{ title: '条码号',		field: 'spec_code',     width:120 },
		{ title: '姓名',		field: 'patient_name',	width:150 }, 
		{ title: '性别',		field: 'sex',		    width:150, render: ({rows}) => {
            return $fn.filterSelect(this.state.sexOptions, rows.sex, 'name', 'value')
        } }, 
		{ title: '送检医院',	field: 'hosp_name',		width:150 }, 
	]
	ButtonGroup = () => {
		return []
	}
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Table
                className		= 'h'
                cols			= { this.cols }
                data 			= { data }
                loading 		= { pullLoading }
                onRow			= { v => this.setState({ selectedKeys: v }) }
                pag				= { pag }
                onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
            /> 
		)
	}
}