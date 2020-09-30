/* ====================================== toast  ====================================== */
import React from 'react'
// ===================================================================== antd
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import Loading from '@antd/loading'
// ===================================================================== declare
const { $fn, $async } = window
const Pagination = $async(()=>import('@antd/pagination'))
const Empty = $async(()=>import('@antd/empty'))
const Checkbox = $async(()=>import('@antd/form/checkbox'))

let ctrl = null
let index = null
let start = null
let end = null
// ===================================================================== Component
export default ({ cols, data, className, width, style, pag, onChange, loading, sort, onSort, onRow, checkbox, selectedKeys, disabledKeys }) => {
	const scrollRef = React.useRef()
	const [ checked, setChecked ] = React.useState()
	const [ indeter, setIndeter ] = React.useState()
	const [ result, setResult ] = React.useState([])
	// const [ select, setSelect ] = React.useState([])
	// const [ disabled, setDisabled ] = React.useState([])
	const p = { current:1, total:0, pageSize:10, ...pag}
	const typeWidth = 40
	React.useEffect(()=>{
		const { type } = cols[0]
		// 默认禁用
		if($fn.hasArray(disabledKeys)){
			data.forEach(v=>{
				disabledKeys.forEach(m=>{
					if(+v.id === m){
						v.rowDisabled = true
					}
				})
			})
		}
		// 默认选中
		if($fn.hasArray(selectedKeys)){
			data.forEach(v=>{
				selectedKeys.forEach(m=>{
					if(+v.id === m){
						v.rowChecked = true
					}
				})
			})
		}
		// 多选
		if(type === 'checkbox'){
			window.addEventListener('keydown',function(e){
				if(e.ctrlKey){ 
					ctrl = true
					index = 0
					start = 0
					end = 0
				}
			})
			window.addEventListener('keyup',function(e){
				ctrl = null
				index = null
				start = null
				end = null
				// data.forEach(v=>{ if(v.rowsStart){ delete v.rowsStart} })
				// setResult([...data])
			})
		}
		setResult([...data])
		setChecked(false)
		setIndeter(false)
		// 控制滚动条
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
	},[data,selectedKeys,disabledKeys])
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
	// 选择全部
	const onSelectALL = React.useCallback( e =>{
		const checked = e.target.checked
		setIndeter(false)
		setChecked(checked)
		result.forEach( v => {
			if(!v.rowDisabled){
				v.rowChecked = checked
			}
		} )
		setResult([...result])
	})
	// 点击横排
	
	const _onRow = React.useCallback( (rows, i) =>{
		if(rows.rowDisabled) return;
		const { type } = cols[0]
		if( type === 'checkbox'){
			if(ctrl){
				const filter = result.filter(v => v.rowsStart)
				const len = filter.length
				if(len === 0){
					rows.rowsStart = true
					start = i
				}else if( len == 1){
					end = i
					const _start = end > start ? start : end
					const _end = end > start ? end : start
					result.forEach((v,i)=>{
						if( i >= _start && i <= _end){
							if(!v.rowDisabled){
								v.rowChecked = !v.rowChecked
							}
						}
						delete v.rowsStart
					})
				}
			}else{
				rows.rowChecked = !rows.rowChecked
				const select = result.filter( v => v.rowChecked)
				const dis = result.filter( v => {
					delete v.rowsStart
					return v.rowDisabled
				})
				const dataLenth = result.length - dis.length
				setChecked(select.length === dataLenth)
				setIndeter(select.length !== dataLenth && select.length !== 0)
				onRow && onRow(select)
			}
		}else{
			result.forEach(v=>{
				if(v.rowChecked){
					delete v.rowChecked
				}
			})
			rows.rowChecked = !rows.rowChecked
			onRow && onRow(rows)
		}
		setResult([...result])
	}, [result])
	return (
		<div className={`fv rel ex ${className||''}`}>
			<div className='norson-table ex fv oxys scrollbar rel' style={style} ref={scrollRef}>
				{
					$fn.hasArray(cols) ? (
						<>
							{/* 表头 */}
							<div className='thead rel bcf i10'>
								<table className='js-fixed abs_lt bcf'>
									<colgroup>
										{
											cols.map( (v,i) => <col key={i} width={v.type ? typeWidth : v.width} /> )
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
																{
																	v.type==='checkbox' ? <div className='fxmc'><Checkbox indeter={indeter} value={checked} outer onChange={onSelectALL} /></div> : (
																		<>
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
																		</>
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
							{/* 表体 */}
							<div className='tbody ex rel'>
								<div className='abs h' style={{top:0,bottom:0}}>
									<table className='js-body'>
										<colgroup>
											{
												cols.map( (v,i) => <col key={i} width={v.type ? typeWidth : v.width} /> )
											}
										</colgroup>
										<tbody>
											{
												$fn.hasArray(result) && result.map( (p,j) => (
													<tr key={j} onClick={_onRow.bind(null, p, j)} className={`${p.rowChecked ? 'checked' : ''} ${p.rowDisabled?'disabled':''} ${p.rowsStart?'start':''}`}>
														{
															cols.map( (v,i) => {
																return (
																	<td key={i} className={`${v.tdCss||''}${v.align||''}`}>
																		{
																			v.type ? <div className='fxmc'><Checkbox value={p.rowChecked} disabled={p.rowDisabled} outer/></div> : (
																				<div className='con'>
																					{
																						v['render'] ? v['render']({ text:$fn.isValid(p[v['field']]) ? p[v['field']] : <span className='g9'>--</span>, rows: p }) : $fn.isValid(p[v['field']]) ? p[v['field']] : <span className='g9'>--</span>
																					}
																				</div>
																			)
																		}
																	</td>
																)
															} )
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
			{/* 分页 */}
			{
				pag && result.length > 0 ? (
					<Pagination
						size				= 'small'
						pag					= { p }
						onChange			= { (current, pageSize) =>{ onChange && onChange(current, pageSize) } }
					/>
				) : null
			}
			{/* 空数据 */}
			<Empty loading={loading} data={result} />
			{/* 加载效果 */}
			<Loading loading={loading} />
		</div>
	)
}
