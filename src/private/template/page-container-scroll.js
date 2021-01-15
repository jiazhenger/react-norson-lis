import React from 'react'
// ===================================================================== global template
const { $async } = window
const Page = $async(()=>import('#tp/content/content-aside'))
const Container = $async(()=>import('#tp/box/container'))
const Content = window.$async(()=>import('@tp/content'))
// =====================================================================
export default ({ children, title, titleChildren, ButtonGroup, nobc, noBtGroup, className, header }) => {
	return (
		<Page>
			<Container title={title} ButtonGroup={ButtonGroup} titleChildren={titleChildren} nobc={nobc} noBtGroup={noBtGroup}>
				{ header && header }
				<div className='ex rel'>
					<Content scrollY  className={className}>
						{children}
					</Content>
				</div>
			</Container>
		</Page>
	)
}