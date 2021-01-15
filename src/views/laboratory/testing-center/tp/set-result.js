import React from 'react' 
// ===================================================================== global declare
const { $http, $fn, $async } = window 
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== antd
const DatePicker = $async(()=>import('@antd/form/datePicker'))
const Select = $async(()=>import('@antd/form/select')) 
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
// ===================================================================== private template 
const Table = $async(()=>import('#cpt/table')) 
// ===================================================================== component 
export default class extends React.Component{
	state = {
		data: [],
		pullLoading: false,
		selectedKeys: {}, 
        params: {},
        model: {},
        deviceNameOptions: [],
        keys: 0
    } 
    cols = [ 
        { title: '实验号', 			    field: 'lab_tag', 		                width:80 },
        { title: '结果时间', 			field: 'msg_send_at', 		            width:150 },
        { title: '设备编号', 			field: 'device_uid', 		            width:100 },
        { title: '设备名称', 			field: 'device_name', 		            width:100 },
        { title: '项目', 			    field: 'kind_name', 		            width:120 },
        { title: '值', 			        field: 'value', 		                width:120 },
        { title: '值1', 			    field: 'value1', 		                width:120 },
    ]
	componentDidMount(){  
        this.props.onRef && this.props.onRef(this)   
        cacheApi.then(f => {
            const d = f.default 
            $fn.getCache({ // 设备名称
                cache: d.deviceResult4Select, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        this.setState({deviceNameOptions: data})  
                    } else {
                        $http.submit(null, 'result-unit-item/getDeviceResult4Select').then(data => {
                            this.setState({deviceNameOptions: data})  
                            $fn.setCache()
                        })
                    }
                }
            })
        })
    }  
    changeFetch = (params) => {
        this.setState({params: params}, () => this.fetch()) 
    }
    fetch = param => $fn.fetch.call(this,'result-unit-item/getDeviceResultList', {...param, ...this.state.params, ...this.state.model})
	onChanges (v, name) {     
        const { model } = this.state 
        model[name] = v[name]
        this.setState({model}) 
    }
    onChangesTime = (v) => { 
        console.log(v)
        const { model } = this.state 
        model.start_at = v.start
        model.end_at = v.end
        this.setState({date: [v.start, v.end], model: model})
        console.log(this.state.model)
    }
    submits = (callback) => {
        if (!$fn.hasArray(this.state.data)) { return message.then(f => f.default.error('暂无数据'))}
        let forms = {
            uuid: this.props.infos.uuid,
            result_suggestion_content: this.props.infos.result_suggestion_content,
            spec_abnormal: "",
            content: "",
            dilution_multiple: this.props.infos.dilution_multiple,
            result: this.state.selectedKeys.value,
            spec_type: this.props.infos.spec_type
        };
        let param = {
        forms: JSON.stringify([forms]) 
        }; 
        $http.submit(null, 'result-unit-item/updateall', { param: param, onSuccess: () => {
            message.then(f=>f.default.success('操作成功'))
            callback && callback() 
        } }) 
    }
	render () {
		const { data, pullLoading, pag, model, keys } = this.state 
		return (
            <>
            <div className='fxj pb10'>
                <div key={keys}>
                    设备名称：<Select style={{marginRight: '20px'}} name='device_name' width={150} bordered={true} data={this.state.deviceNameOptions} nameStr='device_name' idStr='device_name' value={model.spec_type}  onChanged={(v, data, name) => this.onChanges(v, name)} />
                    结果时间：<DatePicker name='date' names={['start_at','end_at']} width={380} range showTime value={this.state.date} onChange={v => this.onChangesTime(v, false, {})} />
                </div>
                <div> 
                    <Button className='mr10' label='搜索' ghost={true} onClick={() => this.fetch()}  />
                    <Button label='重置' ghost={true} onClick={() => {
                        this.setState({model: {}, date: [null,null], keys: keys + 1}, () => {
                            this.fetch()
                        })
                    }} />
                </div>
            </div>
			<Table
                cols			= { this.cols }
                data 			= { data }
                loading 		= { pullLoading }
                onRow			= { (select) => { 
                    this.setState({ selectedKeys: select })
                }}
                pag				= { pag }
                onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
                onSort			= { v => $fn.onSort.call(this, v) }
            /> 
            </>
		)
	} 
}