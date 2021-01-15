// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const Checkbox = $async(()=>import('@antd/form/checkbox')) 
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
// ===================================================================== 缓存
const cacheApi = import('@/private/api/cacheApi')

// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		inexecution: ['numtype', 'gp_name'],
		codeChecked: false, // 全选
		key: 0,
		listData: [],
		codeSelect: [], // 选中数据
	}

	numtypeOption = [
		{ name: "三联", value: 1 },
        { name: "六联", value: 2 },
        { name: "九联", value: 3 }
	]
	
	forms = [
		{ label:'当前条码号',	name:'spec_code',		type:'input',   readOnly: true },
		{ label:'生成数量',		name:'number',			type:'input' },  
		{ label:'医院名称',		name:'gp_name',			type:'select',  data: [] },  
		{ label:'', 			name:'numtype',			type:'select', data: this.numtypeOption },
	]
	model = {number: '1', numtype: 1}
	componentDidMount(){
		cacheApi.then(f => {
			$fn.getCache({
				cache: f.default.BsHospitalSelect, name: 'name', id: 'value', callback: (data) => {
					this.setState({data: data})
					if ($fn.hasArray(data)) {
                        this.forms[2].data = data
                    } else {
                        $http.submit(null, 'bs-hospital/select').then(data => {
                            this.forms[2].data = data
                            $fn.setCache()
                        })
                    }
				}
			})
		}) 
	}

	fetch = () => {
		const pra = {
			type: 1,
			number: this.model.number,
			// hosp_name: this.model.hosp_name,
			hospital_id: this.model.hospital_id
		} 
		$http.submit(this,'barcode/add',{ param: pra, submitLoading:'creatLoading'}).then(data => {
			data.lists.forEach(v => {
				v.rowChecked = false
			});
			this.setState({listData: data.lists, key: this.state.key + 1})
			this.form.setFieldsValue({spec_code: data.last_code})
		})
	} 
	
    getInfo = () => {
		$http.submit(this, 'barcode/info').then(data => {
			this.form.setFieldsValue({spec_code: data.spec_code})
		})
	} 
	// 复选
	changeSelect = (v, row) => {
		let { listData, key } = this.state
		listData.forEach(i => {
			if (row.code === i.code) {
				i.rowChecked = v
			}
		})
		const codeSelect = listData.filter(i => i.rowChecked)
		this.setState({listData: listData, codeSelect: codeSelect, codeChecked: codeSelect.length === listData.length ? true : false, key: key + 1})
	}
	// 全选
	allSelect () {  
		let { listData, codeChecked, key } = this.state
		listData.forEach(i => {
			i.rowChecked = !this.state.codeChecked
		})
		const codeSelect = listData.filter(i => i.rowChecked)
		this.setState({listData: listData, codeSelect: codeSelect, codeChecked: !codeChecked, key: key + 1})
	}
	newarr (arr, v) {
		let d = arr.filter(i => i.code === v.code)
		return !$fn.hasArray(d)
	}
	// 删除
	deletes () {
		let { listData, codeSelect } = this.state
		const d = listData.filter(i => {
			return this.newarr(codeSelect, i)
		}) 
		this.setState({listData: d, codeSelect: [], codeChecked: false})
	}
	// 清空
	empty () {
		let { key } = this.state
		this.setState({listData: [], codeSelect: [], codeChecked: false, key: key + 1})
	}
	
	// 选择全部 
	render(){
		const { creatLoading, listData, codeChecked, key, codeSelect } = this.state 
			return (
			<Page title='标本条码'>
                {/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press,null,true) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					loading		= { creatLoading }
					submitText  = '生成 F4'
					init        = { form => {
						this.form = form
						form.setFieldsValue({number: '1', numtype: 1})
						this.getInfo()
					}}
				/> 
				<div className='fx p10' key={key} style={{borderTop: '1px solid #F2F2F2'}}>
					<div className='ex'>
						<Checkbox indeter={false} disabled={!$fn.hasArray(listData)} value={codeChecked} onChange={ (e) => this.allSelect()} label='全选' />
						<span>选择 {codeSelect.length} 条</span>
					</div>
					<div> 
						<Button disabled={!$fn.hasArray(codeSelect)} label='删除' ghost onClick={() => this.deletes()} /> 
						<Button label='清空' className='ml10' ghost  onClick={() => this.empty()} /> 
						<Button disabled={true} label='打印' className='ml10' ghost /> 
					</div>
				</div>
				<div className='ex fxw pl10 pt5' key={key + 1} style={{border: '1px solid #e8eaec', alignContent: 'flex-start'}}>
					{listData.map((v,i) => {
						return (
							<div key={i} className='fx oh mt10 mr10' style={{width: '140px',height: '50px'}}> 
								<div className='ex tc' style={{lineHeight: '29px'}}>
									<Checkbox value={v.rowChecked} onChange={ (e) => this.changeSelect(e, v) } />
								</div>
								<div style={{width: '105px'}}>
									<div style={{height: '29px'}}><img style={{width: '100%', height: '100%'}} src={v.img} /></div>
									<div className='tc f12'>{v.code}</div>
								</div>
							</div>
						)
					})}
				</div>
			</Page>
		)
	}
}