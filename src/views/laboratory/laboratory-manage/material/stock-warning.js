import React from 'react'
// ===================================================================== global declare
const { $fn, $async } = window
// ===================================================================== antd
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== 页面变量
const warntypeOption = [
    { name: "数量不足", value: "1" },
    { name: "即将过期", value: "2" }
  ]
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
        selectedKeys:[],
	}
	forms = [
		{ label: '物料名称',    name:'mate_name'},
		{ label: '物料编号',        name:'mate_number'},
		{ label: '物料分类',        name:'mate_type',       type:'select', data: []},
        { label: '警告类型',        name:'warn_type',       type:'select', data: []},
	]
    model = {}
	componentDidMount(){
        this.forms[3].data = warntypeOption
        // 物料分类
        $fn.getDisItem({
			code: 26000,
			callback: (data) => {
                this.forms[2].data = data
            }
        })
		this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'material/warning', param)
	// table
	cols = [
		{ title: '物料名称',        field: 'mate_name', 	        width: 130 },
		{ title: '物料编号',		field: 'mate_number',		    width: 100 },
		{ title: '物料类型', 		field: 'type',                  width: 80 },
		{ title: '剩余量',          field: 'unuse_qty',             width: 80 },
		{ title: '距离过期（天）',   field: 'expire_date_num',       width: 80 },
		{ title: '保质期',          field: 'shelf_life',            width: 100 },
    ]
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='库存警告列表'>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
                    onChange    = {(v, press, { name, data }) => $fn.onChange.call(this,v,press) }
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onAdd		= { this.onAdd } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
				/>
				{/* 表格 */}
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { v => this.setState({ selectedKeys: v }) }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
				/>
			</Page>
		)
	}
}