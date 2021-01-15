const confirm = import('@antd/confirm')
const message = import('@antd/message')
const { $fn } = window

export default { 
    // ======================================================================== 薛玉梅
    /**
	 * 弹框提示调用接口的方法
	 * @param {api} 接口
	 * @param {info} 文字提示
	 * @param {param} 接口参数
	 * @param {callback} 回调
	 **/ 
	interfaceConfirm (api, info, param, callback) {
		if (info) {
			confirm.then(f=>{
				f.default({
					msg:`是否确认${info}？`,
					onOk: close => {   
						window.$http.submit(null, api, { param: param }).then(data => {
							message.then(f=>f.default.success(`${info}成功`))
							callback()
							close()
						})
					}
				})
			}) 
		} else {
			window.$http.submit(null, api, { param: param }).then(data => {
				message.then(f=>f.default.success(`${info}成功`))
				callback() 
			})
		}
	},
	/**
	 * 系统设置的时间轴节点
	 * @param {separate} 默认时间节点-(时)
	 * @param {type} 1：开始 | 2：结束
	 **/  
	sysTime(type, separate) {  
		let user = $fn.getUser()
		let s1 = '9' 
		if($fn.hasObject(user)){
			s1 = separate ? separate : user.timeline_node ? user.timeline_node : "9";
		} else {
			s1 = separate ? separate : "9";
		}
		let s2 = parseInt(s1) > 9 ? `${s1}:00:00` : `0${s1}:00:00`
		let current = new Date();
		if (current.getHours() < Number(s1)) {
			// 1-开始；2-结束
			if (type === 1) {
				current.setTime(current.getTime() - 24 * 60 * 60 * 1000);
			}
		} else {
			// 1-开始；2-结束
			if (type === 2) {
				current.setTime(current.getTime() + 24 * 60 * 60 * 1000);
			}
		}
		const y = current.getFullYear();
		const m = current.getMonth() + 1 > 9 ? current.getMonth() + 1 : `0${current.getMonth() + 1}`;
		const d = current.getDate() > 9 ? current.getDate() : `0${current.getDate()}`;
		const hh = current.getHours() > 9 ? current.getHours() : `0${current.getHours()}`;
		const mm = current.getMinutes() > 9 ? current.getMinutes() : `0${current.getMinutes()}`;
		const ss = current.getSeconds() > 9 ? current.getSeconds() : `0${current.getSeconds()}`;
		let v1 = "";
		if (s2) {
			v1 = `${y}-${m}-${d} ${s2}`;
		} else {
			v1 = `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
		}
		return v1;
	},
	/**
	 * 时间间隔天数和时分秒
	 * @param {ds} 提前天数,默认 1
	 * @param {timeStr} 时分秒，默认当前时分秒
	 **/   
	intervalTime (ds, timeStr) { 
		const newdate = new Date()
		let current = newdate 
		if (ds) {
			current = new Date(newdate.getTime() - ds * 24 * 60 * 60 * 1000);
		}
		const y = current.getFullYear();
		const m = current.getMonth() + 1 > 9 ? current.getMonth() + 1 : `0${current.getMonth() + 1}`;
		const d = current.getDate() > 9 ? current.getDate() : `0${current.getDate()}`;
		const hh = current.getHours() > 9 ? current.getHours() : `0${current.getHours()}`;
		const mm = current.getMinutes() > 9 ? current.getMinutes() : `0${current.getMinutes()}`;
		const ss = current.getSeconds() > 9 ? current.getSeconds() : `0${current.getSeconds()}`;
		let d1 = timeStr ? `${y}-${m}-${d} ${timeStr}` : `${y}-${m}-${d} ${hh}:${mm}:${ss}`
		return d1
	},
	/**
	 * 图片拼接域名
	 * @param {val} 图片后缀
	 **/  
	img_domain_url (val) {
		if (val) { 
			let user = $fn.local('user')
			if (user && Object.keys(user).length > 0 && user.img_domain) {
			  	return user.img_domain + val
			} else {
				return val
			} 
		} else {
			return ''
		} 
	},
	/**
	 * 导出
	 * 赵兴英
	 * 2020-11-02 
	 **/
	exportExcel({api, apiType, param, cb}) {
		window.$http[apiType || 'pull'](null, api, param).then(data => {
			window.location.href = data.url;
			cb&&cb()
		})
	}, 
	/**
	 * 转换0 1
	 * 薛玉梅
	 * 2020-12-1 
	 **/ 
    switchFlag(flag) { 
		return flag ? 1 : 0
	  },
	flagSwitch(flag) { 
		return String(flag) === "1" ? true : false
	}
}
