import React from 'react'
// ===================================================================== antd
import { Tabs, Pane } from '@antd/tabs'
// ===================================================================== global declare
const { $fn, $async } = window
// ===================================================================== global template
// ===================================================================== component
export default ({ children, data, onTabs }) => {
	const onChange = React.useCallback( index =>{
		const _data = data[index]
		onTabs && onTabs(_data, index)
	},[ data, onTabs])
	return (
		<div className='only-tabs'>
			<Tabs onChange={onChange}>
				{
					$fn.hasArray(data) && data.map((v,i)=><Pane tab={v.title} key={i}></Pane>)
				}
			</Tabs>
		</div>
	)
}