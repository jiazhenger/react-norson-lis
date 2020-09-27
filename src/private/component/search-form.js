import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== global antd
const Form = $async(()=>import('@antd/form/form'))
const Item = $async(()=>import('@antd/form/item'))
const Button = $async(()=>import('@antd/button'))
const Input = $async(()=>import('@antd/form/input'))
const Select = $async(()=>import('@antd/form/select'))
const DatePicker = $async(()=>import('@antd/form/datePicker'))
// =====================================================================
export default ({ children, data }) => {
	return (
		<Form layout='horizontal' className='fxw search-form small-form' style={{padding:10}}>
			{
				data.map((v,i)=>{
					const size = 'small'
					const type = v.type
					const width = v.width || 150
					const mr = 20
					let Component = <Input size={size} p={`请输入` + v.label} width={width} />
					if(type === 'select'){
						Component = <Select size={size} data={v.data} p={`请输入` + v.label} width={width}/> 
					}else if(type === 'date-range'){
						Component = <DatePicker size={size} width={width*2} range showTime format='YYYY/MM/DD HH:mm:ss'/>
					}
					return (
						<Item key={i} label={v.label} name={v.name} mr={mr}>
							{Component}
						</Item>
					)
				})
			}
		</Form>
	)
}