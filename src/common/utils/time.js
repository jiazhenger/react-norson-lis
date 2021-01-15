import $fn from '../fn'

const formatNumber = function(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}
const join = function(arr,split){
	return arr.map(formatNumber).join(split)
}
export default {
	full: function(time){
		var date = new Date(time);
	    return {
	    	year : date.getFullYear(),
	     	month : date.getMonth() + 1,
	    	day : date.getDate(),
	    	h : date.getHours(),
	   		m : date.getMinutes(),
	    	s : date.getSeconds(),
	    }
	},
	format: function(time,option){
		var opt = { s:'-', l:'en', t:'ymd', ...option }
		var str = null
        var date = null
        if($fn.isString(time)){
            date = this.getTime(time)
        }else if(time instanceof Date){
            date = time.getTime()
        }else{
			date = time
		}

		if(date){
			var t = this.full(date);
			switch(opt.t){
				case 'full':
					str = join([t.year,t.month,t.day],opt.s) + ' ' + join([t.h,t.m,t.s],':')
					break;
				case 'ymd-hm':
					str = join([t.year,t.month,t.day],opt.s) + ' ' + join([t.h,t.m],':') + ':00'
					break;
				case 'ymd':
					str = opt.l === 'zh' ? t.year+'年'+t.month+'月'+t.day+'日' : join([t.year,t.month,t.day],opt.s)
					break;
				case 'hms':
					str = join([t.h,t.m,t.s],':')
					break;
				case 'hm':
					str = join([t.h,t.m],':')
					break;
				default:
					break;
			}
		}
		return str
	},
	getTime(time){
		return time ? new Date(time).getTime() :  new Date().getTime()
	},
	// 杜  --2020-10-15  时间的半个月组件
	customDate(ds, time, timeStr) { // ds:当前时间前xx天（如：1表示昨天，-1表示明天），time：显示时间，start为0时，end为23时59分59秒，否则显示当前时间，timeStr：默认传入时分秒
		const current = new Date();
		const y = current.getFullYear();
		const m = current.getMonth() + 1 > 9 ? current.getMonth() + 1 : `0${current.getMonth() + 1}`;
		const d = current.getDate() > 9 ? current.getDate() : `0${current.getDate()}`;
		const hh = current.getHours() > 9 ? current.getHours() : `0${current.getHours()}`;
		const mm = current.getMinutes() > 9 ? current.getMinutes() : `0${current.getMinutes()}`;
		const ss = current.getSeconds() > 9 ? current.getSeconds() : `0${current.getSeconds()}`; // 赵兴英 - 2020-06-05：时间添加0补位
		let d1 = ''
		if (ds === 1) {
		  const diff = d - ds > 9 ? d - ds : `0${d - ds}`
		  if (timeStr) {
			d1 = `${y}-${m}-${diff} ${timeStr}`
		  } else {
			if (time === 'start') {
			  d1 = `${y}-${m}-${diff} 00:00:00`
  
			} else if (time === 'end') {
			  d1 = `${y}-${m}-${diff} 23:59:59`
			} else {
			  d1 = `${y}-${m}-${diff} ${hh}:${mm}:${ss}`
			}
		  }
		} else if (ds === 2) {
		  // 薛 | 2020-06-05 | 返回本月1号
		  if (time === 'date') { // 赵 - 2020-06-28：time === date为日期格式
			d1 = `${y}-${m}-01`
		  } else {
			d1 = `${y}-${m}-01 00:00:00`
		  }
		} else if (ds === 3) {
			// 薛 | 2020-06-05 | 提前三十天
			if (time === 'date') { // 杜 - 2020-11-11：time === date为日期格式
			  d1 = `${y}-${m-1}-${d}`
			} else {
			  d1 = `${y}-${m-1}-${d} 00:00:00`
			}
		} else {
		  if (ds === 'current-date') { // 赵 - 2020-06-28：返回当前日期
			d1 = `${y}-${m}-${d}`
		  } else {
			d1 = `${y}-${m}-${d} ${hh}:${mm}:${ss}`
		  }
		}
		return d1
	},
}