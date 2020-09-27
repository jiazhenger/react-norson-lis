import React from 'react'
// ===================================================================== antd 汉化
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== global template
const Text = $async(()=>import('@tp/text'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/content/content-aside'))
const Container = $async(()=>import('#tp/box/container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
// ===================================================================== component
export default class extends React.Component{
	param = this.props.match.params
	componentDidMount(){
		console.log(this.param)
	}
	forms = [
		{ label:'设备名称', name:'a', type:'select' },
		{ label:'设备型号', name:'b', type:'input' },
		{ label:'购买时间', name:'c', type:'date-range' },
	]
	render(){
		return (
			<ConfigProvider locale={zhCN}>
				<Page>
					<Container title='设备列表'>
						{/* 搜索 */}
						<SearchForm data={this.forms} />
					</Container>
				</Page>
			</ConfigProvider>
			
		)
	}
}