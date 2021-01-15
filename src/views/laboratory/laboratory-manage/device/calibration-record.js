import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== global template
const Text = $async(()=>import('@tp/text'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== 页面变量
// 状态
const statusOptions = [
    { name: "合格",    value: '1' },
    { name: "待校准",  value: '0' },
    { name: "停用",    value: '-1' }
]
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
        deviceStadius:[],
        
    }
    
    forms = [
        { label:'设备名称',     name:'device_id',	type:'select',  data: [], nameStr: 'title'},
        { label:'执行人',       name:'ex_user'},
        { label: '状态',        name:'status',	    type:'select',  data:[]},
    ]
	// 请求参数
	model = {device_id: $fn.query('id') || ''}
	componentDidMount(){
		// 设备名称
		$fn.dataSave('device').then(local => {
			if ($fn.hasArray(local)) {
				this.forms[0].data = local
				this.setState({deviceStadius:local, submit:this.state.submit})
			} else {
				$http.pull(null, 'device/select', { dataName: null }).then(data => {
					data.forEach(v => {
						v.title = `${v.device_name}(${v.device_number}) - ${v.device_model}`
					})
					this.forms[0].data = data
					this.setState({deviceStadius:data, submit:this.state.submit})
					$fn.dataSave('device', data)
				})
			}
		})
        this.forms[2].data = statusOptions
		this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'de-plan-log/index', param)
	// table
	cols = [
		{ title: '设备名称',		field: 'device_name',		width: 200 },
		{ title: '结果', 		    field: 'content',		    width: 100 },
		{ title: '执行人', 	        field: 'ex_user',			width: 100 },
		{ title: '状态', 	        field: 'status',			width: 80, render: ({rows}) => {
            let d = statusOptions.filter(i => i.value === rows.status)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        } },
		{ title: '任务生成时间', 	field: 'created_at',	    width: 150,		align: 'tc' },
		{ title: '实际校准时间', 	field: 'operator_at', 		width: 150,		align: 'tc' },
	]
	ButtonGroup = () => {
		return []
	}
	render(){
		const { data, pullLoading, pag, submit } = this.state
		return (
			<Page title='校准记录' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onAdd		= { this.onAdd } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
                    loading		= { pullLoading }
                    init        = { form => form.setFieldsValue({device_id: this.model.device_id}) }
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