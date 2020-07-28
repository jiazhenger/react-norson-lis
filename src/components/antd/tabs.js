/* ====================================== toast  ====================================== */
import React from 'react'
import { Tabs } from 'antd'
// ===================================================================== Select
const Pane = ({ children, tab, key }) => <Tabs.TabPane tab={tab} key={key}>{children}</Tabs.TabPane>

export default class extends React.Component {
	static TabPane = Pane
	render(){
		const { children, defaultActiveKey } = this.props
		console.log(defaultActiveKey)
		return <Tabs defaultActiveKey={0}>{children}</Tabs>
	}
}