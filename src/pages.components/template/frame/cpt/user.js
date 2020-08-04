/* ====================================== toast  ====================================== */
import React from 'react'
// ===================================================================== public component
import Image from '@base/image'
import Confirm from '@plugin/antd/confirm'
// ===================================================================== antd component
import { Dropdown, Menu, message } from 'antd'
import { RightOutlined, DownOutlined } from '@ant-design/icons'
// ===================================================================== global
const $fn = window.$fn
const $http = window.$http
// ===================================================================== List component
// ===================================================================== Component
export default ({ history }) => {
	const [ data, setData] = React.useState([])
	const [ loading, setLoading] = React.useState()
	const [ visible, setVisible] = React.useState()
	React.useEffect(()=>{
		const user = $fn.getUser()
		const token = $fn.getToken()
		const t = token ? { token } : {}
		if(user.userName !== undefined){
			setData(user)
		}else{
			$http.pull(null,'loginController/testGetUserSession').then(data=>{
				$fn.local('user',{...user,...data,...t})
				setData(data)
			})
		}
	},[])
	
	const onLogout = React.useCallback(()=>{
		$http.pull(null,'loginController/loginOut',{ loading:false, onStart:b=>setLoading(b), onEnd:b=>setLoading(b) }).then(data=>{
			message.success('退出登录成功')
			$fn.remove()
			history.replace('/login')
		})
	},[history])
	
	const menu = (
		<Menu>
			<dl style={{minWidth:'150px'}}>
				<dt className='h40 plr10 hover cp fxmj g6 bbor1 omit'><i>切换学校</i><RightOutlined /></dt>
				<dd className='h40 plr10 hover cp tc' onClick={()=>confirmRef.current.open()}>退出登录</dd>
			</dl>
		</Menu>
	)
	
	const onVisibleChange = React.useCallback( v => setVisible(v), [])
	
	const confirmRef = React.useRef()
	return (
		<>
			<Dropdown
				overlay			= { menu }
				placement		= 'bottomRight'
				onVisibleChange = { onVisibleChange }
			>
				<div className={`fxm cp hover ${visible?'up c0':''}`}>
					<Image.Center src={data.headImg} width='40px' />
					<h6 className='mlr5'>{$fn.val(data.userName)}</h6>
					<DownOutlined />
				</div>
			</Dropdown>
			<Confirm msg='退出登录?' loading={loading} ref={confirmRef} onOk={onLogout} noClose />
		</>
	)
}
