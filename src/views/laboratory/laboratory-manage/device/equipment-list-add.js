import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const message = import('@antd/message')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
// ===================================================================== private component

// ===================================================================== component
export default class extends React.Component{
	state = {
		deviceStadius: [],
		department: [],
		submit: [
			{ label:'设备名称', 		name:'device_name',		required:true,	 title:'设备信息'},
			{ label:'设备编号', 		name:'device_number'},
			{ label:'设备型号', 		name:'device_model',	required:true,	},
			{ label:'英文名称', 		name:'device_name_en'},
			{ label:'设备类型', 		name:'device_type',		required:true,	 type:'select', data:[] },
			{ label:'联机类型', 		name:'rel_type',		required:true,	 type:'select', data:[] },
			{ label:'金额', 			name:'buy_price',		required:true},
			{ label:'所属科室', 		name:'pgroup_id',		required:true,	type:'select', data:[], idStr: 'uuid'},
			{ label:'购买日期', 		name:'buy_date',		required:true,	 type:'date-time', after:true },
			{ label:'启用日期', 		name:'enabeld_date',	required:true,	 type:'date-time', after:true },
			{ label:'设备状态', 		name:'device_status',	required:true,	 type:'select', data:[] },
			{ label:'负责人', 			name:'pinyin_name'},
			{ label:'设备识别码', 		name:'id_code'},
			{ label:'数据标识类型', 	name:'data_type',		required:true,	type:'select', data:[] },
			
			{ label:'供应商', 			name:'supplier', 		title: '供应商信息'},
			{ label:'联系人', 			name:'supp_user'},
			{ label:'联系电话', 		name:'supp_phone'},
			{ label:'供应商联系地址', 	name:'supp_address'},
			{ label:'维修联系人', 		name:'repair_man'},
			{ label:'维修电话', 		name:'repair_phone'},

			{ label:'出厂编号/系列号',	name:'serial_number', 	title:'厂家信息'},
			{ label:'出厂日期', 		name:'serial_date', 	type:'date-time', after:true },
			{ label:'生产厂家', 		name:'serial_man'},
			{ label:'厂家联系人', 		name:'serial_user'},
			{ label:'联系电话', 		name:'serial_phone'},
			{ label:'备注', 			name:'serial_memo', 	type:'textarea', full:true, width:'100%'},
			
			{ label:'最低湿度',			name:'min_humidity', 	title:'使用环境'},
			{ label:'最高湿度', 		name:'max_humidity'},
			{ label:'最低温度', 		name:'min_temperature'},
			{ label:'最高温度', 		name:'max_temperature'},
			{ label:'功率', 			name:'power'},
			{ label:'电压', 			name:'voltage'},
		],
		id:$fn.query('id'),
		model: {}
	}
	async getDataAsync() {
		const { submit, id } = this.state
		$fn.getDisItem({
			code: 43500,
			callback: (data) => {
				submit[4].data = data
				this.setState({deviceStadius:data, submit})
			}
		}) // 设备类型
		$fn.getDisItem({
			code: 43300,
			callback: (data) => {
				submit[5].data = data
				this.setState({deviceStadius:data, submit})
			}
		}) // 联机类型
		$fn.getDisItem({
			code: 200,
			callback: (data) => {
				submit[10].data = data
				this.setState({deviceStadius:data, submit})
			}
		}) // 设备状态
		$fn.getDisItem({
			code: 64000,
			callback: (data) => {
				submit[13].data = data
				this.setState({deviceStadius:data, submit})
			}
		}) // 数据标识类型
		// 科室
		$fn.dataSave('project-team').then(local => {
			if ($fn.hasArray(local)) {
				submit[7].data = local
				this.setState({department:local, submit:this.state.submit})
			} else {
				$http.pull(null, 'project-team/select').then(data => {
					submit[7].data = data
					this.setState({department:data, submit:this.state.submit})
					$fn.dataSave('project-team', data)
				})
			}
		})
		// 获取设备详情
		if (id) {
			$http.submit(null, 'device/info', {param: {uuid: id}}).then(data => {
				$fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
			})
		}
	}
	componentDidMount(){
		this.getDataAsync()
	}
	render(){
		const { submit, id } = this.state
		return (
			<Page title={id ? '编辑设备' : '添加设备'}>
				<div className='ex fv xplr pt10'>
					<SubmitForm
						data	= { submit }
						btnSize	= 'large'
						okText	= { id ? '修改 Enter' : '保存 Enter'}
						onSubmit = { v => {
							if(id){
								const param = {...v, uuid: id}
								$http.submit(null, 'device/edit', { param }).then(data => {
									message.then(f => f.default.success('修改成功'))
									$fn.back(this)
								})
							}else{
								const param = {...v}
								$http.submit(null, 'device/add', { param }).then(data => {
									message.then(f => f.default.success('添加成功'))
									$fn.back(this)
								})
							}
							
						}}
						onClose = { ()=> $fn.back(this) }
						init	= {form => this.form = form}
					/>
				</div>
			</Page>
		)
	}
}