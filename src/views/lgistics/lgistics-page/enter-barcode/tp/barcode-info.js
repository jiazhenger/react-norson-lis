// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react' 
// ===================================================================== common
import coms from '@/private/js/common.js'
// ===================================================================== global declare
const { $fn, $async } = window 
// ===================================================================== antd
// const Button = $async(()=>import('@antd/button')) 
// ===================================================================== private component 
const SearchForm = $async(()=>import('#cpt/search-form'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[], 
        selectedKeys:[],
        keys: 0
	} 
	forms = [ 
		{ label:'操作时间',		name:'date',    type:'date-range',      names:['start_at', 'end_at'] } 
    ] 
    model = {start_at: coms.sysTime(1), end_at: coms.sysTime(2)}  
	componentDidMount(){ 
        this.props.onRef(this)  
        this.fetch(this.model)
    }   
	fetch = param => $fn.fetch.call(this,'specimen/employeeEntryStatistics', param)
	cols = [ 
        { title: '医院名称',		field: 'hosp_name',	    width:120 },
        { title: '条码数量',		field: 'count',			width:120 },
        { title: '操作人',		    field: 'real_name',		width:120 }
    ]   
	render(){
		const { data, pullLoading, keys } = this.state
		return (
            <div className='pt20 h fv'>
                {/* 搜索 */}
                <SearchForm 
                    data		= { this.forms } 
                    onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
                    onSubmit	= { $fn.onSubmit.bind(this) } 
                    onReset		= { $fn.onReset.bind(this,this.forms) }
                    loading		= { pullLoading }
                    init        = { form => {
                        this.form = form 
						form.setFieldsValue({date:[coms.sysTime(1), coms.sysTime(2)]})
					}}
                />
                <Table
                    key={keys}
                    // className		= 'xplr'
                    cols			= { this.cols }
                    data 			= { data }
                    loading 		= { pullLoading }
                    onRow			= { v => this.setState({ selectedKeys: v }) }
                    onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
                />
            </div> 
		)
	}
}