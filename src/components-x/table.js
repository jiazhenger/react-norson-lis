/* ====================================== toast  ====================================== */
import React from 'react'
// ===================================================================== 
const $fn = window.$fn
export default ({ columns, data, className, width, style }) => (
	<div className={`ub-table ${className||''}`} style={style}>
		{
			$fn.hasArray(columns) ? [
				<div className='thead' key='thead'>
					<table>
						<colgroup>
							{
								columns.map( (v,i) => <col key={i} width={v.width} /> )
							}
						</colgroup>
						<thead>
							<tr>
								{
									columns.map( (v,i) => <th key={i} className={v.thCss||''}>{v['title']}</th> )
								}
							</tr>
						</thead>
					</table>
				</div>,
				<div className='tbody' key='tbody'>
					<table>
						<colgroup>
							{
								columns.map( (v,i) => <col key={i} width={v.width} /> )
							}
						</colgroup>
						<tbody>
							{
								$fn.hasArray(data) && data.map( (p,j) => (
									<tr key={j}>
										{
											columns.map( (v,i) => (
												<td key={i} className={v.tdCss||''}>
													{
														v['render'] ? v['render']({ text:$fn.isValid(p[v['index']]) ? p[v['index']] : '--', rows: p }) : ($fn.isValid(p[v['index']]) ? p[v['index']] : '--')
													}
												</td>
											) )
										}
									</tr>
								))
							}
						</tbody>
					</table>
				</div>
			]: null
		}
	</div>
)
