/**
 * cache api.
 * author: 赵兴英
 * date: 2020-10-16
 */
export default {
	// 集团列表
	CorpGroupSelect: 'api/corp-group/select',
	// 公司列表
	CompanySelect: 'api/company/select',
	// 部门列表
	DEPTSelect: 'api/department/select',
	// 科室
	ProjectTeamSelect: 'api/project-team/select',
	ProjectTeamMenuSelect: 'api/project-team/selectMenu',
	getOutsourcingDepartList: 'api/specimen/getOutsourcingDepartList', // 外包单位
	// 岗位
	jobAllselect: 'api/project-team/jobAllselect',
	laboratoryselect: 'api/project-team/laboratoryselect',
	// 人员信息
	employeeSelect: 'api/employee/select', // 员工
	bssalesmanSelect: 'api/bs-salesman/select', // 业务员
	pathologySelect: 'api/employee/pathologySelect', // 病理人
	// 权限
	menuSelect: 'api/menu/select', // 菜单列表
	positionSelect: 'api/position/select', // 职位
	roleSelect: 'api/role/select', // 角色
	groupsSelect: 'api/groups/select', // 分组
	// 区域
	bsareaSelect: 'api/bs-area/select', // 业务区域
	spBoxAddress: 'api/sp-box-address/select', // 办事处地址
	// 医院
	BsHospitalSelect: 'api/bs-hospital/select',
	// 项目列表
	kindinfoSelect: 'api/kind-info/select',
	kindinfoTSelect: 'api/kind-info/tSselect',
	labkindselect: 'api/specimen/labkindselect',
	specimenkindSelect: 'api/specimen-kind/selectkind',
	// 自然项目 | 营销项目（关键字搜索）
	kindItemSelect: 'api/kd-market/select',
	// 单一项目
	singleKindSelect: 'api/kind-info/kindSelect',
	// 组合项目 （关键字搜索）
	combinKindSelect: 'api/kd-combin-project/select',
	// 设备列表
	deviceNameSelect: 'api/device/selectName',
	deviceSelect: 'api/device/select',
	deviceResult4Select: 'api/result-unit-item/getDeviceResult4Select', // 设备结果
	// GPS设备
	gpsSelect: 'api/sp-gps-device/select',
	// 模板
	reportTemplate: 'api/kd-report-from/select', // 报告单模板
	exportTemplate: 'api/lis-outsourcing-company/getExportModel4Select', // 导出模板
	lisLabTemplate: 'api/lis-lab-tag/select', // 实验号模板
	qtCompTemplate: 'api/qt-comp-template/select', // 物价模板
	lisTagtemplate: 'api/lis-tag-template/select', // 项目标签模板
	labelFormatType: 'api/settings/getLabelFormatType', // 模板处理方式
	// 物料
	mtApplyFormSelect: 'api/mt-apply-form/select', // 申请单
	materialSelect: 'api/material/select', // 物料列表
	// 所属分拣组
	SortGroupSelect: 'api/pick-group/select',
	// 字典分类
	dictionarySelect: 'api/dictionary/select',
	// 标本
	slogSelect: 'api/slog/select', // 日志类型
	printerSelect: 'api/printer/select', // 打印机
	// TCT选项
	conftctSelect: 'api/conf-tct/selectSum',
	// 流程名称
	flProSelect: 'api/fl-process/select',
	// 节点名称
	flProNodeSelect: 'api/fl-process-node/select',
	// 被授权者
	flProAuthSelect: 'api/fl-process-auth/select',
	// 医生列表
	bsDocSelect:'api/bs-doctor/select',
	// 医院科室
	bsHospDepSelect: 'api/bs-depart/select',
	// 轮转规则
	rotateConfSelect: 'api/rt-rotate-conf/select',
	// 药敏列表
	drugSensSelect: 'api/drug-sensitivity/select',
	// 合并规则
	mergeGroupSelect: 'api/merge-group/select',
	// 物价项目
	qtItemSourceSelect: 'api/qt-item-source/select',
	// 药敏组合
	drugGroupSelect: 'api/drug-group/selectList',
	resultTipsTempSelect: 'api/result-tips-temp/select', // 结果提示类型
	drawMaterialsSelect: 'api/employee/drawMaterialsSelect', // 病理取材医生
	recordIdSelect: 'api/employee/recordIdSelect', // 病理记录人
}

