import React from 'react'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== antd
const Input = $async(()=>import('@antd/form/input'))
// ===================================================================== component
const Button = $async(()=>import('@antd/button'))
const BoxScroll = $async(()=>import('#tp/box/box-scroll'))
// ===================================================================== component
const Title = ({ title }) => (
	<h3 className='fxm h40'><i className='r100px mr5' style={{width:5,height:5,background:'#333'}}></i><span>{title}</span></h3>
)
// ===================================================================== component
export default ({ data, cols }) => {
	return (
		<BoxScroll 
			className	= 'fv' 
			title		= '图形与解释'
			style		= {{width:350}}
			titleChildren = {
				<div className='fxm' >
					<Button label='取消' ghost />
					<Button label='保存' className='ml10' />
				</div>
			}
		>
			<Title title='结果2' />
			<Input size='middle' bordered={false} />
			<Title title='建议与解释（手动）' />
			<Input size='middle' mode='textarea' bordered={false} />
			<p className='g9 lh20'>(使用向下" ↓ "箭头自动搜索)</p>
			<Title title='临床建议' />
			<Input size='middle' mode='textarea' bordered={false} />
		</BoxScroll>
	)
}