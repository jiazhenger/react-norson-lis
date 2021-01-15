import React from 'react'
import Modal from '@antd/modal'
// ===================================================================== global declare
const { $http, $fn, $async } = window
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== antd
const message = import('@antd/message')
const confirm = import('@antd/confirm')
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
const Button = $async(()=>import('@antd/button'))
// ===================================================================== component

export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],
		data1: {},
		submit: [
            { label: '医院名称',	name: 'hosp_name',		disabled: true },
            { label: '模板名称',	name: 'qt_temp_id', 	type:'select', data: [] },
        ],
        submit1: [
            { label: '物价代码',	name: 'price_code',		    disabled: true },
            { label: '中文简称',	name: 'item_name_sort',		disabled: true },
            { label: '项目名称',	name: 'item_name',		    disabled: true },
            { label: '英文简称',	name: 'item_name_en_sort',	disabled: true },
            { label: '英文名称',	name: 'item_name_en',		disabled: true },
            { label: '检测方法',	name: 'detection_method',	disabled: true },
            { label: '结算价格',	name: 'price', },
            { label: '折扣率',	    name: 'discount_rate',		disabled: true },
            { label: '物价状态',	name: 'enabled',			type:'select', data: [], nameStr: 'label', idStr: 'value', },
            { label: '排序',	    name: 'sort' },
		],
	}
	rowList= {}
	forms = [
		{ label:'物价代码',		name:'price_code', },
        { label:'项目名称',		name:'item_name', },
        { label:'助记码',		name:'qt_item_code', },
	]
	model = {
		price_code: '',
        item_name: '',
        qt_item_code: '',
        hosp_id: $fn.query('id'),
	}
	enabledOption= [
        { label: "启用", 	value: "1" },
        { label: "待启用", 	value: "0" },
        { label: "禁用",  	value: "-1" }
    ]
	componentDidMount(){
        const { submit, submit1 } = this.state
        cacheApi.then(f => {
			const d =  f.default
			$fn.getCache({ // 模板名称
				cache: d.qtCompTemplate, name: 'name', id: 'uuid', callback: (data) => {
					if ($fn.hasArray(data)) {
                        submit[1].data = data
					} else {
						$http.submit(null, $fn.replaceApi(d.qtCompTemplate)).then(data => {
                            submit[1].data = data
							$fn.setCache()
						})
					}
					this.setState({ submit })
				}
			})
			$fn.getCache({ // 医院
				cache: d.BsHospitalSelect, name: 'name', id: 'uuid', callback: (data) => {
					if ($fn.hasArray(data)) {
						data.map(i=> {
							if(i.value ===  $fn.query('id')) {
								submit[0].value = i.name
							}
						})
					} else {
						$http.submit(null, $fn.replaceApi(d.BsHospitalSelect)).then(data => {
                            data.map(i=> {
								if(i.value ===  $fn.query('id')) {
									submit[0].value = i.name
								}
							})
							$fn.setCache()
						})
					}
					this.setState({ submit })
				}
            })
		})
		submit1[8].data = this.enabledOption
		this.fetch()
	}
	fetch = param => $fn.fetch.call(this,'qt-item-hospital/index', {...param, ...this.model})
	cols = [
		{ type:'checkbox' },
		{ title: '物价代码', 	field: 'price_code', 		width:120 },
        { title: '关联物价', 	field: 'price_rel_codes', 	width:120 },
		{ title: '项目名称', 	field: 'item_name', 		width:120 },
		{ title: '英文简称', 	field: 'item_name_en_sort', width:120 },
		{ title: '英文名称', 	field: 'item_name_en', 		width:120 },
		{ title: '检测方法', 	field: 'detection_method_name', width:120 },
		{ title: '助记码', 		field: 'qt_item_code', 		width:120 },
        { title: '标准价格(元)',field: 'price', 			width:120 },
		{ title: '结算价格(元)',field: 'contract_price', 	width:120 },
		{ title: '操作', 		width:100,  				render:({rows})=>{
			return (
				<div className='plr5'>
					<Button className='mr10' label='编辑' ghost onClick={()=>{
                        const { submit1 } = this.state
                        this.refs.modal1.open()
                        const param = {
                            qt_temp_id: rows.qt_temp_id,
                            hosp_id: rows.hosp_id,
                            source_item_id: rows.source_item_id
						}
						this.rowList= rows
                        $http.submit(null,'qt-item-hospital/info', { param } ).then(data=>{
                            $fn.setSubmitValues(submit1, data, ()=>{this.setState({submit1})})
                        })
					}}/>
				</div>
			)
		} },
	]
	ButtonGroup = () => {
		return [
            { label:'模板导入', ghost:true, onClick:()=>{ this.refs.modal.open()  }},
			{ label:'返回', ghost:true, onClick:()=>{ $fn.back(this) }},
		]
	}
	render(){
		const { data, data1, pullLoading, pag, submit, submit1, selectedKeys } = this.state
		return (
			<Page title='物价管理' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { this.forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) }
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onReset		= { $fn.onReset.bind(this,this.forms) }
					loading		= { pullLoading }
				/>
				{/* 表格 */}
				<Modal ref='modal' title='医院物价模板导入' width={648} noFooter>
					<SubmitForm
						modal
                        data = { submit }
                        onChange    = {(v, press, { name, data }) => {
                            const { submit } = this.state;
                        } } 
						onSubmit = { v => {
							const param = { ...v, hosp_id: $fn.query('id') }
							console.log(param);
							$http.submit(null,'qt-item-hospital/bindtemp', { param } ).then(data=>{
								message.then(f=>f.default.success('导入成功'))
								this.refs.modal.close()
								this.fetch()
							})
						}}
                        onClose = { ()=>this.refs.modal.close() }
                        init    = { form => this.formSubmit = form }
					 />
                </Modal>
                <Modal ref='modal1' title='编辑' width={648} noFooter>
					<SubmitForm
						modal
                        data = { submit1 }
                        onChange    = {(v, press, { name, data }) => {
                            const { submit1 } = this.state;
                        } } 
						onSubmit = { v => {
							this.rowList.discount_rate = v.discount_rate
							this.rowList.enabled = v.enabled
							this.rowList.sort = v.sort
							const param = { ...this.rowList }
							$http.submit(null,'qt-item-hospital/edit', { param } ).then(data=>{
								message.then(f=>f.default.success('保存成功'))
								this.refs.modal1.close()
							})
						}}
                        onClose = { ()=>this.refs.modal1.close() }
                        init    = { form => this.formSubmit = form }
					 />
				</Modal>
				<Table
					className		= 'xplr'
					cols			= { this.cols }
					data 			= { data }
					loading 		= { pullLoading }
					onRow			= {current => {
						this.setState({data1:current})
						this.setState({selectedKeys:current})
					}}
					pag				= { pag }
					onChange		= { (current, pageSize) => $fn.pageChange.call(this,{current, pageSize}) }
					onSort			= { v => $fn.onSort.call(this, v) }
				/>
			</Page>
		)
	}
}