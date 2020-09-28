import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== global antd
const Form = $async(()=>import('@antd/form/form'))
const Item = $async(()=>import('@antd/form/item'))
const Button = $async(()=>import('@antd/button'))
const MyInput = $async(()=>import('@antd/form/input'))
const Select = $async(()=>import('@antd/form/select'))
const DatePicker = $async(()=>import('@antd/form/datePicker'))
// =====================================================================
const size = 'small'
const bordered = false
export default ({ children, data, onChange, loading, onSubmit, onRefesh, onAdd }) => {
	const [ form, setForm ] = React.useState()
	
	React.useEffect(()=>{
		// 快捷键
		window.onkeydown = e => {
			const code = e.code
			if(code === 'F9'){
				onRefesh && onRefesh()
				e.preventDefault()
			}else if(code === 'F6'){
				if(form){
					form.resetFields()
				}
				e.preventDefault()
			}else if( code === 'F4'){
				onSubmit && onSubmit()
				e.preventDefault()
			}
			else if( code === 'F2'){
				onAdd && onAdd()
				e.preventDefault()
			}
		}
	},[onRefesh, onSubmit, onAdd])
	
	const init = React.useCallback( v => {
		setForm(v)
	},[])
	
	return (
		<div className='xplr pt10 pb10'>
			<Form layout='horizontal' onSubmit={onSubmit} init={init} className='fxw search-form small-form'>
				<div className='ex fx'>
					{
						data.map((v,i)=>{
							const { type, value, label, data, name, names, format } = v
							const width = v.width || 150
							const mr = 20
							let Component = () =>  <MyInput name={name} p={`请输入` + label} value={value} width={width} onChange={onChange} bordered={bordered}/>
							if(type === 'select'){
								Component = () => <Select name={name} data={data} p={`请输入` + label} nameStr={v.nameStr} idStr={v.idStr} value={value} width={width} auto loading={loading} onChange={onChange} bordered={bordered}/> 
							}else if(type === 'date-range'){
								Component = ()=><DatePicker name={names} width={width*2} range showTime value={value} format={format} onChange={onChange} bordered={bordered}/>
							}
							return (
								<Item key={i} label={label} name={name} mr={mr}>
									<Component />
								</Item>
							)
						})
					}
				</div>
				<div>
					<Button loading={loading} htmlType='submit' label='搜索 F4'/>
					<Button loading={loading} label='重置 F6' className='mlr10' ghost onClick={()=>form.resetFields()}/>
					<Button loading={loading} label='刷新 F9' ghost onClick={onRefesh}/>
				</div>
			</Form>
		</div>
	)
}