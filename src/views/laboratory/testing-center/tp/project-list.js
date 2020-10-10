import React from 'react'
// ===================================================================== antd

// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== component
// ===================================================================== private template
const Box = $async(()=>import('#tp/box/box'))
const Table = $async(()=>import('#cpt/table'))
// ===================================================================== component
export default ({ data, cols }) => {
	return (
		<Box 
			className	= 'ex fv' 
			title		= '项目列表'
			titleChildren = {
				<div className='fx b'>
					<div><span>资料待审核</span></div>
					<div className='ml15'><span>已转外包</span></div>
					<div className='mlr15'><span>敏感词</span></div>
					<div><span>阳性</span></div>
				</div>
			}
			onSetHeader = {()=>{}}
		>
			<div className='h10'></div>
			<div className='ex fv xplr'>
				<Table data={data} cols={cols} />
			</div>
		</Box>
	)
}