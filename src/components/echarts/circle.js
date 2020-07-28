import Tooltip from './config/tooltip'
export default (option)=>{
	const opt = {
		data:[], 		// y轴数字
		xdata:[],		// x轴名称
		name:'',
		...option
	}
	const data = opt.data
	const name = opt.name
	return {
		tooltip: {
	        trigger: 'item',
	        formatter: '{a} <br/>{b}: {c} ({d}%)',
	        ...Tooltip()
	    },
	    legend: {
	    	data: data.map(v=>v.name), 	// 返回说明名称
	        orient: 'horizontal', 	// horizontal
	        x: 'center',
//	        align:'center',
        	right: 20,
        	bottom:10,
        	itemWidth:10,
        	itemHeight:10,
        	icon: 'circle',
        	itemGap:15,
        	textStyle:{
        		fontSize:12,
        		color:'#999'
        	},
	    },
	    color:['#3850FF','#1890FF','#FDE789'],
	    series: [
	        {
	            name:name,
	            type:'pie',
	            radius: ['40%', '65%'],
	            avoidLabelOverlap: false,
	            label: {
	                normal: {
	                    show: false,
	                    position: 'center'
	                },
	                emphasis: {
	                    show: true,
	                    textStyle: {
	                        fontSize: '20',
	                        fontWeight: 'bold'
	                    }
	                }
	            },
	            labelLine: {
	                normal: {
	                    show: false
	                }
	            },
	            data:data
	        }
	    ]
	}
}
