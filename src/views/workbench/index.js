import React from 'react'
// ===================================================================== antd
import { SearchOutlined } from '@ant-design/icons'
// ===================================================================== global declare
const { $http, $fn, $async } = window
// ===================================================================== private template
const Page = $async(()=>import('#tp/content/content-aside'))
const Box = $async(()=>import('#tp/box/box'))
const BoxScroll = $async(()=>import('#tp/box/box-scroll'))
const Image = $async(()=>import('@tp/image'))
const DatePicker = $async(()=>import('@antd/form/datePicker'))
const Button = $async(()=>import('@antd/button'))
// ===================================================================== template
const More = ({onClick}) => <span className='c0 cp hover-tu' onClick={onClick}>查看更多</span>
// ===================================================================== component
export default class extends React.Component{
	componentDidMount(){
		
	}
	onDatePickerChange = v => {
		
	}
	render(){
		return (
			<Page className='fx'>
				<div className='ex rel'>
					<div className='abs_full oys scrollbar'>
						{/*  */}
						<Box className='fxm p10'>
							<Image wrap round size={40} className='bor1'/>
							<hgroup className='ml10 ex'>
								<h3 className='f16 b'>您好！测试，祝您开心每一天！</h3>
								<h6><span className='c0'>职位：</span><span className='g9'>! 公司-部门公司</span></h6>
							</hgroup>
							<dl className='fx'>
								<dd className='mr15'><span className='g9'>上次访问时间:</span> 2020-10-12 14:41:28</dd>
								<dd><span className='g9'>本次登录时间:</span> 2020-10-12 14:41:28</dd>
							</dl>
						</Box>
						{/*  */}
						<BoxScroll className='mt5' title='按时间统计' titleChildren={
							<div className='fxm'>
								<div className='g6 mr10'>操作时间</div>
								<DatePicker width={350} range onChange={this.onDatePickerChange} showTime bordered={false}/>
								<Button label='查询' icon={<SearchOutlined />} />
							</div>
						}>
							
						</BoxScroll>
						<BoxScroll className='mt5' title='图形展示'>
						
						</BoxScroll>
						<BoxScroll className='mt5' title='数据展示'>
						
						</BoxScroll>
					</div>
				</div>
				<div className='ml5' style={{width:300}}>
					<BoxScroll title='消息通知' titleChildren={<More onClick={(()=>$fn.push(this,'/laboratory/workbench/info'))}/>}>
						456
					</BoxScroll>
					<BoxScroll className='mt5' title='系统公告' titleChildren={<More onClick={(()=>$fn.push(this,'/laboratory/workbench/info'))}/>}>
					
					</BoxScroll>
					<BoxScroll className='mt5' title='部门负责人'>
					
					</BoxScroll>
				</div>
			</Page>
		)
	}
}