/* ====================================== toast  ====================================== */
import React from 'react'
import { Upload, message, Button } from 'antd'
import { PlusOutlined, LoadingOutlined, UploadOutlined } from '@ant-design/icons'
// ===================================================================== function
// ===================================================================== 
export default ({ className, title, children, fileType, mode, onChange, name, value })=> {
	const [ loading, setLoading ] = React.useState( false );
	const [ img, setImg ] = React.useState(value);
	// 当选择图片时
	const onSelect = React.useCallback(( { file, fileList } )=>{
	    const status = file.status
	    if( status === 'uploading' ){
	    	setLoading(true)
	   		return;
	    }else if( status === 'done' ){
	    	message.success(`${file.name} 文件上传成功!`)
	    	const imageUrl = file.response.data.path
	    	setImg(imageUrl)
	    	onChange && ( name ? onChange({[name]:imageUrl}) : onChange(imageUrl))
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
	
	return (
		<Upload
			name 			= 'Filedata'
	        listType		= { listType }
	        showUploadList	= { false }
	        beforeUpload	= { beforeUpload }
	        onChange	 	= { onSelect }
	        action 			= { window.$config.api+'v1/rest/file/uploadOSS' }
		>
			{
				!mode && (img ? <img src={img} alt='avatar' style={{ maxWidth: '100%',display:'inline-block' }} /> : <PlusComponent/>)
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
