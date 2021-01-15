// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react' 
// ===================================================================== global declare
const { $http, $fn, $async } = window 
// ===================================================================== antd
const Button = $async(()=>import('@antd/button')) 
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form')) 
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== 缓存
const cacheApi = import('@/private/api/cacheApi') 
// ===================================================================== component
export default class extends React.Component{ 
	isEdit = false
	state = {
		data:[],
		pag: {},
		selectedKeys:[], 
		hospSelect: [],
		hosp_name: '', // 医院名称
	}     
	typeOptions = [
        { label: "正常", value: "91,92,94,95,96,99" },
        { label: "终止", value: "93" },
        { label: "迟发", value: "97" },
        { label: "退单", value: "98" }
    ]
	forms = [ 
		{ label:'医院',					name:'hosp_id',					type:'select', data: [], nameStr:'name', idStr:'value' },
		{ label:'医院等级',				name:'level',					type:'select', data: [], nameStr:'name', idStr:'value' },
	]  
	model = {}
	componentDidMount(){    
		cacheApi.then(f => {
			$fn.getCache({
				cache: f.default.BsHospitalSelect, name: 'name', id: 'value', callback: (data) => {
					if ($fn.hasArray(data)) {
						this.forms[0].data = data
						this.setState({hospSelect: data})
                    } else {
                        $http.submit(null, 'bs-hospital/select').then(data => {
                            this.forms[0].data = data
							this.setState({hospSelect: data})
							$fn.setCache()
                        })
                    }
				}
			})
		})  
		$fn.dataSave('dis-item-39000-data').then(local => {
			if($fn.hasArray(local)){
			  this.forms[1].data = local
			}else{
			  $http.submit(this,'dis-item/item', { param: {dis_code: 39000}}).then(data=>{
				this.forms[1].data = data
				$fn.dataSave('dis-item-39000-data', data)
			  })
			}
		})
		this.fetch(this.model) 
	}  
	fetch = param => $fn.fetch.call(this,'bs-hospital/myHosp', {...param, hosp_name: this.state.hosp_name })
	cols = [     
		{ title: '医院编号',				field: 'hosp_code',				width:120 },
		{ title: '医院名称',				field: 'hosp_name',				width:120, tdCss: 'wpn' },
		{ title: '医院地址',				field: 'address',				width:120, tdCss: 'wpn' },
		{ title: '所属区域',				field: 'region_name',			width:120, tdCss: 'wpn' },
		{ title: '医院等级',				field: 'level_name',			width:120 },
		{ title: '送检日期',				field: 'create_at',				width:120 },
		{ title: '操作', 				align:'tc', 						width:80, 			render:({rows})=>{
			return (
				<div className='plr5'>
					<Button label='查看报告' ghost onClick={() => { 
						$fn.push(this, $fn.getRoot().root + `lgistics-page/my-hospital/report?uuid=${rows.uuid}`)
					}}/> 
				</div>
			)
		}}
	]    
	render(){
		const { data, pullLoading, pag } = this.state
		return (
			<Page title='我的医院'>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v, press, { name })=> {  
						$fn.onChange.call(this, v, press, () => { 
							if (name && name === 'hosp_id') { 
								let hosp_name = this.state.hospSelect.filter(i => i.value === v.hosp_id)
								this.setState({hosp_name: $fn.hasArray(hosp_name) ? hosp_name[0].name : ''}) 
							}
						})
					} } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms, () => {
						this.setState({hosp_name: ''})
					}) }
					loading		= { pullLoading }
					init    	= { form => this.form = form }
				/>
				{/* 表格 */}
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= { (select) => this.setState({ selectedKeys: select}) }
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
					onSort			= { v => $fn.onSort.call(this, v) }
				/> 
			</Page>
		)
	}
}