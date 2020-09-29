/* ====================================== toast  ====================================== */
import React from 'react'
// ===================================================================== antd
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import Loading from '@antd/loading'
// ===================================================================== declare
const { $fn, $async } = window
const Pagination = $async(()=>import('@antd/pagination'))
const Empty = $async(()=>import('@antd/empty'))
// ===================================================================== Component
export default ({ cols, data, className, width, style, pag, onChange, loading, sort, onSort }) => {
	const scrollRef = React.useRef()
	const p = { current:1, total:0, pageSize:10, ...pag}
	
	React.useEffect(()=>{
		const $scroll = scrollRef.current
		const $fixedTable = $scroll.querySelector('.js-fixed')
		const $bodyTable = $scroll.querySelector('.js-body')
		const resize = function(){
			if($scroll.scrollHeight > 0){
				$scroll.onscroll = function(e){
					const { scrollTop } = this
					this.querySelector('.js-fixed').style.top = scrollTop + 'px'
					if(scrollTop>0){
						$fixedTable.style.boxShadow = '0 3px 5px #eee'
						$fixedTable.style.borderBottom = '2px solid ' + $fn.c0
					}else{
						$fixedTable.style.removeProperty('box-shadow')
						$fixedTable.style.removeProperty('border-bottom')
					}
				}
			}else{
				$scroll.onscroll = null
			}
			$bodyTable.style.removeProperty('width')
			$fixedTable.style.removeProperty('width')
			setTimeout(()=>{
				if($scroll.scrollWidth > $scroll.offsetWidth){
					$bodyTable.style.width = $scroll.scrollWidth + 10 + 'px'
					$fixedTable.style.width = $scroll.scrollWidth + 'px'
				}else{
					$bodyTable.style.removeProperty('width')
					$fixedTable.style.removeProperty('width')
				}
			},100)
		}
		resize()
		window.onresize = resize
	},[])
	// 排序
	const _onSort = React.useCallback(v=>{
		let type = null
		let order = v.order
		
		cols.forEach(v=>{
			if(v.order !== undefined){
				delete v.order
			}
		})
		if(order === undefined){
			v.order = true
			type = 1
		}else if(order === true){
			v.order = false
			type = 2
		}
		const param = type ? {sort:v.field,  sort_type: type} : null
		onSort && onSort(param)
	}, [cols, onSort ])
	return (
		<div className={`fv rel ex ${className||''}`}>
			<div className='norson-table ex fv oxys scrollbar rel' style={style} ref={scrollRef}>
				{
					$fn.hasArray(cols) ? (
						<>
							<div className='thead rel bcf i10'>
								<table className='js-fixed abs_lt bcf'>
									<colgroup>
										{
											cols.map( (v,i) => <col key={i} width={v.width} /> )
										}
									</colgroup>
									<thead>
										<tr>
											{
												cols.map( (v,i) => {
													const isSort = v['field'] && (sort||v.sort)
													const sortStyle = isSort ? {paddingRight: 8} : null
													return (
														<th key={i} className={`${v.thCss||''}${v.align||''}`} onClick={isSort ? _onSort.bind(null,v) : null}>
															<div className='con cd' style={sortStyle}>
																{v['title']}
																{
																	isSort && (
																		<div className='abs_rt fxm lh' style={{right:5}}>
																			<div className='rel'>
																				<div className='rel' style={{top:2}}><CaretUpOutlined style={{color:v.order===true?$fn.c0:'#999'}} /></div>
																				<div className='rel' style={{top:-2}}><CaretDownOutlined style={{color:v.order===false?$fn.c0:'#999'}} /></div>
																			</div>
																		</div>
																	)
																}
															</div>
														</th>
													)
												} )
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
					) : null
				}
			</div>
			{
				pag && data.length > 0 ? (
					<Pagination
						size				= 'small'
						pag					= { p }
						onChange			= { (current, pageSize) =>{ onChange && onChange(current, pageSize) } }
					/>
				) : null
			}
			<Empty loading={loading} data={data} />
			<Loading loading={loading} />
		</div>
	)
}
