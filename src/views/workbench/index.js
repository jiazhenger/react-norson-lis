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

const Tot = ({ title, name }) => (
	<div>
		<p className='f24 tc'>{name}</p>
		<div className='mt10 fxm'><div className='r5px mr5' style={{width:'10px',height:'10px',background:'#dbeefa'}}></div>{title}</div>
	</div>
)
const List = ({title,data}) => (
	<div className='fl ml35 mt10 tc fxmc' style={{width:'80px',height:'80px'}}>
		<dl>
			<dt className='f18'>{data}</dt>
			<dd className='mt5  g9 f12'>{title}</dd>
		</dl>
	</div>
)
const News = ({title,data}) =>(
	<ul  className='bcf plr10'>
		<li className='fxm bbor1 ptb10' style={{width:'300px'}}>
			<div className='bor1 r6px plr5' style={{background:'#ddf7f6',color:'#81d8cc'}}>通知</div>
			<a className='mlr10' style={{textOverflow:'ellipsis',whiteSpace:'nowrap',width:'200px',overflow:'hidden'}}>工专路一号店路路路工专路一号店号一号店</a>
			<p>11/5</p>
		</li>
	</ul>
)
const Notice = ({title,data}) =>(
	<div className='bcf plr10 pb10'>
		<div className='fxm pt10'>
			<p style={{width:'10px',height:'10px'}} className='r5px bcm'></p>
			<p className='ml10'>1235459</p>
		</div>
		<p className='g9 ml20'>系统公告工商所地上</p>
	</div>
)
const Head = ({title,data}) =>(
	<ul  className='bcf plr10'>
		<li className='fxmj bbor1 ptb10'>
			<a>部门负责人</a>
			<p>37</p>
		</li>
	</ul>
)
// ===================================================================== component
export default class extends React.Component{
	state = {
		data:[],
		dataa:[],
	}
	
	forms = [
		{ label:'操作时间',	name:'date', type:'date-range',	names:['buy_date_start_date','buy_date_end_date'], value:['2020-12-10 12:12:50', '2020-12-11'] },
	]
	
	componentDidMount(){
		$http.submit(this,'index/statistics', { loadingText:'数据加载中...' }).then(data=>{
			this.setState({ data })
		})
		$http.submit(this,'index/total', { loadingText:'数据加载中...' }).then(data=>{
			this.setState({dataa:data})
		})
	}
	onDatePickerChange = v => {
		
	}
	render(){
		const {data,dataa}= this.state
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
						{/* 总计 */}
						<BoxScroll className='mt5' title='总计'>
						</BoxScroll>
						<Box className='fxmj p30'>
							{
								data.map((v,i)=> <Tot key={i} title={v.title} name={v.data} />)
							}
						</Box>
						
						{/* 按时间统计 */}
						<BoxScroll className='mt5' title='按时间统计' titleChildren={
							<div className='fxm'>
								<div className='g6 mr10'>操作时间</div>
								<DatePicker width={350} range onChange={this.onDatePickerChange} showTime bordered={false}/>
								<Button label='查询' icon={<SearchOutlined />} />
							</div>
						}>
						</BoxScroll>
						<Box className='clearfix p30'>
							{
								dataa.map((v,i)=> <List key={i} title={v.title} data={v.data} />)
							}
						</Box>
						
						<BoxScroll className='mt5' title='图形展示'>
						
						</BoxScroll>
						<BoxScroll className='mt5' title='数据展示'>
						
						</BoxScroll>
					</div>
				</div>
				<div className='ml5' style={{width:300}}>
					<BoxScroll title='消息通知' titleChildren={<More onClick={(()=>$fn.push(this,'/laboratory/workbench/info'))}/>}>
						
					</BoxScroll>
					<News className='ml5' style={{width:300}} />
					<News className='ml5' style={{width:300}} />
					<News className='ml5' style={{width:300}} />
					<News className='ml5' style={{width:300}} />
					<BoxScroll className='mt5' title='系统公告' titleChildren={<More onClick={(()=>$fn.push(this,'/laboratory/workbench/info'))}/>}>
					
					</BoxScroll>
					<Notice />
					<Notice />
					<Notice />
					<BoxScroll className='mt5' title='部门负责人'>
					
					</BoxScroll>
					<Head />
					<Head />
					<Head />
				</div>
				
			</Page>
		)
	}
}