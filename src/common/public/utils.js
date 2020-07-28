/* ====================================== 全局变量及方法  ====================================== */
import Storage from '../store/sessionStorage'
const _ = {
	// ======================================================================== redux
	loading(bool,msg){
		let loading = document.querySelector('#jzer-loading');
		if(bool){
			loading.querySelector('.jzer-loading-msg').innerHTML = msg || '数据加载中'
			loading.style.display = 'block'
		}else{
			loading.style.display = 'none'
		}
	},
	async toast(msg, delay){
		delay = delay || 1500
		const toast = document.querySelector('#jzer-toast')
		toast.style.display = 'block'
		toast.querySelector('.jzer-toast-msg').innerHTML = msg
		setTimeout(()=>{ toast.style.display = 'none' },delay)
	},
	// ======================================================================== 刷新跳转
	go(path){
		const route = path || '/login'
		const { port, protocol, hostname, pathname  } = window.location
		const ports = port === 80 ? '' : ':' + port
		window.location.replace(protocol + '//' + hostname + ports + pathname + '#' + route)
		// window.location.replace(protocol + '//' + hostname + ports + route)
	},
	// 登录后跳转
	loginTo(flag){
		if(flag){
			const page = this.local('m-skip')
			return this.local('m-skip') ? decodeURIComponent(page).replace('#','') : false
		}else{
			this.local('m-skip',encodeURIComponent(window.location.hash))
		}
	},
	// ======================================================================== 本地存储配置
	local(name,data){
		name =  name || 'user'
		return arguments.length <= 1 ? Storage.get(name) : Storage.set(name,data)
	},
	remove(name){ Storage.remove(name || 'user') },
	// 获取用户信息
	getUser(){
		const user = this.local('user')
		return this.hasObject(user) ? user : { }
	},
	// ======================================================================== 获取 url 参数
	getQuery(id){
		const hash = window.location.search || window.location.hash
		let stack = {}
		if(hash.indexOf('?') !== -1){
			let search = hash.split('?')
			search = search[1].split('&')
			search.forEach(function(v,i){
				const s = v.split('=')
				if(s[1]!=='undefined' && s[1]!=='null' && s[1]!==''){
					stack[s[0]] = s[1]
				}
			})
		}
		if(id){ return stack[id] }
		return stack
	},
	// 获取地址栏与本地缓存的 token
	getToken(obj){
		const token = this.getQuery('token');
		const user = this.getUser();
		let rs = null
		if(token){
			rs = token
		}else if(user.token){
			rs = user.token
		}
		return rs
	},
	// 设置浏览器 title
	setTitle(text){ window.document.title = text },
	// 深拷贝
	copy(data){ return JSON.parse(JSON.stringify(data)) },
	// 添加 className
	css(className, defaultValue){ 
		if(arguments.length === 1) {
			return className ? className : ''
		}else if(arguments.length === 2){
			return className ? className : 'defaultValue'
		}
	},
	// ========================================================================  设置 model
	async setModel(_this,keyValue,option){
		const opt = {
			model : 'model',
			...option
		}
		await _this.setState({ [opt.model]: {..._this.state[opt.model], ...keyValue } })
		return _this.state[opt.model]
	},
	// 绑定值
	val(v){return this.isValid(v) ? v : '--'},
	nan(v){return !isNaN(v) ? v : '--'},
	// 验证 model
	validModel(model){
		return !this.hasObject(model) || Object.keys(model).some( v => {
			if(this.isArray(model[v])){
				return !this.hasArray(model[v])
			}else{
				return !this.isValid(model[v])
			}
		} )
	},
	// ======================================================================== 路由跳转
	push(_this,path,param){ _this.props.history.push(path,param) },
	replace(_this,path,param){ _this.props.history.replace(path,param) },
	back(_this){_this.props.history.goBack()},
};
// ======================================================================== 数据类型
(['String', 'Number', 'Array', 'Object', 'Boolean', 'Function', 'Undefined']).forEach(v => {
	_['is' + v] = obj => ( {}.toString.call(obj) === '[object '+ v +']' )
})
const dataType = {
	hasArray 	: d => _.isArray(d) && d.length > 0,
	hasObject 	: d => _.isObject(d) && Object.keys(d).length > 0,
	isEmpty 	: d => _ === null || d === undefined || d === '',
	isValid 	: d => !_.isEmpty(d) || d === 0 || d === false
}

export default {..._, ...dataType}