import React from 'react'
/* ====================================== 虚拟表格  ====================================== */
const Index = ({ data, child }) => {
	const scrollRef = React.useRef()
	const [ offset, setOffset ] = React.useState(0)
	const [ result, setResult ] = React.useState([])
	
	const headHeight = 32	
	const rowHeight = 32
	let screenHeight = 0    // 可视区域高度
	let start = 0           // 起始索引
	let end = null          // 结束索引
	let visibleCount = 0	// 容器显示节点数量
	
	// 页面数据初始化
	const init = React.useCallback(()=>{
		const $scroll = scrollRef.current
		screenHeight = $scroll.clientHeight
		start = 0
		// 这里的截取结束位置需要根据开始位置和首屏显示的条数来确定
		visibleCount = (screenHeight - headHeight)  / rowHeight
		end = start + visibleCount
	}, [])
	
	React.useEffect(()=>{
		init()
	},[])
	
	
	const scrollEvent = React.useCallback(()=>{
		const $scroll = scrollRef.current
		const { scrollTop  } = $scroll // 当前滚动位置
		start = Math.floor(scrollTop / rowHeight)   // 此时的开始索引
		
		end = start + visibleCount  // 此时的结束索引
		
		setOffset(scrollTop - (scrollTop % rowHeight)) // 滚动时列表盒子的偏移量
		
		const _data = Array.isArray(data) && data.length > 0 ? data.slice(start, Math.min(end, data.length)) : [],
		
		console.log(_data)
		
		setResult(_data)
	},[ data ])
	
	return (
		<div name='虚拟滚动盒子' className='norson-table ex fv oxys scrollbar rel' ref={scrollRef} onScroll={scrollEvent}>
		    <div name='占位盒子'  style={{ height: data.length * rowHeight, position:'absolute',left:0,top:0,right:0, zIndex:-1 }}></div>
		    <div name='计算内容盒子' style={{ transform:`translate3d(0, ${offset}px, 0)`, position:'absolute', left:0, top:0, right:0 }}>
				<child data={result} />
		    </div>
		</div>
	)
}
export default Index
