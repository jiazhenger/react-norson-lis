import React from 'react'
// ===================================================================== global template
const { $async } = window
const Page = $async(()=>import('#tp/content/content-aside'))
const Container = $async(()=>import('#tp/box/container'))
// =====================================================================
export default ({ children, title, titleChildren, ButtonGroup, nobc, noBtGroup, className }) => {
	return (
		<Page>
			<Container title={title} ButtonGroup={ButtonGroup} titleChildren={titleChildren} nobc={nobc} noBtGroup={noBtGroup} className={className}>
				{children}
			</Container>
		</Page>
	)
}