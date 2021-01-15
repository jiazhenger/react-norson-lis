import React from 'react'
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const message = import('@antd/message')
const confirm = import('@antd/confirm')
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Button = $async(()=>import('@antd/button'))
// ===================================================================== component

export default class extends React.Component{
	state = {
		dataObj: {},
		submit: [
            { label: '项目',		name: 'kind_id',	required:true, type: 'select', data: []	},
            { label: '医院',		name: 'hosp_id', 	type: 'select', data: [] },
            { label: '时间范围',	name: 'date',		type:'date-range', names:['start_time','end_time'] },
            { label: '修改价格',	name: 'price',		required:true,	},
		],
		submit1: [
            { label: '用户名',		name: 'account',	required:true, },
            { label: '密码',		name: 'password', 	required:true, type: 'password' },
        ],
		modifyPrice:'',
		oldPrice: '',
	}
	model = {}
	componentDidMount(){
		const {submit} = this.state
		cacheApi.then(f => {
			$fn.getCache({ // 项目
				cache: f.default.specimenkindSelect, name: 'name', id: 'uuid', callback: (data) => {
					if ($fn.hasArray(data)) {
						submit[0].data = data
                    } else {
                        $http.submit(null, 'specimen-kind/selectkind').then(data => {
							submit[0].data = data
							$fn.setCache()
                        })
					}
					this.setState({submit})
				}
			})
			$fn.getCache({ // 医院
				cache: f.default.BsHospitalSelect, name: 'name', id: 'uuid', callback: (data) => {
					if ($fn.hasArray(data)) {
						submit[1].data = data
                    } else {
                        $http.submit(null, 'bs-hospital/select').then(data => {
							submit[1].data = data
							$fn.setCache()
                        })
					}
					this.setState({submit})
				}
			})
		})
	}
	ButtonGroup = () => {
		return []
	}
	render(){
		const { submit, submit1, modifyPrice, oldPrice, dataObj } = this.state
		return (
			<Page title='修改项目价格'>
				<div className	= 'xmt wf'>
					<SubmitForm
						modal
						width		= {400}
						data 		= { submit }
						onChange    = {(v, press, { name, data }) => {
							const { submit } = this.state;
							if (name === 'kind_id') {
								this.setState({oldPrice: press.children})
							}
							if (name === 'price') {
								this.modifyPrice = v
								this.setState({modifyPrice: v})
							}
						} } 
						onSubmit 	= { v => {
							const kindName = ''
							const param = {
								kindName: oldPrice,
								hosp_id: v.hosp_id,
								start_time: v.date.start,
								end_time: v.date.end,
								kind_id: v.kind_id,
								price: v.price,
							}
							this.setState({dataObj:param})
							$http.submit(null, 'bill/getModifyBillCount', { param }).then(data =>{
								this.setState({oldPrice:data.billCount})
								this.refs.modal.open()
							})
						}}
						init    	= { form => this.formSubmit = form }
					/>
					<div className='ml30 mt10'>
						<div className='tc mr5' style={{color:'#fff',borderRadius:'50%',backgroundColor:'red',height: '12px',width: '12px',
						display:'inline-block',lineHeight:'12px'}}>?</div>
						修改后，该项目的价格将会统一修改为 {modifyPrice}</div>
				</div>
				<Modal ref='modal' title='提示' width={648} noFooter>
					<div>
					<div className='tc mr5' style={{color:'#fff',borderRadius:'50%',backgroundColor:'#E6A23C',height: '20px',width: '20px',
						display:'inline-block',lineHeight:'20px'}}>!</div>
					是否将 的价格修改为 {modifyPrice} 元？本次操作影响的主条码数为{oldPrice}
					</div>
					<div className='tc'>
						<Button label='取消' size='small' className='dkm ml30 mt10' onClick={()=>{ this.refs.modal.close() } } />
						<Button label='确定' size='small' className='dkm ml30 mt10' onClick={()=> {
							this.refs.modal.close()
							this.refs.modal1.open()
						} } />
					</div>
				</Modal>
				<Modal ref='modal1' title='提示' width={400} noFooter>
					<div className='tc mb15'>
						<div className='tc mr5' style={{color:'#fff',borderRadius:'50%',backgroundColor:'red',height: '12px',width: '12px',
						display:'inline-block',lineHeight:'12px'}}>!</div>
						请输入用户名和密码进行确认
					</div>
					<SubmitForm
						modal
						data = { submit1 }
						onChange    = {(v, press, { name, data }) => { } } 
						onSubmit = { v => { 
							const param={
								...dataObj,
								account: v.account,
								password: v.password
							}
							$http.submit(null, 'bill/modifyBill', { param }).then(data => {
								this.refs.modal1.close()
								message.then(f => f.default.success('更换成功'))
							})
						 }}
						onClose = { ()=>this.refs.modal1.close() }
						init    = { form => this.formSubmit = form }
					/>
				</Modal>
			</Page>
		)
	}
}