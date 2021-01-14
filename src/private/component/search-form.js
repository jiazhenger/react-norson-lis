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
const Checkbox = $async(()=>import('@antd/form/checkbox'))
// =====================================================================
const bordered = false

const SearchForm = ({ children, data, onChange, loading, onSubmit, onAdd, onReset, onRefesh, className, init, submitText }) => {
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
	
	const _init = React.useCallback( v => {
		setForm(v)
		if(form){
			init && init(form)
		}
	},[form])
	
	return (
		<div className={`xplr ${className||'pt10 pb10'}`}>
			<Form layout='horizontal' onSubmit={onSubmit} init={_init} className='fxw search-form small-form'>
				<div className='ex fxw'>
					{
						data.map((v,i)=>{
							const { type, value, label, data, name, names, format, readOnly } = v
							const width = v.width || 150
							const mr = 20
							let children = <Input disabled={loading} readOnly={readOnly} name={name} p={`请输入` + label} width={width} onChange={v=>onChange(v,true,{})} onPressEnter={onSubmit} bordered={bordered} value={value}/>
							if( type === 'select'){
								children = <Select disabled={loading} name={name} data={data} p={`请选择` + label} nameStr={v.nameStr} idStr={v.idStr}  value={value} onChanged={(n,press) => {
									const arr = data.filter(m => m[v.idStr || 'value'] === n[name])
									let row = {}
									if ($fn.hasArray(arr)) {
										row = arr[0]
									}
									onChange && onChange(n, press, { name, data: row })
								}} width={width} auto bordered={bordered}/> 
							}else if(type === 'date-range'){
								children = <DatePicker disabled={loading} name={names} width={width * 2 + 30} range showTime value={value} format={format} onChange={v => onChange(v, false, {})} bordered={bordered}/>
							}else if(type === 'checkbox') {
								// 薛 | 2020-10-27 | 新增
								children = <Checkbox disabled={loading} name={name} value={value} onChange={v=>onChange(v,true,{name})} /> 
							}
							// 薛 | 2020-10-27 | 是否显示标签
							if (!v.noVisible) { 
								return (
									<Item key={i} name={name} label={label} mr={mr}>
										{children}
									</Item>
								)
							}
						})
					}
				</div>
				<div>
					<Button loading={loading} htmlType='submit' label={submitText ? submitText : '搜索 F4'}/>
					{onReset && <Button loading={loading} label='重置 F6' className='ml10' ghost onClick={_onReset}/> }
					{onRefesh && <Button loading={loading} label='刷新 F9' className='ml10' ghost onClick={_onRefesh}/>}
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
		const { children, data, onChange, loading, onSubmit, onAdd, onReset, className, init, submitText } = this.props
		return (
			<SearchForm
				data		= { data} 
				onChange	= { onChange } 
				onSubmit	= { onSubmit } 
				onAdd		= { onAdd } 
				onReset		= { onReset }
				loading		= { loading }
				className	= { className }
				init		= { init }
				submitText  = { submitText}
			>
				{children}
			</SearchForm>
		)
	}
}