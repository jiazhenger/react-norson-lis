import React from 'react'
// ===================================================================== global antd

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
const Upload = $async(()=>import('@antd/upload'))
const Radio = $async(()=>import('@antd/form/radio'))
// =====================================================================
const size = 'middle'
const bordered = false
const FormComponent = ({ data, onChange, width, form, mb, readOnly, disabled, noholder }) => (
		<>
			{
				$fn.hasArray(data) && data.map((v,i)=>{
					const { type, value, label, data, name, format, oType, mode } = v
					const _disabled = disabled ? disabled : v.disabled
					
					let children = <Input type={type} size={size} p={noholder ? '' : '请输入' + label} width={v.width ? v.width : width} readOnly={readOnly} disabled={_disabled} bordered={bordered} onChange={n=>{
						onChange && onChange(n, true, { name })
						v.onChange && v.onChange(n, true, { name })
					}} maxLength={v.maxLength ? v.maxLength : ''} />
					if( type === 'select'){
						children = <Select size={size} data={data} p={`请选择` + label} value={value} mode={mode} nameStr={v.nameStr} idStr={v.idStr} width={v.width ? v.width : width} auto onChanged={(n,press) => {
							const arr = data.filter(m => m[v.idStr || 'value'] === n[name])
							let row = {}
							if ($fn.hasArray(arr)) {
								row = arr[0]
							}
							form.setFieldsValue({ [name]: n })
							onChange && onChange(n, press, { name, data: row })
							v.onChange && v.onChange(n, press, { name, data: row })
						}} bordered={bordered} disabled={_disabled}/> 
					}else if(type === 'date-time'){
						children = <DatePicker size={size} width={width} value={value} showTime format={format} after={v.after} bordered={bordered} disabled={_disabled}/>
					}else if(type === 'textarea'){
						children = <Input size={size} p={noholder ? '' : '请输入' + label} width={v.width ? v.width : width} mode='textarea'  readOnly={readOnly} disabled={_disabled} bordered={bordered} onChange={n=> {
							onChange && onChange(n, true, { name })
							v.onChange && v.onChange(n, true, { name })
						} } />
					}else if(type === 'checkbox'){
						children = <Checkbox size={size} label={v.checkLabel} value={value} disabled={_disabled} onChange={n=> {
							onChange && onChange(n, true, { name })
							v.onChange && v.onChange(n, true, { name })
						} } />
					}else if(type === 'upload'){
						children = <Upload params={v.params} onChange={(path) => {
							onChange && onChange(path, true, { name })
							v.onChange && v.onChange(path, true, { name })
						}} />
					}else if(type === 'radio'){
						children = <Radio size={size} data={data} value={value} optionType={oType} onChange={ n => {
							onChange && onChange(n, true, { name })
							v.onChange && v.onChange(n, true, { name })
						} }/>
					}
					return (
						<React.Fragment key={i}>
							{ v.title && <h6 className='w xmlr h40 bbor1 mb10'>{v.title}</h6> }
							<Item className={label ? '' : 'no-label'} label={label || ' '} name={name} full={v.full} mb={mb} rules={[{ required: v.required }]}>
								{children}
							</Item>
						</React.Fragment>
					)
				})
			}
		</>
	)

const SubmitForm = ({ children, data, onChange, onSubmit, onClose, init, btnSize, okText, modal, layout, display, width, className, scrollClassName, mb, readOnly, disabled, noholder }) => {
	const [ form, setForm ] = React.useState()
	const [key, setKey] = React.useState(0)
	
	const _init = React.useCallback( v => {
		setForm(v)
		data.forEach(m=>{
			if($fn.isValid(m.value)){
				v.setFieldsValue({ [m.name] : m.value })
			}
		})
		setTimeout(() => { setKey(key + 1) }, 100);
		init && init(v)
	},[data, init])
	
	return (
		<Form layout={layout} onSubmit={onSubmit} init={_init} className={`submit-form small-form fv ex ${className||''}`} key={key}>
			<div className='ex rel'>
				<div className={` ${scrollClassName||''} ${modal?'':'abs_full oys scrollbar'}`}>
					<div className={layout === 'horizontal' ? 'fxw' : ''}>
						<FormComponent data={data} form={form} width={width?width:(modal ? 180 : 190)} mb={mb} readOnly={readOnly} disabled={disabled} noholder={noholder} onChange={onChange} />
					</div>
				</div>
			</div>
			{ !display && (
				<div className={`fxmc ${modal ? 'mt20' : ' tbor1 ptb10'}`}>
					<Button label='取消' ghost className='mr15' size={btnSize} width={btnSize === 'large' ? 120 : 90} onClick={onClose} />
					<Button label={okText || '确定 Enter'} htmlType='sbumit' size={btnSize} width={btnSize === 'large' ? 120 : 90} />
				</div>
			)}
		</Form>
	)
}

export default class extends React.Component {
    state = {
       
    }
	enter = e => {
		const code = e.code
		if(code === 'NumpadEnter'){
			e.preventDefault()
			this.form.submit()
		}
	}
	componentDidMount(){
		window.addEventListener('keydown',this.enter)
	}
	componentWillUnmount(){
		window.removeEventListener('keydown',this.enter)
	}
	
	render(){
		const { children, data, onChange, onClose, onSubmit, btnSize, okText, modal, layout, display, width, className, scrollClassName, mb, readOnly, disabled, noholder, init } = this.props
		return (
			<SubmitForm
				className	= { className }
				data		= { data } 
				onChange	= { onChange } 
				onSubmit	= { onSubmit } 
				onClose		= { onClose } 
				init		= { form => { this.form = form; init && init(form) } }
				btnSize		= { btnSize || 'middel' }
				okText		= { okText }
				modal		= { modal }
				layout		= { layout || 'horizontal'}
				display		= { display }
				width		= { width }
				mb			= { mb || 20}
				readOnly	= { readOnly }
				disabled	= { disabled }
				noholder	= { noholder }
				scrollClassName = { scrollClassName }
			> {children} </SubmitForm>
		)
	}
}