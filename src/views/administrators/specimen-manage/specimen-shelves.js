// ===================================================================== 薛玉梅 | 2020-10-13 | 新增文件
import React from 'react'
// ===================================================================== global declare
const { $async } = window
// ===================================================================== antd
// ===================================================================== private template
const Page = $async(()=>import('#tp/page-container'))
// ===================================================================== private component
const SpecimenShelvesComplete = $async(()=>import('@views/administrators/specimen-manage/specimen-shelves-complete'))
const SpecimenShelvesEnter = $async(()=>import('@views/administrators/specimen-manage/specimen-shelves-enter'))
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		pag: {},
		selectedKeys:[]
	}  
	componentDidMount(){  
		
	}  
	// 上架成功
	onCompletes = (data) => { 
		this.ShelvesEnterRef.fetch(data)
	}
	// 录入成功
	onEntering = (data) => { 
		this.ShelvesCompleteRef.fetch(data)
	}
	render(){
		return (
			<Page title='标本上架'>  
				<div className='fx ex p10' > 
					<div className='ex mr10 fv bor1'>
						<SpecimenShelvesComplete onRef={ ref => this.ShelvesCompleteRef = ref }  onCompletes={(v) => this.onCompletes(v) } />
					</div>
					<div className='ex fv bor1'>
						<SpecimenShelvesEnter onRef={ ref => this.ShelvesEnterRef = ref } onEntering={(v) => this.onEntering(v)} />
					</div>
				</div>
			</Page>
		)
	}
}