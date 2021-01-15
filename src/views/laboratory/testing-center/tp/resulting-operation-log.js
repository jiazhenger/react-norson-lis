import React from 'react' 
// ===================================================================== global declare
const { $fn, $async } = window 
// ===================================================================== private template
const Table = $async(()=>import('#cpt/table')) 
// ===================================================================== component 
export default class extends React.Component{
	state = {
		data: [],
		pullLoading: false,
		selectedKeys: [],
		rows: {},  
		uuid: ''
    } 
    cols = [
        { title: '标本条码', 			field: 'spec_code', 		            width:120 },
        { title: '建议与解释', 			field: 'result_suggestion_content', 	width:150 },
        { title: '结果', 			    field: 'result', 		                width:120 },
        { title: '报告结果', 			field: 'result1', 		                width:80 },
        { title: '稀释倍数', 			field: 'dilution_multiple', 		    width:80 },
        { title: '单位', 			    field: 'unit_val_name', 		        width:80 },
        { title: '标本类型', 			field: 'spec_type_name', 		        width:80 },
        { title: '项目名称', 			field: 'kind_name', 		            width:150 },
        { title: '操作人', 			    field: 'operator_name', 		        width:80 },
        { title: '操作时间', 			field: 'operator_at', 		            width:150 },
    ]
	componentDidMount(){  
		this.props.onRef && this.props.onRef(this)   
    }  
    changeFetch = (uuid) => {
        this.setState({uuid: uuid}, () => this.fetch()) 
    }
	fetch = param => $fn.fetch.call(this,'ts-report-card/resultlog', {...param, uuid: this.state.uuid})
	render () {
		const { data, pullLoading, pag } = this.state 
		return (
			<Table
                className		= 'xplr'
                cols			= { this.cols }
                data 			= { data }
                loading 		= { pullLoading }
                onRow			= { (select, rows) => { 
                    this.setState({ selectedKeys: select })
                }}
                pag				= { pag }
                onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
                onSort			= { v => $fn.onSort.call(this, v) }
            /> 
		)
	} 
}