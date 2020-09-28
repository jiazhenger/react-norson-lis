/* ====================================== toast  ====================================== */
import React from 'react'
import { Pagination } from 'antd'
// ===================================================================== declare
const { $fn } = window
// ===================================================================== Component
export default ({ cols, data, className, width, style, pag, onChange, onSizeChange, loading }) => {
	const scrollRef = React.useRef()
	const p = { current:1, total:0, pageSize:10, ...pag}
	
	React.useEffect(()=>{
		const $scroll = scrollRef.current
		const $fixedTable = $scroll.querySelector('.js-fixed')
		const $bodyTable = $scroll.querySelector('.js-body')
		$scroll.onscroll = function(e){
			console.log(this.scrollTop)
			this.querySelector('.js-fixed').style.top = this.scrollTop + 'px'
		}
		setTimeout(()=>{
			$bodyTable.style.width = $scroll.scrollWidth + 20 + 'px'
			$fixedTable.style.width = $scroll.scrollWidth + 20 + 'px'
		},100)
	},[])
	return (
		<div className={`fv ex ${className||''}`}>
			<div className='norson-table ex fv oxys scrollbar rel' style={style} ref={scrollRef}>
				{
					$fn.hasArray(cols) && (
						<>
							<div className='thead h30 rel bcf i10'>
								<table className='js-fixed abs_lt bcf'>
									<colgroup>
										{
											cols.map( (v,i) => <col key={i} width={v.width} /> )
										}
									</colgroup>
									<thead>
										<tr>
											{
												cols.map( (v,i) => (
													<th key={i} className={`h30 ${v.thCss||''}${v.align||''}`}>
														<div className='con'>{v['title']}</div>
													</th>
												) )
											}
										</tr>
									</thead>
								</table>
							</div>
							<div className='tbody ex rel'>
								<div className='abs h' style={{top:0,bottom:0}}>
									<table className='js-body'>
										<colgroup>
											{
												cols.map( (v,i) => <col key={i} width={v.width} /> )
											}
										</colgroup>
										<tbody>
											{
												$fn.hasArray(data) && data.map( (p,j) => (
													<tr key={j}>
														{
															cols.map( (v,i) => (
																<td key={i} className={`${v.tdCss||''}${v.align||''}`}>
																	<div className='con'>
																		{
																			v['render'] ? v['render']({ text:$fn.isValid(p[v['field']]) ? p[v['field']] : <span className='g9'>--</span>, rows: p }) : $fn.isValid(p[v['field']]) ? p[v['field']] : <span className='g9'>--</span>
																		}
																	</div>
																</td>
															) )
														}
													</tr>
												))
											}
										</tbody>
									</table>
								</div>
							</div>
						</>
					)
				}
			</div>
			{
				pag && data.length > 0 ? (
					<div className='fxj tbor1' style={{padding:'10px 0'}}>
						<div className='g6'>共 {p.total} 条数据</div>
						<Pagination
							size				= 'small'
							current				= { p.current } 
							total				= { p.total }
							pageSize			= { p.pageSize }
							onChange			= { page =>{ onChange && onChange( page ) } }
							showQuickJumper		= { true }
							onShowSizeChange 	= { (current, size) =>{ onSizeChange && onSizeChange( current, size ) } }
							showSizeChanger 	= { true }
						/>
					</div>
				) : null
			}
		</div>
	)
}
