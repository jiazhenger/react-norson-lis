import React from 'react'
// ===================================================================== global template
const { $async } = window
const Page = $async(()=>import('#tp/content/content-aside'))
const Wraper = $async(()=>import('#tp/box/wraper'))
// =====================================================================
export default ({ children}) => {
	return (
		<Page>
			<Wraper>
				{children}
			</Wraper>
		</Page>
	)
}