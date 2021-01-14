/* ====================================== toast  ====================================== */
import React from 'react'
import { Upload, message, Button } from 'antd'
import { PlusOutlined, LoadingOutlined, UploadOutlined } from '@ant-design/icons'
const { $fn } = window
// ===================================================================== function
// ===================================================================== 
/**
	 * 薛 2020-10-28 更新
	 * @param {api} 上传地址
	 * @param {params} 额外参数
	 * @param {multiple} 是否上传多个
	 **/
export default ({ className, title, children, fileType, mode, onChange, name, value, api, params, multiple })=> {
	const [ loading, setLoading ] = React.useState( false );
	const [ img, setImg ] = React.useState();
	// 当选择图片时
	const onSelect = React.useCallback(( { file, fileList } )=>{ 
	    const status = file.status
	    if( status === 'uploading' ){
	    	setLoading(true)
	   		return;
	    }else if( status === 'done' ){
	    	message.success(`${file.name} 文件上传成功!`)
	    	// const imageUrl = file.response.data.path
			const imageUrl = file.response.data 
			if (!multiple) {
				let path = ''
				if ($fn.hasArray(file.response.data)) {
					path = file.response.data[0].img_path
					setImg(path)
				}
				onChange && ( name ? onChange({[name]:path}) : onChange(path))
			} else {
				onChange && ( name ? onChange({[name]:imageUrl}) : onChange(imageUrl))
			}
	    	setLoading(false)
	    }else if( status === 'error' ){
	    	message.error(`${file.name} 文件上传失败!`)
	    	setLoading(false)
	    }
	},[onChange,name])
	
	React.useEffect(()=>{
		if(value) setImg(value)
	},[value])
	
	
	const PlusComponent = () => <>
		{
			loading ? <LoadingOutlined className='f30' /> : <PlusOutlined className='f30'/>
		}
	</>
	
	// 上传图片之前验证
	const beforeUpload = React.useCallback((file)=>{
		if(fileType === 'excel'){
			
		}else{
			const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
			if (!isJpgOrPng) {
				message.error('只能上传 jpg/png 格式图片文件!');
			}
			const isLt2M = file.size / 1024 / 1024 < 2;
			if (!isLt2M) {
				message.error('图片必必须小于 2M!');
			}
			return isJpgOrPng && isLt2M
		}
		
	},[fileType])
	let listType = 'picture-card'
	if(mode === 'button'){ listType='' }

	const headers = {
		Authorization: "Bearer " + window.$fn.getToken()
	}
	const img_domain = $fn.local('user') ? $fn.local('user').img_domain : ''
	return (
		<Upload
			name 			= 'Filedata'
	        listType		= { listType }
	        showUploadList	= { false }
	        beforeUpload	= { beforeUpload }
	        onChange	 	= { onSelect }
			action 			= { window.$config.api + (api || 'upload/img')}
			data            = { params }
			headers         = { headers }
			multiple        = { multiple ? multiple : false }
		>
			{
				!mode && (img ? <img src={img_domain + img} alt='avatar' style={{ maxWidth: '100%',display:'inline-block' }} /> : <PlusComponent/>)
			}
			{
				mode === 'button' && <>
					<Button>
						{ loading ? <LoadingOutlined className='f14' /> : <UploadOutlined /> }
						<span>{img?'上传成功':'上传'}</span>
					</Button>
					<span></span>
				</>
			}
		</Upload>
	)
}
