import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
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
        selectedKeys:[],
        notauditreportTotal: 0
	}
	forms = [
		{ label: '标本条码',        name:'spec_code'},
		{ label: '医院名称',        name:'hosp_id',         type:'select',      data: []},
        { label: '姓名',            name:'patient_name'},
        { label: '录入项目时间',    name:'date',			type:'date-range',  names:['start_date','end_date'], value:[] },
	]
    model = {}
	componentDidMount(){
        cacheApi.then(f => {
            const d = f.default
            // 医院名称
            $fn.getCache({
                cache: d.BsHospitalSelect, callback: (data) => {
                    if ($fn.hasArray(data)) {
                        this.forms[1].data = data
                    } else {
                        $http.submit(null, 'bs-hospital/select').then(data => {
                            this.forms[1].data = data
                            $fn.setCache()
                        })
                    }
                }
            })
        })
        // 未批准报告单数量
        $http.pull(null, 'kd-report-spec/notauditreport').then(data => {
            const num = data.num || 0
            this.setState({notauditreportTotal: num})
        })
        this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'kd-report-spec/notsendreportlist', param)
	// table
	cols = [
		{ title: '标本条码',        field: 'spec_code', 	        width: 130 },
		{ title: '姓名',		    field: 'patient_name',		    width: 100 },
		{ title: '性别', 		    field: 'sex_name',              width: 80 },
		{ title: '年龄',            field: 'newAge',                width: 80 },
		{ title: '项目名称',        field: 'kind_name',             width: 240 },
		{ title: '医院',            field: 'hosp_name',             width: 220 },
		{ title: '录入项目时间',    field: 'created_at',            width: 160,         align: 'tc' },
    ]
	render(){
		const { data, pullLoading, pag, notauditreportTotal } = this.state
		return (
			<Page title='未发报告清单'>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
                    onChange    = {(v, press, { name, data }) => $fn.onChange.call(this,v,press) }
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
                    otherInfo       = { <span>未批准报告单数量：{notauditreportTotal}</span> }
				/>
			</Page>
		)
	}
}