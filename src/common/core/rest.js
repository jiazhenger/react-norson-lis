/* ======================================  其它方法  ====================================== */
const _ = {
	// 刷新跳转
	go(path){
		const route = path || '/login'
		const { port, protocol, hostname, pathname  } = window.location
		const ports = port === 80 ? '' : ':' + port
		window.location.replace(protocol + '//' + hostname + ports + pathname + '#' + route)
		// window.location.replace(protocol + '//' + hostname + ports + route)
	},
	// 设置浏览器 title
	setTitle(text){ window.document.title = text },
	// 深拷贝
	copy(data){ return JSON.parse(JSON.stringify(data)) },
};

export default _