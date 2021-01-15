import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== global template
const Text = $async(()=>import('@tp/text'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
        selectedKeys:[]
    }
    
    forms = [
        { label:'标本条码',     name:'spec_code'},
        { label:'实验号',       name:'experiment_num'},
        { label: '项目名称',    name:'kind_id',	            type:'select',      data:[]},
        { label:'设备名称',     name:'device_name',	        type:'select',      data: [],   nameStr: 'device_name', idStr: 'device_name'},
        { label:'设备编号',     name:'device_uid'},
        { label:'通道号',       name:'device_channel'},
        { label:'结果时间',		name:'date',			    type:'date-range',	names:['start_at', 'end_at'], value:[] },
    ]
	// 请求参数
	model = {}
	componentDidMount(){
        cacheApi.then(f => {
            const d = f.default
            // 设备名称
            $fn.getCache({
                cache: d.deviceResult4Select, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        this.forms[3].data = data
                    } else {
                        $http.submit(null, 'result-unit-item/getDeviceResult4Select').then(data => {
                            this.forms[3].data = data
                            $fn.setCache()
                        })
                    }
                }
            })
            // 项目名称
            $fn.getCache({
                cache: d.kindinfoSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        this.forms[2].data = data
                    } else {
                        $http.submit(null, 'kind-info/select').then(data => {
                            this.forms[2].data = data.items
                            $fn.setCache()
                        })
                    }
                }
            })
        })
		this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'result-unit-item/getDeviceResultList', param)
	// table
	cols = [
		{ title: '标本条码',	field: 'spec_code',		    width: 110 },
		{ title: '实验号',		field: 'lab_tag',		    width: 80 },
		{ title: '通道号',		field: 'device_channel',	width: 80 },
		{ title: '结果时间',	field: 'msg_send_at',		width: 150,		align: 'tc' },
		{ title: '设备名称',	field: 'device_name',		width: 200 },
		{ title: '设备编号',	field: 'device_uid',		width: 100 },
		{ title: '项目',		field: 'kind_name',		    width: 200 },
		{ title: '值',          field: 'value',			    width: 100 },
		{ title: '值1', 	    field: 'value1',			width: 150 },
		{ title: '值2',         field: 'value2',	        width: 150 },
		{ title: '值3',         field: 'value3', 		    width: 150 },
	]
	ButtonGroup = () => {
		return []
	}
	render(){
		const { data, pullLoading, pag, submit } = this.state
		return (
			<Page title='设备结果管理' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onAdd		= { this.onAdd } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
                    loading		= { pullLoading }
				/>
				{/* 表格 */}
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { v => this.setState({ selectedKeys: v }) }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
				/>
			</Page>
		)
	}
}