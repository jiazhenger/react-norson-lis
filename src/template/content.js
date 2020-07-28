/* ====================================== 滚动条  ====================================== */
import React from 'react'
import Content from '@cpx/content'
// =====================================================================
export default ({ id, className, style, children, onClick, scrollY, scrollX, scrollXY, isPage, pageClass, wraperStyle, title, subTitle, headerSuffix, isFull }) => {
	return (
		<Content xy>
			<section
				style={{padding:`${title?'0':'15px'} 15px 15px`,minWidth:'1000px',minHeight:'800px',...wraperStyle}} 
				className={`${pageClass||''} ${isFull?'h':''}`}
			>
				{
					title && (
						<header className='h50 fxm'>
							<div className='ex fx'>
								<h2 className='b f18'>{title}</h2>
								<div className='f16'>{subTitle}</div>
							</div>
							{ headerSuffix }
						</header>
					)
				}
				
				{children}
			</section>
		</Content>
	)
}