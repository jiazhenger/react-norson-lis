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
		forms: {}
    }  
	componentDidMount () {
		this.props.onRef(this)
	}    
	changeSymbol(val) {
		let d = [
			{ t1: ">", 	t2: "<" },
			{ t1: "≥", 	t2: "≤" },
			{ t1: ">=", t2: "<="}, 
			{ t1: "<", 	t2: ">" },
			{ t1: "≤", 	t2: "≥" },
			{ t1: "<=", t2: ">=" }
		];
		let s = d.filter(i => i.t1 === val);
		if (s && s.length > 0) {
			return s[0].t2;
		} else { // 如果不需要转换就直接显示原来的符号 
			return val;
		}
	}
	render () {
		const { rows, className, isVisible } = this.props 
		let woman 	= $fn.hasObject(rows) ? rows.reference_range.filter(i => i.sex === "45702") : [];
		let man 	= $fn.hasObject(rows) ? rows.reference_range.filter(i => i.sex === "45701") : [];
		let other 	= $fn.hasObject(rows) ? rows.reference_range.filter(i => !i.sex || i.sex === '45703') : [];
		let data = [
			{ name: '男', data: man },
			{ name: '女', data: woman },
			{ name: '其他', data: other }
		]
		return (
			<React.Fragment> 
				<div className={'oh fv ' + className} style={{height: isVisible ? '200px' : '0'}}>
					<Title title='参考范围' style={{border: 'none'}} />
					<div className='bor1 ex oxys' style={{margin: '0 10px'}}>  
						{data.map((j,k)=> { 
							return ($fn.hasArray(j.data) && <div className='fx' key={k} style={{borderBottom: j.name !== '其他' ? '1px solid #E8EAEC' : '', padding: '6px 0'}}>
								<div style={{ width: '60px', padding:'6px 16px' }}>{j.name}</div>	
								{j.data.map((v,i) => {
									return (
										<div key={i} style={{padding:'6px 16px'}}>
											<p>{v.age_min_val +   		this.changeSymbol(v.age_min_type_name) + 		' 年龄值 ' + 		v.age_max_type_name + 		v.age_max_val} </p>
											<p>{v.reference_min_val + 	this.changeSymbol(v.reference_min_type_name) + 	' 年龄值 ' + 		v.reference_max_type_name + v.reference_max_val} </p>
											<p>{v.crisis_min_val + 		this.changeSymbol(v.crisis_min_type_name) + 	' 危机值范围 ' + 	v.crisis_max_type_name + 	v.crisis_max_val} </p>
										</div>
									)
								})} 	
							</div>) 
						})} 
					</div>
				</div>
            </React.Fragment>
		) 
	}  
}