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
		imgPath: '',
	}
    forms = []
    code = $fn.query('code')
	model = {
        code: this.code,
    }
	check = {}
	componentDidMount(){
		console.log(this.props);
        this.model.bill_id=this.props.bill_id
        this.fetch(this.model)
    }
	fetch = param => $http.paging(this,'bill/salesmanabnormallists',{ param } )
	cols = [
		{ title: '操作时间',    field: 'created_at',       width: 100 },
		{ title: '操作类型',    field: 'type_name',        width: 120 },
		{ title: '操作人',      field: 'real_name',        width: 120 },
        { title: '输入价格', 	field: 'price', 	       width: 120 },
		{ title: '修改前价格',  field: 'change_old_price', width: 120, },
        { title: '修改后价格', 	field: 'change_new_price', width: 80 },
		{ title: '备注',        field: 'remark', 	       width: 120 },
		{ title: '操作',       	width: 120,                render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label={rows.pic_path?'查看图片':'暂无图片'} disabled={rows.pic_path?'false':'true'} ghost onClick={()=>{
						console.log(rows);
						if (rows.pic_path !== '') {
							const imgUrl  = JSON.parse(window.sessionStorage.getItem('user')).img_domain
							this.setState({imgPath: imgUrl + rows.pic_path})
						}
					}}/>
				</div>
			)
		} },
    ] 
    ButtonGroup = () => {
		return []
	}
	render(){
        const { data, pullLoading, pag, imgPath } = this.state
		return (
            <div>
				<Table
					className		= 'xplr mt10'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { v => { this.setState({ selectedKeys: v }) } }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
				/>
				<div>
                    <img className='w' src={imgPath} />
                </div>
            </div>
		)
	}
}