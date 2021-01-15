import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'

// ===================================================================== global declare
const { $http, $fn, $async } = window 
// ===================================================================== antd
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
	model = {
        bill_id: this.props.bill_id,
    }
	check = {}
	componentDidMount(){
        this.fetch(this.model)
    }
	componentWillReceiveProps(props) {}

	fetch = param => $http.paging(this,'bill/salesmanabnormallists',{ param:{...param, pageSize:this.pageSize, ...this.model}, loading:false } )

	cols = [
		{ title: '操作时间',    field: 'created_at',        width: 120 },
		{ title: '操作类型',    field: 'type_name',         width: 120 },
		{ title: '操作人',      field: 'real_name',         width: 120 },
        { title: '输入价格', 	field: 'price', 	        width: 80 },
		{ title: '修改前价格',  field: 'change_old_price', 	width: 80, },
        { title: '修改后价格', 	field: 'change_new_price', 	width: 80 },
		{ title: '备注',        field: 'remark', 	        width: 120 },
		{ title: '操作', 		field: 'custom', 	        width: 120, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='查看图片' ghost className='ml15' onClick={() => {
						this.refs.modal1.open()
						$http.submit(null,'bill/viewpic', { param: { uuid: rows.uuid } } ).then(data=>{
							this.check = data
						})
					}} />
				</div>
			)
		} }
	] 
	render(){
        const { data, pullLoading, pag, submit, selectedKeys } = this.state
		return (
			<div>
				<Modal ref='modal1' title='查看其他' width={648} noFooter>
					<div className='p20 r6px'>
						<div className='pb20 pt20'>
							<span className='dk pr10'>原因:</span>
							<input type='textarea' className=' bor1 h70 ' disabled style={{width: "84%"}} value={this.check.reason} />
						</div>
						<div className='pb20'>
							<span className='dk pr10'>图片:</span>
							<div className='dk bor1 h100 w tc' style={{width: "84%",lineHeight:"100px"}} >{this.check.img||'暂无图片'}</div>
						</div>
					</div>
				</Modal>
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