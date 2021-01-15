import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'

// ===================================================================== global declare
const { $http, $fn, $async } = window 
// ===================================================================== antd
const Page = $async(()=>import('#tp/page-container'))
const Button = $async(()=>import('@antd/button'))
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
    code = $fn.query('code')
	model = {
        code: this.code,
    }
	check = {}
	componentDidMount(){
        this.fetch()
    }

	fetch = param => $http.paging(this,'bs-contract/getContactRenew',{ param:{...param, pageSize:this.pageSize, ...this.model}, loading:false } )

	cols = [
		{ title: '合同编号',    field: 'code',              width: 100 },
		{ title: '合同名称',    field: 'name',              width: 120 },
		{ title: '客户名称',    field: 'hosp_name',         width: 120 },
        { title: '生效时间', 	field: 'sign_at', 	        width: 120 },
		{ title: '到期时间',    field: 'contract_validity', width: 120, },
        { title: '折扣率', 	    field: 'discount_rate', 	width: 80 },
		{ title: '操作人',      field: 'real_name', 	    width: 120 },
    ] 
    ButtonGroup = () => {
		return [
			{ label:'返回', ghost:true, onClick:()=>{
				$fn.back(this)
            } },
        ]
	}
	render(){
        const { data, pullLoading, pag, selectedKeys } = this.state
		return (
            <Page title='合同签订记录' ButtonGroup={this.ButtonGroup()}>
				<Table
					className		= 'xplr mt10'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { v => { this.setState({ selectedKeys: v }) } }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
				/>
			</Page>
		)
	}
}