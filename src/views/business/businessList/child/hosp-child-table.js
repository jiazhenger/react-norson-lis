import React from 'react'
// ===================================================================== antd
import Modal from '@antd/modal'
import { Checkbox, DatePicker } from 'antd';
import { TimePicker } from 'antd';
import moment from 'moment';
const message = import('@antd/message')
// ===================================================================== global declare
const { $http, $fn, $async } = window 
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const Input = $async(()=>import('@antd/form/input'))
const { TextArea } = Input
const Select = $async(()=>import('@antd/form/select'))
const SubmitForm = $async(() => import('#cpt/submit-form'))
// ===================================================================== private component
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
        selectedKeys:[],
        submit: [
            // { label: '选择地区',    name: 'areaData',       type: 'select',  data: [], },
            // { label: '具体位置',    name: 'street', },
            // { label: '标本收取地点',name: 'contact_name', },
            // { label: '医生',        name: 'doctor_id',      type: 'select',  data: [], },
            // { label: '医院科室',    name: 'depart_id',      type: 'select',  data: [], },
            // { label: '联系电话',    name: 'contact_phone', },
            // { label: '上门周期',    name: 'checkList',      type: 'checkbox', },
            // { label: '每周上门时间',name: 'to_door_time',   type: 'time'},
            // { label: '个性化要求',  name: 'require',        type: 'textarea' },
            // { label: '备注',       name: 'remark',          type: 'textarea'  },
        ],
        uuid: [],
        form: {
            province: "",
            city: "",
            area: "",
            areaData: {
                country_id: "100000",
                province_id: "",
                city_id: "",
                area_id: ""
            },
            street: "",
            contact_name: "",
            to_door_cycle: [],
            to_door_time: "",
            require: "",
            remark: "",
            hosp_id: '',
            contact_phone: "",
            doctor_id: "",
            depart_id: ""
        },
        doctorList:[],
        hospitalDepartments:[],
        hosp_id: '',
    }
    checks = [
        { label: "周一", value: 1 },
        { label: "周二", value: 2 },
        { label: "周三", value: 3 },
        { label: "周四", value: 4 },
        { label: "周五", value: 5 },
        { label: "周六", value: 6 },
        { label: "周日", value: 7 }
    ]
    forms = []
	model = {
        hosp_id: '',
    }
    componentDidMount(){
        const { submit } = this.state
        cacheApi.then(f => {
			$fn.getCache({ // 医生
				cache: f.default.bsDocSelect, name: 'name', id: 'uuid', callback: (data) => {
					if ($fn.hasArray(data)) {
                        this.setState({doctorList:data})
					} else {
						$http.submit(null, 'bs-doctor/select').then(data => {
                            this.setState({doctorList:data})
							$fn.setCache()
						})
					}
					this.setState({ submit })
				}
            })
            $fn.getCache({ // 医院科室
				cache: f.default.ProjectTeamSelect, name: 'name', id: 'uuid', callback: (data) => {
					if ($fn.hasArray(data)) {
                        this.setState({hospitalDepartments:data})
					} else {
						$http.submit(null, 'project-team/select').then(data => {
                            this.setState({hospitalDepartments:data})
							$fn.setCache()
						})
					}
					this.setState({ submit })
				}
			})
        })
    }
    onChange(checkedValues) {
        console.log('checked = ', checkedValues);
    }
    DateOnChange(value, dateString) {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
    }
    onOk(value) {
        console.log('onOk: ', value);
    }
    onChanges = (v) => {   
		console.log(v) 
        const {form} = this.state  
        let d = Object.assign(form, v)
		// this.setState({form: d}, () => {
		// 	if (Object.keys(v)[0] === 'project_id') {
		// 		this.addProject(v.project_id)
		// 	} 
        // })
    }
    streetOnChanges(e) { // 具体地址
        const {form} = this.state 
        form.street = e
    }
    timeOnChange(time, timeString) {
        console.log(time, timeString);
    }
	componentWillReceiveProps(props) {
        this.setState({hosp_id: props.ID}) 
        this.model.hosp_id =  props.ID
        console.log(this.model);
        // this.fetch(this.model)
	}
	fetch = param => $fn.fetch.call(this, 'bs-box-address/index', { param })
	cols = [
		{ type: 'checkbox' },
		{ title: '序号',         field: 'id',           width: 120 },
		{ title: '标本收取地点', field: 'contact_name', width: 120 },
		{ title: '上门周期',     field: 'to_door_cycle',width: 120 },
		{ title: '每日上门时间', field: 'to_door_time', width: 120 },
		{ title: '个性化要求',   field: 'require',      width: 120 },
		{ title: '备注',         field: 'remark',       width: 120 },
		{ title: '操作',         width: 120,            render: ({ rows }) => {
            return (
                <div className='plr5'>
                    <Button label='编辑' ghost className='ml15' onClick={() => {
                        this.refs.modal.open()
                    }} />
                </div>
            )
		} },
    ] 
    ButtonGroup = () => {
		return []
	}
	render(){
        const { data, pullLoading, pag, selectedKeys, form, doctorList, hospitalDepartments, uuid } = this.state
		return (
            <div>
                <div className='fxbc fxmj'>
                    <h6 className="w xmlr pl20 h40 b">标本收取地点</h6>
                    <div className='fxbc fxmj mb10' >
                        <Button label='新增' size='small' className='dkm' onClick={() => {
                            this.refs.modal.open()
                         }} />
                        <Button label='删除' size='small' disabled={selectedKeys.length?false:true} className='dkm ml15 mr10' onClick={() => {
                            const param ={uuid:uuid}
                            $http.submit(null, 'bs-box-address/delete', {param}).then(data => {
                                message.then(f=>f.default.success('删除成功'))
                            })
                        }} />
                    </div>
                </div>
				<Table
					className		= 'xplr mt10'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= {current => {
                        this.setState({selectedKeys:current})
                        this.setState({uuid: current.map(v=>v.uuid)})
					}}
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
                />
                <Modal ref = 'modal' title = '编辑' width={648} noFooter >
                    <div className='fxw pt10 pr10 pl10'>
                        <div className='fx mt10'>
                            <div className='mr10 fxm'> 
                                <div className='mr10' style={{width:90,textAlign:'right'}}>选择地区</div>
                                <Select name='province' data={this.statusOption} p='请选择' nameStr='label' idStr='value'
                                onChanged={(v) => this.onChanges(v)} width={150} />
                            </div>
                            <div className='fxm'> 
                                <div className='mr10' style={{width:90,textAlign:'right'}}>具体位置</div>
                                <Input className='' style={{width:150}} value={form.street} onChange={ this.streetOnChanges } />
                            </div>
                        </div>
                        <div className='fx mt10'>
                            <div className='mr10 fxm'> 
                                <div className='mr10' style={{width:90,textAlign:'right'}}>标本收取地点</div>
                                <Input className='' style={{width:150}} value={form.contact_name} onChange={(v) => this.onChanges(v) } />
                            </div>
                            <div className='fxm'> 
                                <div className='mr10' style={{width:90,textAlign:'right'}}>医生</div>
                                <Select name='doctor_id' data={doctorList?doctorList:'暂无数据'} p='请选择' nameStr='label' idStr='value'
                                onChanged={(v) => this.onChanges(v)} width={150} />
                            </div>
                        </div>
                        <div className='fx mt10'>
                            <div className='mr10 fxm'> 
                                <div className='mr10' style={{width:90,textAlign:'right'}}>医院科室</div>
                                <Select name='depart_id' data={hospitalDepartments} p='请选择' nameStr='name' idStr='value'
                                onChanged={(v) => this.onChanges(v)} width={150} />
                            </div>
                            <div className='fxm'> 
                                <div className='mr10' style={{width:90,textAlign:'right'}}>联系电话</div>
                                <Input className='' style={{width:150}} value={form.contact_phone} onChange={(v) => this.onChanges(v) } />
                            </div>
                        </div>
                        <div className='fxm mt10'>
                            <div className='mr10' style={{width:90,textAlign:'right'}}>上门周期</div>
                            <Checkbox.Group options={this.checks} onChange={this.onChange} />
                        </div>
                        <div className='fxm w mt10'> 
                            <div className='mr10' style={{width:90,textAlign:'right'}}>每周上门时间</div>
                            <TimePicker onChange={this.timeOnChange} defaultOpenValue={moment('00:00', 'HH:mm')} />
                            {/*<DatePicker showTime onChange={this.DateOnChange} onOk={this.onOk} />*/}
                        </div>
                        <div className='fxm w mt10'> 
                            <div className='mr10' style={{width:90,textAlign:'right'}}>个性化要求</div>
                            <Input mode='textarea' onChange={(v) => this.onChanges(v) } value={form.require} />
                        </div>
                        <div className='fxm w mt10'> 
                            <div className='mr10' style={{width:90,textAlign:'right'}}>备注</div>
                            <Input mode='textarea' onChange={(v) => this.onChanges(v) } value={form.remark} />
                        </div>
                        <div className='mt10 w' style={{textAlign:'center'}}>
                            <Button className='mr10' label='取消' onClick={() => {
                                this.refs.modal.close()
                             }} />
                            <Button className='' label='确定' onClick={() => {
                                console.log(form)
                                this.refs.modal.close()
                             }} />
                        </div>
                    </div>
                </Modal>
            </div>
		)
	}
}