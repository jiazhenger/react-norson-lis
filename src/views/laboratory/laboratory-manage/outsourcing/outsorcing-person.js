import React from 'react'
// ===================================================================== global declare
import Modal from '@antd/modal'
const { $http, $fn, $async } = window
const Button = $async(()=>import('@antd/button'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table'))
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== component
const AddAssociate = $async(()=>import('./tp/add-associate'))
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		type: '',
		rows: {},
		forms: [
			{ label:'科室',		name:'project_pid',		type: 'select',		data: [] },
			{ label:'物流人员',	name:'empl_id',			type: 'select',		data: [] },
		]
	}
	
	model = {}
	componentDidMount(){
		this.props.onRef(this)
		const { forms } = this.state
		cacheApi.then(f => {
            const d = f.default
            // 科室
			$fn.getCache({
				cache: d.ProjectTeamSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        forms[0].data = data
						this.setState({forms})
                    } else {
                        $http.submit(null, 'project-team/select').then(data => {
                            forms[0].data = data
							this.setState({forms})
                            $fn.setCache()
                        })
                    }
				}
			})
			// 物流人员
			$fn.getCache({
				cache: d.employeeSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        forms[1].data = data
						this.setState({forms})
                    } else {
                        $http.submit(null, 'employee/select').then(data => {
                            forms[1].data = data
							this.setState({forms})
                            $fn.setCache()
                        })
                    }
				}
            })
        })
		this.fetchFn()
	}
	fetchFn() {
		this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'specimen/outsourcingEmployeeList', param)
	// table
	cols = [
		{ type:'checkbox' },
		{ title: '科室', 		field: 'project_name' },
		{ title: '物流人员', 	field: 'real_name' },
		{ title: '操作', align:'tc', width:380, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='编辑' ghost onClick={()=>{
						this.refs.modal.open()
						this.setState({ type: 'edit', rows: rows })
					}}/>
				</div>
			)
		}},
	]
	render(){
		const { data, pullLoading, pag, rows, type, forms } = this.state
		return (
			<>
				{/* 搜索 */}
				<SearchForm
					data		= { forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onAdd		= { this.onAdd } 
					onReset		= { $fn.onReset.bind(this,forms) }
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
				{/* 关联外包物流人员 */}
				<Modal ref='modal' title={'关联外包物流人员'} width={500} noFooter>
					<AddAssociate
						type	= { type }
						rows	= { rows }
						onClose	= { ()=>this.refs.modal.close() }
						fetch	= { ()=>{this.fetchFn()} }
					/>
                </Modal>
			</>
		)
	}
}