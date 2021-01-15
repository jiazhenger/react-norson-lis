import React from 'react'
// ===================================================================== antd
import { Tabs } from 'antd'
import Modal from '@antd/modal'
import coms from '@/private/js/common.js'
const { TabPane } = Tabs;
// ===================================================================== global declare
const { $fn, $async } = window
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// ===================================================================== component
const TableCompany = $async(()=>import('./outsorcing-company'))
const TablePerson = $async(()=>import('./outsorcing-person'))
const TableList = $async(()=>import('./outsorcing-list'))
const AddCompany = $async(()=>import('./tp/add-company'))
const AddAssociate = $async(()=>import('./tp/add-associate'))
export default class extends React.Component{
	state = {
		index: 1,
		type: ''
	}
	model = {}
	
	componentDidMount(){}
	render(){
		const { index } = this.state
		return (
			<>
				<Tabs 
					className='wh fv tab-custom'
					tabBarExtraContent={
						<nav className='xplr tr'>
							{
								index === 1 && (
									<>
										<Button className='mr15' label='添加' onClick={()=>{
											this.refs.modal.open()
											this.setState({ type: 'add' })
										}}/>
										<Button label='删除' ghost onClick={()=>{
											const param = this.TableCompany.selectedUuids()
											if (!$fn.hasArray(param)) {
												message.then(f=>f.default.error('请至少选择一条数据'))
												return
											}
											coms.interfaceConfirm('lis-outsourcing-company/del', '删除', {uuids: param}, () => { 
												this.TableCompany.fetchFn()
											})
										}}/>
									</>
								)
							}
							{
								index === 2 && (
									<Button label='关联物流人员' onClick={()=>{
										this.refs.modal1.open()
										this.setState({ type: 'add' })
									}}/>
								)
							}
							{
								index === 3 && (
									<Button label='导出' onClick={()=>{
										coms.exportExcel({
											api: 'specimen/getOutsourcingList',
											param: {param: {...this.TableList.model, export: '1'}}
										})
									}}/>
								)
							}
						</nav>
					}
					onChange = { (index) => {
						this.setState({index: +index})
					}}
				>
					<TabPane tab='外包单位管理' key={1}>
						<TableCompany
							onRef={c=>this.TableCompany=c}
						/>
					</TabPane>
					<TabPane tab='关联外包物流人员' key={2}>
						<TablePerson
							onRef={c=>this.TablePerson=c}
						/>
					</TabPane>
					<TabPane tab='外包清单' key={3}>
						<TableList
							onRef={c=>this.TableList=c}
						/>
					</TabPane>
				</Tabs>
				{/* 外包单位管理添加 */}
				<Modal ref='modal' title={'添加'} width={648} noFooter>
					<AddCompany
						type={this.state.type}
						onClose={()=>this.refs.modal.close()}
						fetch={()=>{this.TableCompany.fetchFn()}}
					/>
                </Modal>
				{/* 关联外包物流人员 */}
				<Modal ref='modal1' title={'关联外包物流人员'} width={500} noFooter>
					<AddAssociate
						type={this.state.type}
						onClose={()=>this.refs.modal1.close()}
						fetch={()=>{this.TablePerson.fetchFn()}}
					/>
                </Modal>
			</>
		)
	}
}