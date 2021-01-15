import React from 'react'
// ===================================================================== component
import SpecAbnormal from './spec-abnormal'; // 标本异常
import ReferenceRange from './reference-range'; // 参考范围
// ===================================================================== common
import ts from '@views/laboratory/testing-center/tp/common.js'
// ===================================================================== global declare
const { $http, $fn, $async } = window 
// ===================================================================== private template
const Box = $async(()=>import('#tp/box/box'))
const Table = $async(()=>import('#cpt/table')) 
// ===================================================================== component 
export default class extends React.Component{
	state = {
		data: [],
		pullLoading: false,
		selectedKeys: [],
		rows: {}, 
		model: {
			result_model: '',
			project_id: '',
			status: '45001',
			id: '',
		}, 
		referenceRangeFlag: false,
		infos: {}, // 详情
		
	} 
	componentDidMount(){  
		this.props.onRef && this.props.onRef(this)  
		const { model } = this.state
		model.result_model = ts.getPath().id
		model.project_id = ts.getPath().project_id
		model.id = ts.getPath().id
		this.setState({model}, () => this.fetch())
	}
	fetch = param => $fn.fetch.call(this,'ts-report-card/index', {...this.state.model, ...param})
	changeFetch = ({param, pag}) => {  
		this.setState({model: {...this.state.model, ...param}}, () => {
			this.fetch({...param, page: pag ? this.state.pag.current : 1})
		})
	} 
	// 参考范围
	changeReferenceRange = (rows) => {
		const {referenceRangeFlag } = this.state
		this.setState({referenceRangeFlag: !referenceRangeFlag })
	}
	// 详情
	getInfo = (rows) => {
		if (rows) {
			const param = {
				uuid: rows.uuid,
				result_model: ts.getPath().id,
				status: this.state.model.status
			}
			window.$http.submit(null,'ts-report-card/info', { param: param, loading:false, dataName: 'infos'}).then(data=>{
				this.setState({infos: data}) 
				this.props.getInfo(data)
			}).catch(res => {
				this.setState({infos: rows}) 
				this.props.getInfo(rows)
			})
		} else {
			this.props.getInfo()
		}
		
	} 
	render () {
		const { data, pullLoading, pag, selectedKeys, rows } = this.state
		const { cols } = this.props
		return (
			<Box 
				className	= 'ex fv' 
				title		= '项目列表'
				style       = {{paddingBottom: '10px'}}
				titleChildren = {
					<div className='fx b'>
						<div><span>资料待审核</span></div>
						<div className='ml15'><span>已转外包</span></div>
						<div className='mlr15'><span>敏感词</span></div>
						<div><span>阳性</span></div>
					</div>
				}
				onSetHeader = {()=>{}}
			>
				<div className='h10'></div>
				<div className='ex fv'> 
					<Table
						className		= 'xplr'
						cols			= { cols }
						data 			= { data }
						loading 		= { pullLoading }
						onRow			= { (select, rows) => { 
							if ($fn.hasObject(rows)) {
								if (rows.forms.result.type !== 'number') {
									this.setState({ selectedKeys: select, rows: rows, referenceRangeFlag: false })
								} else {
									this.setState({ selectedKeys: select, rows: rows})
								}
								this.getInfo(rows)
								this.props.getSelectedKeys(select)
							} else {
								this.setState({ selectedKeys: select, rows: {}, referenceRangeFlag: false })
							}
						}}
						pag				= { pag }
						onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
						onSort			= { v => $fn.onSort.call(this, v) }
					/> 
				</div> 
				<ReferenceRange onRef={ref => this.referenceRangeRef = ref} isVisible={this.state.referenceRangeFlag} rows={rows} className='mb10' />
				<SpecAbnormal onRef={ref => this.specAbnormalRef = ref} rows={rows} selectedKeys={selectedKeys} />
			</Box>
		)
	} 
}