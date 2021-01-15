// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react' 
// ===================================================================== antd
import { Tabs } from 'antd' 
const { TabPane } = Tabs
// ===================================================================== global declare
const { $async } = window
// ===================================================================== private component
const AddsubtractTab = $async(()=>import('@views/service/service-page/statistics/tp/addsubtract-tab'))
const HospitalTab = $async(()=>import('@views/service/service-page/statistics/tp/hospital-tab'))
const TestItemTab = $async(()=>import('@views/service/service-page/statistics/tp/testitem-tab'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[], 
		rows: {},
		defaultActiveKey: 'addsubtractRef'
	}  
	model = {}
	componentDidMount(){   
	}  
	onChange = (v) => { 
		this.setState({defaultActiveKey: v}) 
	}  
	render(){  
		const { defaultActiveKey, rows } = this.state
		return ( 
			<React.Fragment>
				<Tabs defaultActiveKey={defaultActiveKey} onChange={e => this.onChange(e)} className='h tab-custom'>
					<TabPane tab="加减做项目" key="addsubtractRef"> 
						<AddsubtractTab onRef={ref => this.addsubtractRef = ref} />
					</TabPane>
					<TabPane tab="医院" key="hospRef">
						<HospitalTab onRef={ref => this.hospRef = ref} />
					</TabPane>
					<TabPane tab="检测项" key="testItemRef">
						<TestItemTab onRef={ref => this.testItemRef = ref} />
					</TabPane>
				</Tabs>  
			</React.Fragment>
		)
	}
}