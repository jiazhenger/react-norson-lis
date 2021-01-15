// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== image
import FCL from '@img/FCL.png'
import Part from '@img/Part.png'
// ===================================================================== global declare
const { $async } = window
// ===================================================================== antd
// const Button = $async(()=>import('@antd/button'))
// const Checkbox = $async(()=>import('@antd/form/checkbox')) 
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
// const SearchForm = $async(()=>import('#cpt/search-form'))
// ===================================================================== 缓存
// const cacheApi = import('@/private/api/cacheApi')

// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[],  
		key: 0, 
	} 
	model = {}
	componentDidMount(){ 
	}  
	// 选择全部 
	render(){ 
			return (
			<Page title='标本箱转移'>
				<div className='tc'>
					<div>
						<p className='f28 b' style={{marginTop: '83px', marginBottom: '22px'}}>选择转箱模式</p>
						<div className='f14' style={{color: '#2cd1d2', width: '365px', margin: '0 auto'}}>请在标本箱转移菜单下选择标本箱转移模式。整箱转移时只需要扫描旧标本箱条码与新标本箱条码即可。</div>
					</div>
					<div className='fxmj' style={{width: '480px', margin: '65px auto', color: '#ffffff'}}>
						<div className='r10px tc' style={{height: '200px', width: '200px', background: 'linear-gradient(#dff8f8, #2cd1d2)'}} onClick={() => {
							window.$fn.push(this, window.$fn.getRoot().root + 'lgistics-page/box-transfer/full-transfer')
						}}>
							<img className='dk' style={{marginTop: '50px'}} src={FCL} alt="整箱转移" />
							<p className='lh40'>整箱转箱</p>  
						</div>
						<div className='r10px tc' style={{height: '200px', width: '200px', background: 'linear-gradient(#dff8f8, #2cd1d2)'}} onClick={() => {
							window.$fn.push(this, window.$fn.getRoot().root + 'lgistics-page/box-transfer/part-transfer')
						}}>
							<img className='dk' style={{marginTop: '50px'}} src={Part} alt="部分转移" />
							<p className='lh40'>部分转箱</p>
						</div>
					</div>
				</div>
            </Page>
		)
	}
}