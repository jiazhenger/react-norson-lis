import React from 'react'
// ===================================================================== antd
// ===================================================================== global declare
const { $http, $fn, $async } = window 
// ===================================================================== private component
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
	}
	forms = []
	model = {
        spec_code: "",
        show_del: 1
    }
    check = {}
    options= [
        { label: "正常", value: "1" },
        { label: "冲抵", value: "2" }
    ]
	componentDidMount(){
        if (this.props.specCode) {
            this.model.spec_code = this.props.specCode
            this.fetch(this.model)
        }
    }
	componentWillReceiveProps(props) {}

	fetch = param => $http.paging(this,'bill/speclists',{ param } )

	cols = [
		{ title: '条码号',      field: 'old_spec_code',   width: 120 },
		{ title: '账期',        field: 'phase_str',        width: 120 },
		{ title: '账单生成时间',field: 'created_at',       width: 160 },
        { title: '账单状态', 	field: 'status_name', 	   width: 120 },
		{ title: '账单类型',    field: 'pay_type', 	       width: 80, render:({rows})=> {
            return window.$fn.filterSelect(this.options, rows.pay_type, 'label', 'value')
        } },
        { title: '备注', 	    field: 'attribute_name', 	width: 80 },
		{ title: '医院名称',    field: 'hosp_name',         width: 160 },
		{ title: '业务员名称',  field: 'salesman_user',     width: 100 },
		{ title: '接收标本日期',field: 'sp_check_time',     width: 160 },
		{ title: '自然项目',    field: 'parent_kind_name',  width: 160 },
		{ title: '项目名称',    field: 'kind_name',         width: 160 },
        { title: '标准价格', 	field: 'sprice', 	        width: 80 },
		{ title: '实际价格',    field: 'price', 	        width: 80, },
        { title: '折扣率', 	    field: 'percent', 	        width: 80 },
		{ title: '折扣金额',    field: 'perprice', 	        width: 100 },
	] 
	render(){
        const { data, pullLoading, pag, selectedKeys } = this.state
		return (
			<div>
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { v => { this.setState({ selectedKeys: v }) } }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
				/>
			</div>
		)
	}
}