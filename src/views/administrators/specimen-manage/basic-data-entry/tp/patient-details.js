import React from 'react'
// ===================================================================== common
// import coms from '@/private/js/common.js'
// ===================================================================== common
import Input from '@antd/form/input'
import { Tag } from 'antd' 
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const message = import('@antd/message')
// ===================================================================== global antd
const Select = $async(()=>import('@antd/form/select'))  
// const Checkbox = $async(()=>import('@antd/form/checkbox'))
const DatePicker = $async(()=>import('@antd/form/datePicker'))
// ===================================================================== private template
// const Page = $async(()=>import('#tp/page-container')) 
// ===================================================================== 缓存
// const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
        selectedKeys:[],
        forms: {
            spec_code: '',
            hosp_name: '',
            patient_name: '',
            sex: '45703',
            age_first_val: '',
            age_first_type: '30001',
            age_second_val: '',
            age_second_type: '30003',
            department_name: '',
            bed_no: '',  
            outpatient: '',
            doctor: '',
            doctor_phone: '',
            patient_phone: '',
            real_name: '',
            case_type: '',
            spec_traits: '',
            hosp_identification: '',
            card_no: '',
            coll_time: '', // 采样日期 + 时间
            samp_date: '', // 采样日期
            samp_time: '', // 采样时间
            diagnosis_info: '',
            remark: '',
            tags: [],
            status: '', // 审核状态
            uuid: '', 
            empl_id: '',
            logistics_user_id: '',
            hosp_id: ''
        },
        sexSelect: [],
        ageTypeSelect: [],
        caseTypeSelect: [],
        specTraitsSelect: [],
        tagsSelect: [],
        keys: 0,
        noEditor: true, // 不能编辑 
        isScan: false, // 扫码录入
        infos: {}, // 当前数据的全部详情
    }   
    titleWidth = {width: '80px'}
	model = {}
	componentDidMount(){ 
        this.props.onRef(this)   
        !$fn.isEmpty(this.props.noEditor) && this.setState({noEditor: this.props.noEditor})
		$fn.dataSave('dis-item-45700-data').then(local => {
			if($fn.hasArray(local)){ 
                this.setState({sexSelect: local})
			}else{
			  $http.submit(null,'dis-item/item', { param:{dis_code:45700}, loading:false}).then(data=>{
                this.setState({sexSelect: data})
				$fn.dataSave('dis-item-45700-data', data)
			  }) 
			}
        }) 
        $fn.dataSave('dis-item-30000-data').then(local => {
			if($fn.hasArray(local)){ 
                this.setState({ageTypeSelect: local})
			}else{
			  $http.submit(null,'dis-item/item', { param:{dis_code:30000}, loading:false}).then(data=>{
                this.setState({ageTypeSelect: data})
				$fn.dataSave('dis-item-30000-data', data)
			  }) 
			}
        }) 
        $fn.dataSave('dis-item-42000-data').then(local => {
			if($fn.hasArray(local)){ 
                this.setState({caseTypeSelect: local})
			}else{
			  $http.submit(null,'dis-item/item', { param:{dis_code:42000}, loading:false}).then(data=>{
                this.setState({caseTypeSelect: data})
				$fn.dataSave('dis-item-42000-data', data)
			  }) 
			}
        }) 
        $fn.dataSave('dis-item-21000-data').then(local => {
			if($fn.hasArray(local)){ 
                this.setState({specTraitsSelect: local})
			}else{
			  $http.submit(null,'dis-item/item', { param:{dis_code:21000}, loading:false}).then(data=>{
                this.setState({specTraitsSelect: data})
				$fn.dataSave('dis-item-21000-data', data)
			  }) 
			}
        }) 
        $fn.dataSave('dis-item-69700-data').then(local => {
			if($fn.hasArray(local)){ 
                this.setState({tagsSelect: local}) 
            }else{
			  $http.submit(null,'dis-item/item', { param:{dis_code:69700}, loading:false}).then(data=>{
                this.setState({tagsSelect: data}) 
				$fn.dataSave('dis-item-69700-data', data)
			  }) 
			}
        })
    } 
    // 清空资料
    formData = () => {
        const { forms } = this.state
        for (let name in forms) {
            if ($fn.hasArray(forms[name])) {
                forms[name] = []
            } else {
                forms[name] = ''
            } 
        }  
        this.setState({forms: forms, keys: this.state.keys + 1, infos: {}})
    }
	onChanges = (v) => {    
		const {forms} = this.state  
		let d = Object.assign(forms, v)  
		this.setState({forms: d})  
    }
    tagsChange(tag, checked) { 
        const { forms } = this.state;
        const nextSelectedTags = checked ? [...forms.tags, tag] : forms.tags.filter(t => t !== tag);
        forms['tags'] = nextSelectedTags
        this.setState({ forms: forms }); 
    }
    // 基础资料录入-获取详情
    getInfos = (rows) => { 
        const { forms } = this.state
        console.log(this.state.keys)
        $http.submit(null,'spec-case-info/info', {param: { uuid: rows.uuid }, loadingText: '数据读取中...'}).then(data=>{
            for (let name in forms) { 
                forms[name] = data[name] ? data[name] : '' 
            }
            forms['samp_date'] = !forms['samp_date'] && forms['coll_time'] && forms['coll_time'].substr(0,10); // 采样日期赋值
            this.setState({forms: forms, keys: this.state.keys + 1, noEditor: true})
            this.props.setStatus(data.status) 
        }).catch(res => { 
            message.then(f => f.default.error('数据读取失败'))
            for (let name in forms) {
                if ($fn.hasArray(forms[name])) {
                    forms[name] = []
                } else {
                    forms[name] = ''
                } 
            } 
            this.props.setStatus()
            this.setState({forms: forms, keys: this.state.keys + 1, noEditor: true})
        })
    }
    // 基础资料录入-保存、审核、以此为准 时参数处理
    setParams = () => {
        const { forms } = this.state
        forms['coll_time'] = forms.samp_date ? (forms.samp_time ? `${forms.samp_date} ${forms.samp_time}` : forms.samp_date) : ''
        forms['tags'] = forms.tags.length ? forms.tags : ''
        this.setState({forms: forms})
        return forms
    } 
    // 基础资料录入-保存
    saves = () => { 
        const param = this.setParams()
        $http.submit(null,'spec-case-info/keep', {param: { entry_type: "main", ...param }}).then(data=>{
            message.then(f => f.default.success('保存成功')) 
            this.props.nextSpec(param)
        })  
    }
    // 基础资料录入-审核
    audits = () => { 
        const param = this.setParams()
        $http.submit(null,'spec-case-info/pass', {param: { entry_type: "main", ...param }}).then(data=>{
			message.then(f => f.default.success('审核通过')) 
        })   
    }
    // 基础资料录入-可否编辑
    edits = () => {
        const { forms, keys } = this.state
        const param = {
            spec_code: forms.spec_code,
            uuid: forms.uuid
        }
        $http.submit(null,'spec-case-info/checkEditEnabled', {param: param}).then(data=>{
            if (String(data.editEnabled) === "1") {
                message.then(f => f.default.success('可以编辑'))  
                this.props.setVisible({isSave: false, isAudit: String(forms.status) ==='1' || String(forms.status) ==='2' ? false : true, isEditor: true}) 
                this.setState({noEditor: false})
                this.batchEditor()
            } else { 
                message.then(f => f.default.error('请前往双录入页面进行修改'))  
                this.props.setVisible({isSave: true, isAudit: true, isEditor: false}) 
            }
        })   
    }
    // 基础资料录入-批量编辑
    batchEditor = () => {   
        if (this.props.batchEditFlag) {
            this.PatientNameRef.getRef().focus() 
        } 
    } 
    // 双录入-获取详情
    doubleEntryInfo = (data) => {
        const { forms } = this.state
        if ($fn.hasObject(data)) {
            for (let name in forms) { 
                forms[name] = data[name] ? data[name] : '' 
            }
            forms['samp_date'] = !forms['samp_date'] && forms['coll_time'] && forms['coll_time'].substr(0,10); // 采样日期赋值
            this.setState({forms: forms, noEditor: false, keys: this.state.keys + 1})
        } else {
            for (let name in forms) {
                if ($fn.hasArray(forms[name])) {
                    forms[name] = []
                } else {
                    forms[name] = ''
                } 
            }  
            this.setState({forms: forms, noEditor: false, keys: this.state.keys + 1})
        } 
    }
    // 双录入-以此为准
    takeStandard = (type) => { 
        const param = this.setParams()
        let entry_type = type === 1 ? 'double_left' : 'double_right';
        // status = 1 记录表无此状态，手动设置，1：待审核
        $http.submit(null,'spec-case-info/pass', { param:{entry_type: entry_type, status: 1, ...param}}).then(data=>{
            message.then(f => f.default.success('操作成功'))
        })
    }
    // 快捷录入-可否编辑
    quickentryEdits = (rows) => {
        const { forms } = this.state
        const param = {
            spec_code: rows.spec_code || '',
            uuid: rows.uuid || ''
        }
        this.setState({isScan: false})
        $http.submit(null,'spec-case-info/checkEditEnabled', {param: param}).then(data=>{
            if (String(data.editEnabled) === "1") {  
                this.quickentryGetInfos(rows)
            } else { 
                for (let name in forms) {
                    if ($fn.hasArray(forms[name])) {
                        forms[name] = []
                    } else {
                        forms[name] = ''
                    } 
                }  
                this.setState({forms: forms, keys: this.state.keys + 1, infos: {}})
                message.then(f => f.default.error('请前往双录入页面进行修改'))   
            }
        })   
    }
    // 快捷录入-获取详情
    quickentryGetInfos = (rows) => {
        const { forms } = this.state
        console.log(this.state.keys)
        $http.submit(null,'spec-case-info/info', {param: { spec_code: rows.spec_code }, loadingText: '数据读取中...'}).then(data=>{
            for (let name in forms) { 
                forms[name] = data[name] ? data[name] : '' 
            }
            forms['samp_date'] = !forms['samp_date'] && forms['coll_time'] && forms['coll_time'].substr(0,10); // 采样日期赋值
            this.setState({forms: forms, keys: this.state.keys + 1, infos: data}) 
            this.PatientNameRef.getRef().focus() 
        }).catch(res => { 
            message.then(f => f.default.error('数据读取失败'))
            this.formData()
        })
    } 
     // 快捷录入-扫码录入-清空信息
     handleScanInput() { 
        // this.disabled = false;
        this.formData() 
        this.setState({isScan: true}, () => {
            this.specCodeRef.getRef().focus()  
        }) 
    }
    // 快捷录入-仅保存
    quickentrySaves = () => {
        const { infos, isScan } = this.state
        const param = this.setParams() 
        let entry_type = isScan ? 'fast_scan' : 'fast'
        if (!param.patient_name || !param.spec_code) { return message.then(f => f.default.error('条码号和姓名必填'))}
        const newParam = { 
            entry_type: entry_type,
            uuid: infos.pic_uuid,
            status: infos.status || '0',
            check_time: infos.check_time || ''
        }
        if (infos.pic_uuid === '' || infos.pic_status === '43703') {  
            $http.submit(null,'spec-case-info/keep', {param: {...param, ...newParam }}).then(data=>{
                message.then(f => f.default.success('保存成功')) 
                if (isScan) {
                    this.handleScanInput() 
                } 
            })   
        } else { // 仅保存需要对于未审核图片的自动审核
            const paramImg = { 
                uuid: infos.pic_uuid,
                spec_code: infos.spec_code,
                status: '43703'
            }
            $http.submit(null,'app-upload-pic/audit', {param: paramImg}).then(data=>{
                $http.submit(null,'spec-case-info/keep', {param: {...param, ...newParam }}).then(data=>{
                    message.then(f => f.default.success('保存成功')) 
                    if (isScan) { 
                        this.handleScanInput() 
                    } else { 
                        this.props.getpage()
                    }
                }) 
            })  
        } 
    }
    // 快捷录入-下一个
    nextSpec = () => {
        const { forms } = this.state
        if (!forms.spec_code) { return message.then(f => f.default.error('当前条码号不能为空'))}
        const param = {
          spec_code: forms.spec_code
        } 
        $http.submit(null,'spec-case-info/nextSpecCodeInfo', {param: param}).then(data=>{
            message.then(f => f.default.success('操作成功'))  
            this.props.changeImgUrl(data.img_url)
            for (let name in forms) { 
                forms[name] = data[name] ? data[name] : '' 
            }
            forms['samp_date'] = !forms['samp_date'] && forms['coll_time'] && forms['coll_time'].substr(0,10); // 采样日期赋值
            this.setState({forms: forms, infos: data, keys: this.state.keys + 1})
            this.PatientNameRef.getRef().focus()
        }) 
    }
    // 快捷录入-保存并审核
    newSaveAndAudit = () => {
        const { infos, isScan } = this.state
        const param = this.setParams()  
        const newParam = { 
            entry_type: 'fast',
            uuid: infos.pic_uuid,
            status: infos.status || '1',
            check_time: infos.check_time || ''
        }
        $http.submit(null,'spec-case-info/pass', {param: {...param, ...newParam }}).then(data=>{
            message.then(f => f.default.success('操作成功')) 
            if (isScan) {
                this.handleScanInput() 
            } else {
                this.props.getpage()
            }
        }) 
    }
    // 快捷录入-保存并审核 - 需要对于未审核图片的自动审核
    saveAndAudit = () => {
        const { infos, forms } = this.state
        if (!forms.patient_name || !forms.spec_code) { return message.then(f => f.default.error('条码号和姓名必填'))}
        if (infos.pic_uuid === '' || infos.pic_status === '43703') {   
            this.newSaveAndAudit()
        } else { // 需要对于未审核图片的自动审核
            const paramImg = { 
                uuid: infos.pic_uuid,
                spec_code: infos.spec_code,
                status: '43703'
            } 
            $http.submit(null,'app-upload-pic/audit', {param: paramImg}).then(data=>{
                this.newSaveAndAudit()
            })  
        }
    }
    // 快捷录入-扫码录入
    handleSpecEnter = () => { 
        const { forms, isScan } = this.state
        $http.submit(null,'spec-case-info/info', {param: { spec_code: forms.spec_code }}).then(data=>{
            for (let name in forms) { 
                forms[name] = data[name] ? data[name] : '' 
            }
            forms['samp_date'] = !forms['samp_date'] && forms['coll_time'] && forms['coll_time'].substr(0,10); // 采样日期赋值
            this.setState({forms: forms, infos: data, keys: this.state.keys + 1})
            this.PatientNameRef.getRef().focus()
            isScan && this.props.changeImgUrl(data.img_url)
        }) 
    }
	render(){
		const { keys, forms, sexSelect, ageTypeSelect, caseTypeSelect, specTraitsSelect, tagsSelect, noEditor, isScan } = this.state
		return (
			<React.Fragment key={keys}> 
                <div className='fxm mb10'>
                    <span style={{...this.titleWidth}}>条形码：</span> 
                    <Input disabled={!isScan} className='ex' ref={ref => this.specCodeRef = ref} name='spec_code' value={forms.spec_code} onPressEnter={() => this.handleSpecEnter()} onChange={(v) => this.onChanges(v) } />
                </div> 
                <div className='fxm mb10'>
                    <span style={{...this.titleWidth}}>送检医院：</span> 
                    <Input disabled className='ex' name='hosp_name' value={forms.hosp_name} onChange={(v) => this.onChanges(v) } />
                </div>  
                <div className='fxm mb10'> 
                    <div className='fxm' style={{width: '50%'}}>
                        <span style={{...this.titleWidth}}>姓名：</span> 
                        <Input disabled={noEditor} className='ex' ref={ref => this.PatientNameRef = ref} name='patient_name' value={forms.patient_name} onChange={(v) => this.onChanges(v) } />
                    </div> 
                    <div className='fxm' style={{width: '50%'}}>
                        <span style={{...this.titleWidth, marginLeft: '10px'}}>性别：</span>
						<Select disabled={noEditor} className='ex' name='sex' data={sexSelect} p='请选择' nameStr='name' idStr='value' value={forms.sex} onChanged={(v) => this.onChanges(v)} />
                    </div>  
                </div> 
                <div className='fxm mb10'> 
                    <div className='fxm' style={{width: '50%'}}>
                        <span style={{...this.titleWidth}}>年龄一：</span> 
                        <Input disabled={noEditor} className='ex' name='age_first_val' value={forms.age_first_val} onChange={(v) => this.onChanges(v) } />
                    </div> 
                    <div className='fxm' style={{width: '50%'}}>
                        <span style={{...this.titleWidth, marginLeft: '10px'}}>年龄类型一：</span>
						<Select disabled={noEditor} className='ex' name='age_first_type' data={ageTypeSelect} p='请选择' nameStr='name' idStr='value' value={forms.age_first_type} onChanged={(v) => this.onChanges(v)} />
                    </div>  
                </div>  
                <div className='fxm mb10'> 
                    <div className='fxm' style={{width: '50%'}}>
                        <span style={{...this.titleWidth}}>年龄二：</span> 
                        <Input disabled={noEditor} className='ex' name='age_second_val' value={forms.age_second_val} onChange={(v) => this.onChanges(v) } />
                    </div> 
                    <div className='fxm' style={{width: '50%'}}>
                        <span style={{...this.titleWidth, marginLeft: '10px'}}>年龄类型二：</span>
						<Select disabled={noEditor} className='ex' name='age_second_type' data={ageTypeSelect} p='请选择' nameStr='name' idStr='value' value={forms.age_second_type} onChanged={(v) => this.onChanges(v)} />
                    </div>  
                </div>   
                <div className='fxm mb10'> 
                    <div className='fxm' style={{width: '50%'}}>
                        <span style={{...this.titleWidth}}>送检科室：</span> 
                        <Input disabled={noEditor} className='ex' name='department_name' value={forms.department_name} onChange={(v) => this.onChanges(v) } />
                    </div> 
                    <div className='fxm' style={{width: '50%'}}>
                        <span style={{...this.titleWidth, marginLeft: '10px'}}>床号：</span>
                        <Input disabled={noEditor} className='ex' name='bed_no' value={forms.bed_no} onChange={(v) => this.onChanges(v) } />
                    </div>  
                </div>  
                <div className='fxm mb10'> 
                    <div className='fxm' style={{width: '50%'}}>
                        <span style={{...this.titleWidth}}>门诊/住院号：</span> 
                        <Input disabled={noEditor} className='ex' name='outpatient' value={forms.outpatient} onChange={(v) => this.onChanges(v) } />
                    </div> 
                    <div className='fxm' style={{width: '50%'}}>
                        <span style={{...this.titleWidth, marginLeft: '10px'}}>送检医生：</span>
                        <Input disabled={noEditor} className='ex' name='doctor' value={forms.doctor} onChange={(v) => this.onChanges(v) } />
                    </div>  
                </div>  
                <div className='fxm mb10'> 
                    <div className='fxm' style={{width: '50%'}}>
                        <span style={{...this.titleWidth}}>医生电话：</span> 
                        <Input disabled={noEditor} className='ex' name='doctor_phone' value={forms.doctor_phone} onChange={(v) => this.onChanges(v) } />
                    </div> 
                    <div className='fxm' style={{width: '50%'}}>
                        <span style={{...this.titleWidth, marginLeft: '10px'}}>受检人电话：</span>
                        <Input disabled={noEditor} className='ex' name='patient_phone' value={forms.patient_phone} onChange={(v) => this.onChanges(v) } />
                    </div>  
                </div> 
                <div className='fxm mb10'> 
                    <div className='fxm' style={{width: '50%'}}>
                        <span style={{...this.titleWidth}}>物流人员：</span> 
                        <Input disabled className='ex' name='real_name' value={forms.real_name} onChange={(v) => this.onChanges(v) } />
                    </div> 
                    <div className='fxm' style={{width: '50%'}}>
                        <span style={{...this.titleWidth, marginLeft: '10px'}}>受检人类型：</span>
						<Select disabled={noEditor} className='ex' name='case_type' data={caseTypeSelect} p='请选择' nameStr='name' idStr='value' value={forms.case_type} onChanged={(v) => this.onChanges(v)} />
                    </div>  
                </div>  
                <div className='fxm mb10'> 
                    <div className='fxm' style={{width: '50%'}}>
                        <span style={{...this.titleWidth}}>标本性状：</span> 
						<Select disabled={noEditor} className='ex' name='spec_traits' data={specTraitsSelect} p='请选择' nameStr='name' idStr='value' value={forms.spec_traits} onChanged={(v) => this.onChanges(v)} />
                    </div>  
                </div>  
                <div className='fxm mb10'>
                    <span style={{...this.titleWidth}}>医院标识：</span> 
                    <Input disabled={noEditor} className='ex' name='hosp_identification' value={forms.hosp_identification} onChange={(v) => this.onChanges(v) } />
                </div> 
                <div className='fxm mb10'>
                    <span style={{...this.titleWidth}}>身份证号：</span> 
                    <Input disabled={noEditor} className='ex' name='card_no' value={forms.card_no} onChange={(v) => this.onChanges(v) } />
                </div>  
                <div className='fxm mb10'> 
                    <div className='fxm' style={{width: '50%'}}>
                        <span style={{...this.titleWidth}}>采样日期：</span> 
                        <DatePicker disabled={noEditor} className='ex' name='samp_date' value={forms.samp_date} format={1} showTime={false} after={true} onChange={(v) => this.onChanges(v) }  />
                    </div> 
                    <div className='fxm' style={{width: '50%'}}>
                        <span style={{...this.titleWidth, marginLeft: '10px'}}>采样时间：</span>
                        <Input disabled={noEditor} className='ex' name='samp_time' value={forms.samp_time} onChange={(v) => this.onChanges(v) } />
                    </div>  
                </div>   
                <div className='fxm mb10 full_w'>
                    <span style={{...this.titleWidth}}>临床诊断：</span> 
                    <Input disabled={noEditor} mode='textarea' full={true} width='100%' name='diagnosis_info' value={forms.diagnosis_info} onChange={(v) => this.onChanges(v) } />
                </div>  
                <div className='fxm mb10'>
                    <span style={{...this.titleWidth}}>识别标签：</span> 
                    <div className='ex' disabled={noEditor}>   
                        {tagsSelect.map((v, i) => 
							(<Tag.CheckableTag
                                style={{border: '1px solid #D7D9D9'}}
                                key={i} 
                                checked={forms.tags.indexOf(v.value) > -1}
                                onChange={checked => this.tagsChange(v.value, checked)}
                            >
                                {v.name}
                            </Tag.CheckableTag>)
						)} 
                    </div> 
                </div>  
                <div className='fxm mb10 full_w'>
                    <span style={{...this.titleWidth}}>备注：</span> 
                    <Input disabled={noEditor} mode='textarea' full={true} width='100%' name='remark' value={forms.remark} onChange={(v) => this.onChanges(v) } />
                </div> 
             
            </React.Fragment>
		)
	}
}