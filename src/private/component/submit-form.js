import React from 'react'
// ===================================================================== global antd

// ===================================================================== global declare
const { $async } = window
// ===================================================================== global antd
const Form = $async(()=>import('@antd/form/form'))
const Item = $async(()=>import('@antd/form/item'))
const Button = $async(()=>import('@antd/button'))
const Input = $async(()=>import('@antd/form/input'))
const Select = $async(()=>import('@antd/form/select'))
const DatePicker = $async(()=>import('@antd/form/datePicker'))
// =====================================================================
const size = 'middle'

const SubmitForm = ({ children, data, onSubmit, onClose, init, btnSize, okText, modal }) => {
	const [ form, setForm ] = React.useState()
	
	const _init = React.useCallback( v => {
		setForm(v)
		data.forEach(m=>{
			v.setFieldsValue({ [m.name] : m.value })
		})
		init && init(v)
	},[data, init])
	
	return (
		<Form layout='horizontal' onSubmit={onSubmit} init={_init} className='submit-form small-form fv ex'>
			<div className='ex rel'>
				<div className={modal?'':'abs_full oys scrollbar'}>
					<div className='fxw'>
						{
							data.map((v,i)=>{
								const { type, value, label, data, name, format } = v
								const width = v.width || (modal ? 180 : 190)
								const mr = 0
								let children = <Input size={size} p={`请输入` + label} width={width}/>
								if( type === 'select'){
									children = <Select size={size} data={data} p={`请选择` + label} value={value} nameStr={v.nameStr} idStr={v.idStr} width={width} auto onChanged={v=>form.setFieldsValue({ [name]:v })}/> 
								}else if(type === 'date-range'){
									children = <DatePicker size={size} width={width*2} range showTime value={value} format={format}/>
								}else if(type === 'date-time'){
									children = <DatePicker size={size} width={width} value={value} showTime format={format} after={v.after}/>
								}else if(type === 'textarea'){
									children = <Input size={size} p={`请输入` + label} mode='textarea'/>
								}
								return (
									<React.Fragment key={i}>
										{ v.title && <h6 className='w xmlr h40 bbor1 mb10'>{v.title}</h6> }
										<Item label={label} name={name} full={v.full} mb={20} rules={[{ required: v.required }]}>
											{children}
										</Item>
									</React.Fragment>
								)
							})
						}
					</div>
				</div>
			</div>
			<div className={`fxmc ${modal ? 'mt20' : ' tbor1 ptb10'}`}>
				<Button label='取消' ghost className='mr15' size={btnSize} width={btnSize === 'large' ? 120 : 90} onClick={onClose} />
				<Button label={okText || '确定 Enter'} htmlType='sbumit' size={btnSize} width={btnSize === 'large' ? 120 : 90} />
			</div>
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
		const { children, data, onClose, onSubmit, btnSize, okText, modal } = this.props
		return (
			<SubmitForm
				data		= { data} 
				onSubmit	= { onSubmit } 
				onClose		= { onClose } 
				init		= { form => this.form = form }
				btnSize		= { btnSize || 'middel' }
				okText		= { okText }
				modal		= { modal }
			> {children} </SubmitForm>
		)
	}
}