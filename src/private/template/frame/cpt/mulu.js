/* ====================================== toast  ====================================== */
import React from 'react'
// ===================================================================== antd component
import { Dropdown, Menu } from 'antd'
import { AppstoreFilled } from '@ant-design/icons'
// ===================================================================== global
const $fn = window.$fn
const $http = window.$http
// ===================================================================== List component
const style={padding:'8px 15px'}
const List = ({ data }) => {
	const onClick = React.useCallback( v => {
		console.log(v)
	},[])
	return (
		<dl className='ex'>
			<dt className='omit b' style={style}>{$fn.val(data.title)}</dt>
			{
				$fn.hasArray(data.list) && data.list.map((v,i) => (
					v.id !== 272 && <dd key={i} className='omit cp hover-bc tap' style={style} onClick={onClick.bind(null,v)}>{$fn.val(v.menuName)}</dd>
				))
			}
		</dl>
	)
}
// ===================================================================== component
export default () => {
	const [ data, setData] = React.useState([])
	React.useEffect(()=>{
		const mulu = $fn.local('mulu')
		if($fn.hasArray(mulu)){
			setData(mulu)
		}else{
			$http.pull(null,'loginController/getMenuListMain').then(data=>{
				$fn.local('mulu',data)
				setData(data)
			})
		}
	},[])
	
	const menu = (
		<Menu>
			<section style={{minWidth:'700px'}}>
				<header className='h40 xplr b bbor1 cp tap hover-bc'>首页</header>
				<div className='fx'>
					{
						$fn.hasArray(data) && data.map((v,i)=> <List key={i} data={v}/>)
					}
				</div>
			</section>
		</Menu>
	)
	
	return (
		<Dropdown
			overlay		= { menu }
			placement	= 'bottomCenter'
		>
			<h3 className='c0 cp fxm'><AppstoreFilled /><span style={{marginLeft:'2px'}}>目录</span></h3>
		</Dropdown>
	)
}
