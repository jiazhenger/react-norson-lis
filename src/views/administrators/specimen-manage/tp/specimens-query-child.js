// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react' 
// ===================================================================== antd
import { Tabs } from 'antd' 
const { TabPane } = Tabs
// ===================================================================== global declare
const { $async } = window
// ===================================================================== antd 
const Button = $async(()=>import('@antd/button'))
// ===================================================================== private component
const AddsubtractForm = $async(()=>import('@views/administrators/specimen-manage/tp/addsubtract-form'))
const InfochangeForm = $async(()=>import('@views/administrators/specimen-manage/tp/infochange-form'))
const AccessrecordForm = $async(()=>import('@views/administrators/specimen-manage/tp/accessrecord-form'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[], 
		rows: {},
		defaultActiveKey: 'addsubtractRef'
	}  
	model = {}
	componentDidMount(){  
		this.props.onRef(this)
	}  
	onChange = (v) => { 
		this.setState({defaultActiveKey: v}) 
	}
	changeInfo = (v) => { 
		this.setState({rows: v}) 
	}
	submits = () => {
		this[this.state.defaultActiveKey].submits()
	}
	clears = () => {
		this[this.state.defaultActiveKey].clears()
	}
	render(){  
		const { defaultActiveKey, rows } = this.state
		return ( 
			<React.Fragment>
				<Tabs defaultActiveKey={defaultActiveKey} onChange={e => this.onChange(e)} className='h specimens-query-child '>
					<TabPane tab="加减项" key="addsubtractRef"> 
						<AddsubtractForm onRef={ref => this.addsubtractRef = ref} rows={rows} />
					</TabPane>
					<TabPane tab="客户反馈" key="accessrecordRef">
						<AccessrecordForm onRef={ref => this.accessrecordRef = ref} rows={rows} />
					</TabPane>
					<TabPane tab="信息修改" key="infochangeRef">
						<InfochangeForm onRef={ref => this.infochangeRef = ref} rows={rows} />
					</TabPane>
				</Tabs> 
				<div className='abs_rt' style={{padding: '8px 0'}}>
					<Button label='清空' className='mr10' ghost onClick={() => this.clears()} /> 
					<Button label='保存' className='mr10' ghost onClick={() => this.submits()} /> 
				</div>
			</React.Fragment>
		)
	}
}