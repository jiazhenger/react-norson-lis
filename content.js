import React from 'react'
// =====================================================================
const { $fn } = window
// =====================================================================
const Fv = ({ className, header, footer, scrollClass, children }) => (
	<Content y={false} className={`fv ${ $fn.css(className) }`}>
	
		{ header && header }
		
		<section className='rel ex'>
			<Content className={ $fn.css(scrollClass) }>
				{ children }
			</Content>
		</section>
		
		{ footer && footer }
	</Content>
)
// =====================================================================
export default class Content extends React.Component{
	static Fv = <Fv {...this.props} />
	render(){
		const { id, className, style, children, onClick, x, y, xy } = this.props
		let scroll = 'oys'
		if(x){ scroll = 'oxs' }
		if(y){ scroll = 'oys' }
		if(xy){ scroll = 'oxys' }
		scroll = y === false ? '' : scroll + ' scrollbar'
		return (
			<div 
				id 			={ id } 
				className	={ `abs_full ${scroll} ${ $fn.css(className, 'bcb') }` }
				style		={ style } 
				onClick		={ onClick }
			>
				{children}
			</div>
		)
	}
}