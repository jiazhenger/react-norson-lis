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
		submit: [
			{ label:'设备名称', 		required:true,	name:'device_name', title:'设备信息'},
			{ label:'设备编号', 		required:true,	name:'device_number'},
			{ label:'设备型号', 		required:true,	name:'device_model'},
			{ label:'英文名称', 		required:true,	name:'device_name_en'},
			{ label:'设备类型', 		required:true,	name:'device_type', type:'select', data:[] },
			{ label:'联机类型', 		required:true,	name:'rel_type', type:'select', data:[] },
			{ label:'金额', 		required:true,	name:'buy_price'},
			{ label:'所属科室', 		required:true,	name:'pgroup_id'},
			{ label:'购买日期', 		required:true,	name:'buy_date', type:'date-time', after:true },
			{ label:'启用日期', 		required:true,	name:'enabeld_date', type:'date-time', after:true },
			{ label:'设备状态', 		required:true,	name:'device_status', type:'select', data:[] },
			{ label:'负责人', 		required:true,	name:'gps_unique'},
			{ label:'设备识别码', 	required:true,	name:'gps_unique'},
			{ label:'数据标识类型', 	required:true,	name:'device_type', type:'select', data:[] },
			
			{ label:'出厂编号/系列号',required:true,	name:'device_name', title:'供应商信息'},
			{ label:'出厂日期', 		required:true,	name:'enabeld_date', type:'date-time', after:true },
			{ label:'生产厂家', 		required:true,	name:'gps_unique'},
			{ label:'厂家联系人', 	required:true,	name:'gps_unique'},
			{ label:'联系电话', 		required:true,	name:'gps_unique'},
			{ label:'备注', 		required:true,	name:'gps_unique', type:'textarea', full:true, width:'100%'},
			
			{ label:'最低湿度',		required:true,	name:'device_name', title:'使用环境'},
			{ label:'最高湿度', 		required:true,	name:'gps_unique'},
			{ label:'最低温度', 		required:true,	name:'gps_unique'},
			{ label:'最高温度', 		required:true,	name:'gps_unique'},
			{ label:'功率', 		required:true,	name:'gps_unique'},
			{ label:'电压', 		required:true,	name:'gps_unique'},
		],
		id:$fn.query('id')
	}
	componentDidMount(){
		const local = $fn.local('dis-item')
		const { submit } = this.state
		if($fn.hasArray(local)){
			submit[10].data = local
		}else{
			$http.submit(null,'dis-item/item', { param:{dis_code:200}, loading:false}).then(data=>{
				submit[10].data = data
				$fn.local('dis-item', data)
				this.setState({submit:this.state.submit})
			})
		}
	}
	render(){
		const { submit, id } = this.state
		return (
			<Page title={id ? '编辑设备' : '添加设备'}>
				<div className='ex fv xplr pt10'>
					<SubmitForm
						data = { submit }
						btnSize	= 'large'
						okText = { id ? '修改 Enter' : '保存 Enter'}
						onSubmit = { v => {
							if(id){
								message.then(f=>f.default.success('修改成功'))
							}else{
								message.then(f=>f.default.success('添加成功'))
							}
							
						}}
						onClose = { ()=> $fn.back(this) }
					/>
				</div>
			</Page>
		)
	}
}