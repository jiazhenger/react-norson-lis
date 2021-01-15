import React from 'react'
import Modal from '@antd/modal'
import coms from '@/private/js/common.js'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Button = $async(()=>import('@antd/button'))
const message = import('@antd/message')
const Text = $async(()=>import('@tp/text'))
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SearchForm = $async(()=>import('#cpt/search-form'))
const SubmitForm = $async(()=>import('#cpt/submit-form'))
const Table = $async(()=>import('#cpt/table'))
const cacheApi = import('@/private/api/cacheApi')
// ===================================================================== 页面常量
const statusOption = [
	{ name: "启用", value: "1" },
	{ name: "待启用", value: "0" },
	{ name: "禁用", value: "-1" }
]
const compStaffOption = [
    { name: '是', value: '1'},
    { name: '否', value: '0'},
]
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
        selectedKeys:[],
        submit: [
            { label: '员工编号',    name: 'empl_name',          required: true},
            { label: '真实姓名',    name: 'real_name',          required: true},
            { label: '英文名称',    name: 'en_name'},
            { label: '密码',        name: 'password',           type: 'password'},
            { label: '确认密码',    name: 'confirm_password',   type: 'password'},
            { label: '手机号码',    name: 'phone',              required: true},
            { label: '身份证',      name: 'idcard',             required: true},
            { label: '性别',        name: 'sex',                type: 'select',     data: [],                   required: true},
            { label: '电子邮件',    name: 'email',              required: true},
            { label: '年龄',        name: 'age',                required: true},
            { label: '入职时间',    name:'entrytime',           type:'date-time',   after:true },
            { label: '所属部门',    name: 'dept_id',            type: 'select',     data: [],                   idStr: 'uuid',        nameStr: 'depart_name', required: true},
            { label: '所属科室',    name: 'pgroup_ids',         type: 'select',     data: [],                   mode: 'multiple',   full: true,             width: '100%',  idStr: 'uuid', onChange: (v)=>{
                this.getJob(v)
            }},
            { label: '所属岗位',    name: 'jobs',               type: 'select',     data: [],                   mode: 'multiple',   full: true,             width: '100%',  idStr: 'uuid'},
            { label: '职位权限',    name: 'position',           type: 'select',     data: [],                   mode: 'multiple',   full: true,             width: '100%',  idStr: 'uuid'},
            { label: '角色权限',    name: 'roles',              type: 'select',     data: [],                   mode: 'multiple',   full: true,             width: '100%',  idStr: 'uuid',  nameStr: 'role_name'},
            { label: '分组权限',    name: 'groups',             type: 'select',     data: [],                   mode: 'multiple',   full: true,             width: '100%'},
            { label: '头像',		name: 'head_portrait',      type: 'upload',     params: {modular: 121}},
            { label: '电子签名',    name: 'signature',          type: 'upload',     params: {modular: 121}},
        ],
        forms: [
            { label:'岗位',         name:'uuid',                type: 'select',     data: [],                   idStr: 'uuid'},
            { label:'状态',         name:'enabled',             type: 'select',     data: []},
            { label:'员工姓名',     name:'real_name'},
            { label:'员工编码',     name:'empl_name'},
            { label:'邮箱编码',     name:'email'},
            { label:'手机号码',     name:'phone'},
        ],
        sexOption: []
	}
	id = $fn.query('id') || ''
    model = { uuid: this.id }
    getJob(v){
        const { submit } = this.state
        $http.submit(null,'project-team/jobselect',{ param: {uuid: v} }).then(data=>{
            if ($fn.hasArray(data)) {
                submit[13].data = data
                this.setState({submit})
            }
        })
    }
    getDicItem(selectName, api, cb) {
        cacheApi.then(f => {
            const d = f.default
            $fn.getCache({
                cache: d[selectName], callback: (data) => {
                    if ($fn.hasArray(data)) {
                        cb && cb(data)
                    } else {
                        $http.submit(null, api).then(data => {
                            if (data.items) {
                                cb && cb(data.items)
                            } else {
                                cb && cb(data)
                            }
                            $fn.setCache()
                        })
                    }
                }
            })
        })
    }
	componentDidMount(){
        const { forms, submit } = this.state
        forms[1].data = statusOption // 状态
        // 岗位
        this.getDicItem('jobAllselect', 'project-team/jobAllselect', data => {
            forms[0].data = data
            this.setState({forms})
        })
        // 部门
        this.getDicItem('DEPTSelect', 'department/select', data => {
            submit[11].data = data
            this.setState({submit})
        })
        // 科室
        this.getDicItem('ProjectTeamSelect', 'project-team/select', data => {
            submit[12].data = data
            this.setState({submit})
        })
        // 职位权限
        this.getDicItem('positionSelect', 'position/select', data => {
            submit[14].data = data
            this.setState({submit})
        })
        // 角色权限
        this.getDicItem('roleSelect', 'role/select', data => {
            submit[15].data = data
            this.setState({submit})
        })
        // 分组权限
        this.getDicItem('groupsSelect', 'groups/select', data => {
            submit[16].data = data
            this.setState({submit})
        })
        // 性别
        $fn.getDisItem({
            code: 45700,
            callback: (data) => {
                submit[7].data = data
                this.setState({submit})
            }
        })
		this.fetch(this.model)
	}
	// paging
	fetch = param => $fn.fetch.call(this,'employee/index', param)
	// table
	cols = [
        { type: 'checkbox' },
		{ title: '员工编码',	field: 'empl_name',      width: 120 },
		{ title: '员工名称',	field: 'real_name',      width: 150},
		{ title: '手机号码',	field: 'phone',       width: 150},
        { title: '邮箱地址',        field: 'email',        width: 220 },
        { title: '性别',	field: 'sex_name',           width: 80,},
        { title: '状态',		field: 'enabled',           width: 80,      render: ({rows}) => {
            let d = statusOption.filter(i => i.value === rows.enabled)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
        { title: '本司员工',		field: 'is_corp',           width: 80,      render: ({rows}) => {
            let d = compStaffOption.filter(i => i.value === rows.is_corp)
            return $fn.hasArray(d) ? d[0].name : <Text value={null}/>
        }},
        { title: '所属公司',	field: 'company_name',       width: 120},
        { title: '所属部门',	field: 'depart_name',       width: 120},
        { title: '所属科室',	field: 'project_name',       width: 120},
		{ title: '操作',        align:'tc',             width: 200,     render:({rows})=>{
			return (
				<div className='plr5'>
                    <Button className='mr10' label='权限关联' ghost onClick={e=>{
                        $fn.push(this, $fn.getRoot().root + 'system-settings/staff/associated?id=' + rows.uuid + '&type=staff')
					}}  />
					<Button className='mr10' label='编辑' ghost onClick={e=>{
                        this.isEdit = true
                        this.refs.modal.open()
                        const { submit } = this.state
						$http.submit(null,'employee/info',{ param:{uuid: rows.uuid} }).then(data=>{
                            $fn.hasArray(data.pgroup_ids) && this.getJob(data.pgroup_ids)
                            this.rows = data
                            $fn.setSubmitValues(submit, data, ()=>{this.setState({submit})})
                        })
					}}  />
                    <Button className='mr10' label='禁用' ghost onClick={e=>{
						const param = {uuid: rows.uuid} 
						coms.interfaceConfirm('employee/del', '禁用', param, () => {
							this.fetch(this.model)
						})
					}}  />
				</div>
			)
		}},
	]
	ButtonGroup = () => {
        const arr = [
            { label:'添加 F2', code:'F2', onClick:()=>{
				this.refs.modal.open()
                const { submit } = this.state
				submit.map(item => {
                    item.value = ''
				})
				this.isEdit = false
				this.setState({ submit })
			} },
			{ label:'启用', disabled:this.state.selectedKeys.length===0, onClick:()=>{
				const param = {uuid: this.state.selectedKeys.map(v=>v.uuid)} 
				coms.interfaceConfirm('employee/open', '启用', param, () => {
                    this.fetch(this.model)
                    this.setState({selectedKeys: []})
                })
            } },
            { label:'文件导入', onClick:()=>{
				
            } },
        ]
        if (this.id) {
            arr.push({ label:'返回', onClick:()=>{ $fn.back(this) } },)
        }
        return arr
	}
	render(){
		const { data, pullLoading, pag, submit, forms } = this.state
		return (
			<Page title='员工管理' ButtonGroup={this.ButtonGroup()}>
				{/* 搜索 */}
				<SearchForm
					data		= { forms } 
					onChange	= { (v,press)=>$fn.onChange.call(this,v,press) } 
					onSubmit	= { $fn.onSubmit.bind(this) } 
					onAdd		= { this.onAdd } 
					onReset		= { $fn.onReset.bind(this,forms) }
                    loading		= { pullLoading }
                    init        = { form => form.setFieldsValue({uuid: this.id}) }
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
                <Modal ref='modal' title={this.isEdit ? '编辑' : '添加'} width={648} noFooter>
                    <SubmitForm
                        modal
                        data = { submit }
                        onChange = { (v, press, {name})=>{
                            submit.forEach(item=>{
                                if (item.name === name) {
                                    item.value = v
                                }
                            })
                        } }
                        onSubmit = { v => {
                            const data = {
                                head_portrait: v.head_portrait || '',
                                signature: v.signature || '',
                                pgroup_ids: v.pgroup_ids || [],
                                position: v.position || [],
                                roles: v.roles || [],
                                groups: v.groups || [],
                                jobs: v.jobs || []
                            }
                            if (this.isEdit) {
                                const param = { ...this.rows, ...v, ...data}
                                $http.submit(null,'employee/edit',{ param }).then(data=>{
                                    message.then(f=>f.default.success('编辑成功'))
                                    this.refs.modal.close()
                                    $fn.setCache()
                                    this.fetch(this.model)
                                })
                            } else {
                                const param = { ...v }
                                $http.submit(null, 'employee/add', { param }).then(data => {
                                    message.then(f => f.default.success('添加成功'))
                                    this.refs.modal.close()
                                    $fn.setCache()
                                    this.fetch(this.model)
                                })
                            }
                            
                        }}
                        onClose = { ()=>this.refs.modal.close() }
                        init    = { form => { this.form = form } }
                    />
                </Modal>
			</Page>
		)
	}
}