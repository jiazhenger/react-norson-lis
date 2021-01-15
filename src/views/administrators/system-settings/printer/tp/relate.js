import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// ===================================================================== private component
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		selectedKeys:[],
	}
    model = {}
	componentDidMount(){
        this.model = { uuid: this.props.uuid }
        this.fetch(this.model).then(data => {
            const arr = []
            $fn.hasArray(data) && data.forEach(item=>{
                if (item.assoc === '1') {
                    item.rowChecked = true
                }
            })
        })
    }
	// paging
	fetch = param => $fn.fetch.call(this, 'printer/assocTmpl', param)
	// table
	cols = [
		{ type:'checkbox' },
		{ title: '模板代码', 	field: 'name' },
		{ title: '模板名称',		field: 'remark'},
    ]
	render(){
		const { data, pullLoading, selectedKeys } = this.state
		const { onClose, uuid } = this.props
		return (
			<>
                <Table
                    className		= 'xplr'
                    cols			= { this.cols }
                    data 			= { data }
                    loading 		= { pullLoading }
                    onRow			= { v => { this.setState({ selectedKeys: v }) } }
                    onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
                />
				<div className='tc mt10'>
					<Button label='取消' size='middle' className='mr15 dkm' onClick={onClose} />
					<Button label='确定' ghost size='middle' className='mr15 dkm' onClick={(v) => {
						const param = {
                            uuid,
                            tmpl_codes: selectedKeys.map(i => i.value)
                        }
                        $http.submit(null, 'printer/assocTmpl', { param }).then(data => {
                            message.then(f => f.default.success('操作成功'))
                            this.fetch(this.model)
                            onClose && onClose()
                        })
					}} />
				</div>
			</>
		)
	}
}