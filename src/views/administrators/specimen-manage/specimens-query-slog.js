// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react' 
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
const confirm = import('@antd/confirm')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table')) 
// ===================================================================== 缓存
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {}, 
	}  
	model = {}
	componentDidMount(){  
		this.props.onRef(this)
	}
	fetch = param => {
		$fn.fetch.call(this,'slog/index', {uuid: param.uuid, spec_code: param.spec_code}).then(data => {
			console.log(data)
		}) 
	}
	
	cols = [ 
		{ title: '描述', 		field: 'spec_code',		render: ({rows}) => {
			return (<div style={{width: '100%', whiteSpace: 'normal'}}>
				<div className='fx' style={{borderBottom: '1px solid #e8eaec'}}>
					<div>修改前：</div>
					<div className="ex">{rows.before_details}</div>
				</div>
				<div className="fx">
					<div>修改后：</div>
					<div className="ex">{rows.details}</div>
				</div>
			</div>)
		} },
		{ title: '操作信息', 	field: 'bed_no',	width:130, render: ({rows}) => {
			return (
				<div style={{width: '100%', whiteSpace: 'normal'}}>
                    <p>操作人：{rows.operator_name}</p>
                    <p>时间：{rows.created_time}</p>
                </div>
			)
		} } 
	] 
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Table 
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