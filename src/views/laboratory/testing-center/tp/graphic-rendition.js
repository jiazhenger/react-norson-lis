import React from 'react'
// ===================================================================== antd

// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== component
const Button = $async(()=>import('@antd/button'))
const Box = $async(()=>import('#tp/box/box'))
// ===================================================================== component
export default ({ data, cols }) => {
	return (
		<Box 
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
			<div className='ex rel'>
				<div className='abs_full xplr oys scrollbar'>
					
				</div>
			</div>
		</Box>
	)
}