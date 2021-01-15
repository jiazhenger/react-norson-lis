import React from 'react'
// ===================================================================== antd
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
const confirm = import('@antd/confirm')
// ===================================================================== global template
const Text = $async(()=>import('@tp/text'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table'))
const compleOptions = [
    { name: "启用", value: "1" },
    { name: "禁用", value: "0" },
    { name: "删除", value: "-1" }
]
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
	}
	forms = [
		{ label: '模板编号',        name:'lab_number' },
		{ label: '模板名称',        name:'lab_name'}
	]
	componentDidMount(){
		this.fetch()
	}
	// paging
	fetch = param => $fn.fetch.call(this,'lis-lab-tag/index', param)
	// table
	cols = [
        { type:'checkbox' },
		{ title: '模板编号', 	    field: 'lab_number'},
		{ title: '模板名称',		field: 'lab_name' },
		{ title: '当前实验号', 		field: 'last_code'},
		{ title: '结束时间', 	    field: 'cycle_end', align:'tc' },
		{ title: '状态',	        field: 'enabled', render: ({rows}) => {
            const d = compleOptions.filter(i => i.value === rows.enabled)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        } },
		{ title: '描述',            field: 'description' },
		{ title: '操作', align:'tc', width:150, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='编辑' className='ml15' ghost onClick={e=>{
                        $fn.push(this, $fn.getRoot().root + 'laboratory-manage/expno-template/add?id=' + rows.uuid)
					}}  />
				</div>
			)
		}},
	]
	ButtonGroup = () => {
        const keys = this.state.selectedKeys.map(v=>v.uuid)
		return [
            { label:'设置规则 F2', code:'F2', onClick:()=>{
				$fn.push(this, $fn.getRoot().root + 'laboratory-manage/expno-template/add')
            } },
            { label:'启用', disabled:this.state.selectedKeys.length===0, onClick:()=>{
                $http.submit(null,'lis-lab-tag/on',{ param:{uuid: keys, enabled: '1'} }).then(data=>{
                    message.then(f=>f.default.success('启用成功'))
                    this.fetch(this.model)
                })
            } },
            { label:'禁用', disabled:this.state.selectedKeys.length===0, onClick:()=>{
                $http.submit(null,'lis-lab-tag/off',{ param:{uuid: keys, enabled: '-1'} }).then(data=>{
                    message.then(f=>f.default.success('禁用成功'))
                    this.fetch(this.model)
                })
			} },
            { label:'删除', disabled:this.state.selectedKeys.length===0, onClick:()=>{
				confirm.then(f=>{
					f.default({
						msg:'是否确认删除?',
						onOk: close => {
							$http.submit(null,'lis-lab-tag/delete',{ param:{uuid: keys} }).then(data=>{
								message.then(f=>f.default.success('删除成功'))
								this.fetch(this.model)
								this.setState({selectedKeys: []})
								close()
							})
						}
					})
				})
			} }
		]
	}
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='实验号模板' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
                    onChange    = { (v,press)=>$fn.onChange.call(this,v,press) } 
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