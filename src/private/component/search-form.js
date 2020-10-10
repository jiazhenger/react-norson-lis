import React from 'react'

// import Select from '@antd/form/select'
// ===================================================================== global declare
const { $fn, $async } = window
// ===================================================================== global antd
const Form = $async(()=>import('@antd/form/form'))
const Item = $async(()=>import('@antd/form/item'))
const Button = $async(()=>import('@antd/button'))
const Input = $async(()=>import('@antd/form/input'))
const Select = $async(()=>import('@antd/form/select'))
const DatePicker = $async(()=>import('@antd/form/datePicker'))
// =====================================================================
const bordered = false

const SearchForm = ({ children, data, onChange, loading, onSubmit, onAdd, onReset, onRefesh, className }) => {
	const [ form, setForm ] = React.useState()
	
	// 重置
	const _onReset = React.useCallback( () => {
		if(form){
			form.resetFields()
			onReset && onReset()
		}
	},[form, onReset])
	// 刷新
	const _onRefesh = React.useCallback( () => {
		$fn.refreshRouter()
		onRefesh && onRefesh()
	},[ onRefesh ])
	
	React.useEffect(()=>{
		// 快捷键
		window.onkeydown = e => {
			const code = e.code
			if(code === 'F9'){
				_onRefesh()
				e.preventDefault()
			}else if(code === 'F6'){
				_onReset()
				e.preventDefault()
			}else if( code === 'F4'){
				onSubmit && onSubmit()
				e.preventDefault()
			}else if( code === 'F2'){
				onAdd && onAdd()
				e.preventDefault()
			}
		}
	},[ onSubmit, onAdd, form, _onRefesh, _onReset])
	
	const init = React.useCallback( v => {
		setForm(v)
	},[])
	
	return (
		<div className={`xplr ${className||'pt10 pb10'}`}>
			<Form layout='horizontal' onSubmit={onSubmit} init={init} className='fxw search-form small-form'>
				<div className='ex fxt'>
					{
						data.map((v,i)=>{
							const { type, value, label, data, name, names, format } = v
							const width = v.width || 150
							const mr = 20
							let children = <Input disabled={loading} name={name} p={`请输入` + label} width={width} onChange={v=>onChange(v,true)} onPressEnter={onSubmit} bordered={bordered}/>
							if( type === 'select'){
								children = <Select disabled={loading} name={name} data={data} p={`请选择` + label} nameStr={v.nameStr} idStr={v.idStr} onChanged={onChange} width={width} auto bordered={bordered}/> 
							}else if(type === 'date-range'){
								children = <DatePicker disabled={loading} name={names} width={width*2} range showTime value={value} format={format} onChange={onChange} bordered={bordered}/>
							}
							return (
								<Item key={i} label={label} name={name} mr={mr}>
									{children}
								</Item>
							)
						})
					}
				</div>
				<div>
					<Button loading={loading} htmlType='submit' label='搜索 F4'/>
					<Button loading={loading} label='重置 F6' className='mlr10' ghost onClick={_onReset}/>
					<Button loading={loading} label='刷新 F9' ghost onClick={_onRefesh}/>
				</div>
			</Form>
		</div>
	)
}

export default class extends React.Component{
	componentWillUnmount(){
		window.onkeydown = null
	}
	render(){
		const { children, data, onChange, loading, onSubmit, onAdd, onReset, className } = this.props
		return (
			<SearchForm
				data		= { data} 
				onChange	= { onChange } 
				onSubmit	= { onSubmit } 
				onAdd		= { onAdd } 
				onReset		= { onReset }
				loading		= { loading }
				className	= { className }
			>
				{children}
			</SearchForm>
		)
	}
}