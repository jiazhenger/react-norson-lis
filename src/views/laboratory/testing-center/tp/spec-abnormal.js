import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window 
// ===================================================================== antd
const Radio = $async(()=>import('@antd/form/radio'))
const Input = $async(()=>import('@antd/form/input'))
const Button = $async(()=>import('@antd/button'))
// ===================================================================== component
const Title = $async(()=>import('#tp/title')) 
 
// ===================================================================== component 
export default class extends React.Component{ 
	state = { 
		forms: {
            rongxue: "",
            zhixue: "",
            handan: "",
            other: ""
        },
        specAbnormalFlag: false
    } 
    abnormalOpt = [
		{codeName: '+', 	id: '0'}, {codeName: '++', 	id: '1'}, {codeName: '+++', 	id: '2'}, {codeName: '++++', 	id: '3'}, {codeName: '+/-',	id: '4'} 
	] 
	componentDidMount () {
		this.props.onRef(this)
	}
	submits = () => {
        console.log('保存')
        console.log(this.state.forms)
    } 
	// 是否显示标本异常
	specAbnormal = () => { 
		this.setState({specAbnormalFlag: !this.state.specAbnormalFlag})
	}
	onChangeForms = (value, name ) => { 
        const { forms } = this.state
        forms[name] = value
        this.setState({forms})   
	}
	render () {
		const { rows, selectedKeys } = this.props
		const { specAbnormalFlag, forms } = this.state
		return (
			<React.Fragment>
                <div className='plr10 fxm'> 
					<Button disabled={!$fn.hasObject(rows)} ghost label={`是否${specAbnormalFlag ? '隐藏' : '显示'}标本异常`} title='请选择一条列表数据' onClick={() => this.specAbnormal()} />
                    <div style={{color: '#000',fontSize: '12px',padding: '0 20px'}}>
                        当前选中 <span style={{color: '#37a6da',fontSize: '16px'}}>{selectedKeys.length}</span> 条数据
                    </div>
				</div> 
				<div className='oh fv spec-abnormal' style={{height: specAbnormalFlag ? '220px' : '0'}}>
					<Title title='标本异常' style={{border: 'none'}} children = {
						<div className='fxm' >
							<Button label='保存' className='ml10' onClick={() => this.submits()} />
						</div>
					} />
					<div className='bor1 ex oxys' style={{margin: '0 10px'}}>
						<div className='fxm plr10 mb10 radio-style'>
							<span className='mr10'>溶血：</span>
							<Radio optionType='default' onChange={e => this.onChangeForms(e.target.value, 'rongxue')} data={this.abnormalOpt} value={forms.rongxue} />
						</div> 
						<div className='fxm plr10 mb10 radio-style'>
							<span className='mr10'>脂血：</span>
							<Radio optionType='default' onChange={e => this.onChangeForms(e.target.value, 'zhixue')} data={this.abnormalOpt} value={forms.zhixue} />
						</div> 
						<div className='fxm plr10 mb10 radio-style'>
							<span className='mr10'>黄疸：</span>
							<Radio optionType='default' onChange={e => this.onChangeForms(e.target.value, 'handan')} data={this.abnormalOpt} value={forms.handan} />
						</div>  
						<div className='fxm plr10 mb10 radio-style'>
							<span className='mr10'>其他：</span>
							<Input name='other' width={360} value={forms.other} onChange={(v, data, name) => this.onChangeForms(data, name) } /> 
						</div> 
					</div>
				</div>
            </React.Fragment>
		) 
	}  
}