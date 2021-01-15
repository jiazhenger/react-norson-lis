/* 薛玉梅 | 2020-12-30 17:33:31 | desc: 检测中心方法 */
import React from 'react'
import waitStatusImg from '@img/test-center/wait_s.png'
import outsourcingStatusImg from '@img/test-center/outsourcing_s.png'
import sensitiveStatusImg from '@img/test-center/sensitive_s.png'
import positiveStatusImg from '@img/test-center/positive_s.png'
import overClinicalStatusImg from '@img/test-center/over_clinical_s.png'
import overLinearStatusImg from '@img/test-center/over_linear_s.png' 
import setImg from '@img/test-center/set-img.png' 
import tipsImg from '@img/test-center/tips-img.png'  
// ===================================================================== global declare
const { $http, $fn,  $async } = window  
// ===================================================================== antd  
const Input = $async(()=>import('@antd/form/input'))
const message = import('@antd/message')
const Select = $async(()=>import('@antd/form/select')) 

export default {
    /**
	 * 列表 - 条码列展示图标
	 * @param {titstatus} 切换tab的值
	 * @param {row} 当行数据
	 * @param {value} 条码值 
	 **/ 
    renderIcons(row, value) { 
        // 资料待审核
        let waitStatus = (row.case_info_status === '0' || row.case_info_status === '1') ? <img src={waitStatusImg} title='资料待审核' style={{width: '14px', height: '14px', marginLeft: '4px'}} /> : ''
        // 已外包 && 委托检验中心不显示已外包 | 还需要判断是否是委托检验中心 this.$route.query.type === '0' 
        let outsourcingStatus = row.outsourcing_company_code ? <img src={outsourcingStatusImg} title='已外包' style={{width: '14px', height: '14px', marginLeft: '4px'}} /> : ''
        // 敏感词
        let sensitiveStatus = row.is_sensitive_words === '1' ? <img src={sensitiveStatusImg} title='敏感词' style={{width: '14px', height: '14px', marginLeft: '4px'}} /> : ''
        // 阳性  
        let positiveStatus = ''
        if ( row.result === '阳性' || (row.forms.result.type === 'dict' || row.forms.result.type === 'qualitative' || row.forms.result.type === 'other') 
            && row.result == '45602' || row.result == '68002' || row.result == '68003' || row.result == '68004' || row.result == '68005' || row.result == '68006'
            || row.result == '68007' || row.result == '68008' || row.result == '68009') { 
                positiveStatus = <img src={positiveStatusImg} title='阳性' style={{width: '14px', height: '14px', marginLeft: '4px'}} />
        }   
        // 超出临床可报告范围
        let overClinicalStatus = row.over_clinical === '1' ? <img src={overClinicalStatusImg} title='超出临床可报告范围' style={{width: '14px', height: '14px', marginLeft: '4px'}} /> : ''
        // 超出线性范围
        let overLinearStatus = row.is_sensitive_words === '1' ? <img src={overLinearStatusImg} title='超出线性范围' style={{width: '14px', height: '14px', marginLeft: '4px'}} /> : ''
        return <div className='fxm'>{value} {waitStatus} {outsourcingStatus} {sensitiveStatus} {positiveStatus} {overClinicalStatus} {overLinearStatus} </div> 
    },
    /**
	 * 列表 - 点击图标事件,跳转到项目设置页面
	 * @param {value} 值
	 **/ 
    renderSettings(value, name) { 
        return (<div className='fxm'>
            <img src={setImg} style={{width: '14px', height: '14px', marginRight: '4px'}} onClick={() => {
                $fn.push(this, $fn.getRoot().root + `system-settings/project-settings?kind_code=${name}`) 
            }} />
            <span>{value}</span>
        </div>)
    }, 
    /**
	 * 列表 - 下拉/输入框 切换值
	 * @param {v} 值 当前更改的值，对象
	 * @param {name} 当前参数名称
	 * @param {rows} 当前行数据
	 * @param {index} 第几行 
	 **/ 
	onChanges (v, name, rows, index) {     
		const { data } = this.ProjectListRef.state 
		data[index][name] = $fn.hasObject(v) ? v[name] : ''
        this.ProjectListRef.setState({data: data})   
        if (name === 'spec_type') { // 标本类型
            const param = {
                spec_type: $fn.hasObject(v) ? v[name] : '',
                uuid: rows.uuid
            } 
            $http.submit(null, 'result-unit-item/updatespectype', { param }).then(data => {
				message.then(f => f.default.success('操作成功')) 
				this.ProjectListRef.changeFetch({pag: 1})
            })
		} else if (name ===  'result_suggestion_id') { // 建议与解释 
            const param = {
                result_suggestion_id: $fn.hasObject(v) ? v[name] : '',
                uuid: rows.uuid
            }  
            $http.submit(null, 'result-unit-item/updateResultSuggestion', { param }).then(data => {
				message.then(f => f.default.success('操作成功')) 
				this.ProjectListRef.changeFetch({pag: 1})
            })
        }
    }, 
    /**
	 * 列表 - 提示箭头 
	 * @param {value} 值 
	 **/ 
    renderTips(value) {
        const down = value.indexOf('↓') !== -1 // 向下
        const up = value.indexOf('↑') !== -1 // 向上 
        return <div className='b f16' style={{color: down ? '#1fa8f9' : up ? '#fd5029' : ''}}>{value}</div>
    },
    /**
	 * 列表 - 结果展示类型 
	 * @param {rows} 当前行数据
	 * @param {index} 第几行 
	 **/ 
    renderResult (name, rows, index) { 
        let d = rows[name]
        if (rows.forms && rows.forms[name].type) { 
            switch (rows.forms[name].type) {
                case 'text': 
                    d = <Input name={name} width='100%' value={rows[name]} onChange={(v, data, name) => this.onChanged(v, name, rows, index) } /> 
                break;
                case 'number':  
                    d = <div className='fxm'> 
                        <img src={tipsImg} title='参考范围' style={{width: '14px', height: '14px', marginRight: '4px'}} onClick={() => this.changeReferenceRange(rows)} /> 
                        <Input className='ex' name={name} value={rows[name]} onChange={(v, data, name) => this.onChanged(v, name, rows, index) } /> 
                    </div>
                break;
                case 'dict': case 'qualitative': 
                    d = <Select name={name} data={rows.forms[name].select} nameStr='name' idStr='value' value={rows[name]}  onChanged={(v, data, name) => this.onChanged(v, name, rows, index)} width='100%' />
                break; 
                case 'other': case 'compute': 
                break;  
                default: 
                break;
            }
        } 
        return d
    },
    /**
	 * 图形与解释 - 设置要提交的空数组或undefined数据为空 
	 * @param {val} 已修改的数据 
	 **/  
    setNullParameter(val) {
        let d = val;
        for (let k in d) {
          if (d[k] === undefined || d[k].length === 0) {
            d[k] = "";
          }
        }
        return d;
    }, 
    /**
	 * 图形与解释 - input|图片等切换方法
	 * @param {form} 值存放的对象 
	 * @param {v} 对象：当前修改的{属性：值}
	 * @param {name} 属性名称 
	 **/  
	changeInput (v, name, callback) { 
		const { forms } = this.state
		forms[name] = v[name]
		this.setState({forms}, () => callback && callback())
    }, 
    /**
	 * 检测中心-获取当前路径的参数 
	 **/  
    getPath () {
        const hash = window.location.hash.split('testing-center')[1] 
        const arr = hash.split('/') 
        return { project_id: arr[3], id: arr[2] }  
    }
}