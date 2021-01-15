// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
const Input = $async(()=>import('@antd/form/input'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		selectedKeys:[],
		sf_code: '',
		sf_data: {
			sf_number: '',
			project_name: '',
			total_capacity: ''
		},
		infoLoading: false,
		pullLoading: false, 
		key: 0
	} 
	sf_list = [
		{name: '标本架编号', field: 'sf_number'},
		{name: '科室', field: 'project_name'},
		{name: '容量', field: 'total_capacity'},
	]
	model = {}
	componentDidMount(){ 
	} 
	// 标本架代码
	onChange (v) {
		this.setState({sf_code: v})
	}
	// 标本架代码详情
	querySpecPlane = () => { 
		const pra = { sf_code: this.state.sf_code }
		$http.submit(this,'shelf/use',{ param: pra, submitLoading:'infoLoading'}).then(data => {
			this.setState({sf_data: data}) 
			this.changeTableData(this.state.data, data.project_id)
			message.then(f => f.default.success('操作成功')) 
		})
	}
	// 条码录入
	onChangeSpec (v) {  
		this.setState({spec_enter_value: v})
	} 
    setArr = (data, uuid) => {
      let d = data.filter(i => i === uuid);
      if (d && d.length) {
        return true;
      } else {
        return false;
      }
    }
	// 校验
	fetch = () => {
		const pra = {
			spec_codes: JSON.stringify(this.state.spec_enter_value) 
		}  
		$http.submit(this,'shelf/validshelfbatch',{ param: pra, submitLoading:'pullLoading'}).then(data => {
			let v = this.state.data; 
			let arr = this.state.data.map(i => i.uuid);
			data.forEach(i => {
				if (!this.setArr(arr, i.uuid)) {
					arr.push(i.uuid);
					v.push(i);
				}
			});  
			this.changeTableData(v, this.state.sf_data.project_id)
		})
	}  
	// 判断上架状态
	changeTableData = (arr, project_id) => { 
		console.log('判断上架状态')
		arr.forEach((i, j) => {
		  i._id = j + 1 // 行号
		  if (String(i.audit_status) !== '1' || String(i.is_receive) !== '1') { // 不能上架的格式
			i._status = '3' 
		  } else if (String(i.spec_status) === '1') { // 已上架
			i._status = '2'  
		  } else if (project_id && project_id === i.job_id){ // 科室是否相同
			i._status = '1'  
		  } else { // 其他科室
			i._status = '0'
		  }
		})  
		console.log(arr)
		this.setState({data: arr, key: this.state.key + 1}) 
	}
	// 上架完成
	onCompletion = () => { 
		let params = this.state.data.filter(i => i._status === '1')  
		let params1 = params.map(obj => {
			let d = {} 
			for (let i in obj) {
				if (i === '_status' || i === 'is_checked' || i === '_id') { 
				} else {
					d[i] = obj[i]
				}
			} 
			return d
		  })
		console.log(params1)
		if (this.state.sf_data.sf_number && $fn.hasArray(params1)) {
			$http.submit(this,'shelf/upshelfbatch',{ param: {data: params1, sf_number: this.state.sf_data.sf_number}, submitLoading:'pullLoading'}).then(data => {
				const d = this.state.data.filter(i => i._status !== '1')
				this.setState({data: d, selectedKeys: []})
			})
		} else if (!this.state.sf_data.sf_number) {
			message.then(f => f.default.error('标本架编号不能为空'))
		} else if (!$fn.hasArray(params1)) {
			message.then(f => f.default.error('未找到与标本架匹配的条码'))
		}
	}
	// 清空2 删除1
	deletes = (val) => { 
		const {data, selectedKeys} = this.state
		if (val === 1) { 
			let v = [] 
			data.forEach(i => {
			  const len = selectedKeys.filter(j => i.uuid === j.uuid)
			  if (len && len.length) { 
			  } else { 
				v.push(i)
			  }
			}) 
			v.forEach((v1, i) => {
				v1._id = i + 1
			}); 
			this.setState({data: v, selectedKeys: []})
		} else {
			this.setState({data: [], selectedKeys: []})
		}
	}
	cols = [
		{ type:'checkbox' },
		{ title: '行号',		field: '_id',				width:60 },  
		{ title: '条码号',		field: 'spec_code',			width:120 },  
		{ title: '科室',		field: 'job_name',			width:120 },  
		{ title: '岗位',		field: 'project_name',		width:120 },  
		{ title: '状态',		field: '_status',		width:70, render: ({rows}) => {
			const d = [
				{name: '已上架',   value: '2'},
				{name: '不可上架', value: '3'},
				{name: '可以上架', value: '1'},
				{name: '其他科室', value: '0'},
			]
			return $fn.filterSelect(d, rows._status, 'name', 'value')
		} }
	] 
	render(){
		const { data, pullLoading, sf_code, sf_data, infoLoading, spec_enter_value, selectedKeys, key } = this.state
		return (
			<Page title='标本批量上架'> 
				<div className='fxm p10'>
					标本架代码：<Input p='请输入标本架代码' width='160px' onChange={v => this.onChange(v)} onPressEnter={v => this.querySpecPlane(v)} value={sf_code} />
					<Button label='查询' disabled={!sf_code || infoLoading} className='ml10' ghost onClick={() => this.querySpecPlane()} /> 
					<div className='ml20'> 
						{this.sf_list.map((v, i) => {
							return (
								<React.Fragment key={i}> 
									<span className="tit">{v.name}：</span>
									<span className="f13 b">{sf_data[v.field]}</span>
									{this.sf_list.length > (i+1) && <span className="f13 b mlr15">|</span>}
								</React.Fragment>
							)
						})}
					</div>
				</div>
				<div className='ex plr10 fx'>
					<div className='ex mr15 r4px fv'>
						<div className='plr5 mb5' style={{height: '28px', lineHeight: '28px', background: 'rgba(242,242,242,1)'}}>条码录入</div> 
						<div className='ex x_ssb_t1' style={{border: '1px solid #E8EAEC'}}>
							<Input p='请输入条码' mode='textarea' onChange={v => this.onChangeSpec(v)} value={spec_enter_value} />
						</div>
						<div className='tc p10' style={{border: '1px solid #E8EAEC', borderTop: 'none'}}>
							<Button label='校验' onClick={() => this.fetch()} /> 
						</div>
					</div>
					<div className='ex r4px fv'>
						<div className='fxm plr5 mb5' style={{height: '28px', background: 'rgba(242,242,242,1)'}}>
							<span className='ex'>条码列表</span>
							<div>
								<Button className='mr10' label='删除' ghost disabled={!$fn.hasArray(selectedKeys)} onClick={() => this.deletes(1)} /> 
								<Button label='清空' ghost disabled={!$fn.hasArray(data)} onClick={() => this.deletes(2)} /> 
							</div>
						</div> 
						{/* <div className='ex' style={{border: '1px solid #E8EAEC'}}> */}
						<Table
							key             = { key }
							style           = {{border: '1px solid #E8EAEC',borderTop: 'none'}}
							cols			= { this.cols }
							data 			= { data }
							loading 		= { pullLoading }
							onRow			= { v => this.setState({ selectedKeys: v }) }
							onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
						/>
						{/* </div> */}
						<div className='tc p10' style={{border: '1px solid #E8EAEC', borderTop: 'none'}}>
							<Button label='上架完成' onClick={() => this.onCompletion()} /> 
						</div>
					</div>
				</div>  
			</Page>
		)
	}
}