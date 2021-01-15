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
        imgPath:'',
	}
    forms = []
	model = {}
	componentDidMount(){
        this.model.contract_id=this.props.uuid
        this.fetch(this.model)
    }
	fetch = param => $http.paging(this,'bs-file/index',{ param } )
	cols = [
		{ title: '上传时间',field: 'update_at',     width: '180'},
        { title: '上传人', 	field: 'upload_user', 	width: '180'},
		{ title: '操作',    render:({rows})=>{
            const suffix = rows.file_name.substr(
                rows.file_name.lastIndexOf(".") + 1
            ); // 文件后缀名
            if (suffix === "png" || suffix === "jpg" || suffix === "pdf") {
                return <div className='plr5'>
					<Button className='mr5' label='查看' ghost onClick={()=>{
                        this.setState({imgPath: rows.file_name})
                    }}/>
                </div>
            } else {
                return <div className='plr5'>
					<Button className='mr5' label='下载' ghost onClick={()=>{
						window.location.href = rows.file_name;
                    }}/>
                </div>
            }
        } },
	] 
    ButtonGroup = () => {
		return []
	}
	render(){
        const { data, pullLoading, pag, selectedKeys, imgPath } = this.state
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