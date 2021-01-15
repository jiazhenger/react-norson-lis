import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// ===================================================================== private component
const Table = $async(()=>import('#cpt/table'))
const SearchForm = $async(()=>import('#cpt/search-form'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		data1: [],
		pag: {},
		selectedKeys:[],
	}
	forms = [
		{ label:'药物名称',	name:'drug_name'}
	]
	model = {}
	componentDidMount(){
		$http.submit(null, 'drug-group/infoDrug', { param: {uuid: this.props.uuid} }).then(data => {
			this.setState({data1: data})
		})
		if (this.props.type === 2) {
			this.fetch(this.model)
		}
	}
	filterArr (arr, uuid) {
		let d = arr.filter(i => i.uuid === uuid)
		let flag = d && d.length ? false : true
		return flag
	}
	getSelection(selectData) {
		let data = this.state.data1
		selectData.forEach(i => {
			if (this.filterArr(this.state.data1, i.uuid)) {
				let v1 = {...i, checked: false}
				data.push(v1)
			} 
		})
		return data
	}
	// paging
	fetch = param => $fn.fetch.call(this,'drug-sensitivity/index', param)
	// table
	cols = [
		{ type:'checkbox' },
		{ title: '抗菌药物名称', 	field: 'drug_name',		width: 120 },
		{ title: '英文名称',		field: 'name_en',		width: 80},
		{ title: '描述',			field: 'description',	width: 150},
	]
	cols1 = [
		{ title: '抗菌药物名称', 	field: 'drug_name',		width: 120 },
		{ title: '英文名称',		field: 'name_en',		width: 80},
		{ title: '描述',			field: 'description',	width: 150},
		{ title: '操作', align:'tc', width: 80, render:({rows})=>{
			return (
				<div className='plr5'>
					<Button className='mr10' label='删除' ghost onClick={e=>{
						const { data1 } = this.state
						const newData = data1.filter(i => i.uuid !== rows.uuid)
						this.setState({data1: newData})
					}}  />
				</div>
			)
		}},
	]
	render(){
		const { data, pullLoading, data1, pag } = this.state
		const { onClose, uuid, type } = this.props
		// type=1:查看，2:添加
		return (
			<>
				{
					type === 2 && 
					<SearchForm
						className	= 'pb10'
						data		= { this.forms } 
						onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
						onSubmit	= { $fn.onSubmit.bind(this) } 
						onAdd		= { this.onAdd } 
						onReset		= { $fn.onReset.bind(this,this.forms) }
						loading		= { pullLoading }
					/>
				}
				{
					type === 2 && 
					<Table
						className		= 'xplr'
						cols			= { this.cols }
						data 			= { data }
						loading 		= { pullLoading }
						onRow			= { v => {
							this.setState({ selectedKeys: v, data1: [...this.getSelection(v)] })
						} }
						pag				= { pag }
						onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
					/>
				}
				<div className='pb10 b'>已选药敏</div>
				<Table
					className		= ''
					cols			= { this.cols1 }
					data 			= { data1 }
					loading 		= { pullLoading }
				/>
				<div className='tc'>
					<Button label='取消' size='middle' className='mr15 dkm' onClick={onClose} />
					<Button label='确定' ghost size='middle' className='mr15 dkm' onClick={(v) => {
						const param = {
							group_id: uuid,
							uuid: data1.map(i => i.uuid)
						}
						$http.submit(null, 'drug-group/addDrug', { param }).then(data => {
							message.then(f => f.default.success('操作成功'))
							onClose()
						})
					}} />
				</div>
			</>
		)
	}
}