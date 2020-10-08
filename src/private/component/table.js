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
let start = null
let end = null
const xy = function(e){
	return {
		x: e.pageX || e.x || e.screenX || e.clientX,
		y: e.pageY || e.y || e.screenY || e.clientY
	}
}
const getOffset = function(el){
	let offsetLeft = el.offsetLeft
	let parent = el.offsetParent
	while(parent){
		offsetLeft += parent.offsetLeft 
		parent = parent.offsetParent
	}
	return offsetLeft
}

let $move = null
let index = 0
// ===================================================================== Component
const Table = ({ cols, data, className, width, style, pag, onChange, loading, sort, onSort, onRow, checkbox, selectedKeys, disabledKeys }) => {
	const scrollRef = React.useRef()
	const dragRef = React.useRef()
	const [ checked, setChecked ] = React.useState()
	const [ indeter, setIndeter ] = React.useState()
	const [ result, setResult ] = React.useState([])
	const p = { current:1, total:0, pageSize:10, ...pag}
	const typeWidth = 40
	
	const move = React.useCallback( e =>{
		const { x } = xy(e)
		const $scroll = scrollRef.current
		const $fixedTable = $scroll.querySelector('.js-fixed')
		const $bodyTable = $scroll.querySelector('.js-body')
		const scrollLeft = $scroll.scrollLeft
		const $line = dragRef.current
		const scrollOffsetLeft = getOffset($scroll)
		const width = 5
		if($move){
			const offsetLeft = getOffset($move.parentNode)
			const left = getOffset($move) - getOffset($scroll)
			const _width = x - offsetLeft + scrollLeft
			$line.style.left = left + width + 1 + 'px'
			if(_width > 60){
				$fixedTable.querySelector('colgroup').children[index].width = _width + 'px'
				$bodyTable.querySelector('colgroup').children[index].width = _width + 'px'
			}
		}
	}, [])
	
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
					start = 0
					end = 0
				}
			})
			window.addEventListener('keyup',function(e){
				ctrl = null
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
			/*
			$bodyTable.style.removeProperty('width')
			$fixedTable.style.removeProperty('width')
			setTimeout(()=>{
				if($scroll.scrollWidth > $scroll.offsetWidth){
					$bodyTable.style.width = $scroll.scrollWidth + 20 + 'px'
					$fixedTable.style.width = $scroll.scrollWidth + 'px'
				}else{
					$bodyTable.style.removeProperty('width')
					$fixedTable.style.removeProperty('width')
				}
				dragRef.current.style.height =  $scroll.scrollHeight + 'px'
			},100)*/
			dragRef.current.style.height =  $scroll.scrollHeight + 'px'
		}
		resize()
		window.onresize = resize
		
		window.onmouseup = function(e){
			if(dragRef.current){
				$scroll.removeEventListener('mousemove',move)
				document.body.style.removeProperty('user-select')
				dragRef.current.style.display = 'none'
			}
		}
	},[data,selectedKeys,disabledKeys, cols, move])
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
		const select = result.filter( v => v.rowChecked)
		onRow && onRow(select)
	}, [result])
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
				}else if( len === 1){
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
	}, [result, cols, onRow])
	// 拖动单元格尺寸
	const onDrag = React.useCallback( (e,i) =>{
		e.stopPropagation()
		const { x } = xy(e)
		const $line = dragRef.current
		const $scroll = scrollRef.current
		$move = e.target
		const width = $move.offsetWidth
		document.body.style.userSelect = 'none'
		index = i
		const offsetLeft = getOffset($move)
		const scrollOffsetLeft = getOffset($scroll)
		const left = offsetLeft - scrollOffsetLeft
		$line.style.left = left + width + 1 + 'px'
		$line.style.display = 'block'
		
		$scroll.addEventListener('mousemove',move)
	}, [move])
	
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
														<th key={i} className={`${v.thCss||''}${v.align||''}`}>
															<div className='con cd' style={sortStyle} onClick={isSort ? _onSort.bind(null,v) : null}>
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
															<i className='abs_rt h' onMouseDown={e=>onDrag(e,i)} style={{width:5, cursor:'w-resize'}}></i>
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
							<i ref={dragRef} className='abs_lt h bcm i10 dn' style={{width:1, cursor:'w-resize'}}></i>
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
export default class extends React.Component{
	componentWillUnmount(){
		window.onmouseup = null
		window.onresize = null
	}
	render(){
		const { cols, data, className, width, style, pag, onChange, loading, sort, onSort, onRow, checkbox, selectedKeys, disabledKeys } = this.props
		return <Table 
			cols = { cols }
			data = { data }
			className = { className }
			width = { width }
			style = { style }
			pag = { pag }
			onChange = { onChange }
			loading = { loading }
			sort = { sort }
			onSort = { onSort }
			onRow = { onRow }
			checkbox = { checkbox }
			selectedKeys = { selectedKeys }
			disabledKeys = { disabledKeys }
		/>
	}
}