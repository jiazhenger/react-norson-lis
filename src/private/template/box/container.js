import React from 'react'
// ===================================================================== global template

const Header = ({ title, children }) => (
	<header className='h40 bbor1 plr10'>
		<h2 className='b'>{title}</h2>
	</header>
)

// =====================================================================
export default ({ children, title }) => {
	return (
		<div className={`bcf wh fv r5px`}>
			{
				title && <Header title={title} />
			}
			{children}
		</div>
	)
}