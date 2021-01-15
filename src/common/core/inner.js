/* ======================================  内部特有方法  ====================================== */
const _ = {
	// ======================================================================== dom
	loading(bool,msg){
		let loading = document.querySelector('#jzer-loading');
		if(loading){
			if(bool){
				loading.querySelector('.jzer-loading-msg').innerHTML = msg || '数据加载中'
				loading.style.display = 'block'
			}else{
				loading.style.display = 'none'
			}
		}
	},
	async toast(msg, callback, delay){
		delay = delay || 1500
		const toast = document.querySelector('#jzer-toast')
		if( toast ){
			toast.style.display = 'block'
			toast.querySelector('.jzer-toast-msg').innerHTML = msg
			setTimeout(()=>{ toast.style.display = 'none'; callback && callback() },delay)
		}
	},
	// ======================================================================== 刷新跳转
	// 登录后跳转
	loginTo(flag){
		if(flag){
			const page = this.local('m-skip')
			return this.local('m-skip') ? decodeURIComponent(page).replace('#','') : false
		}else{
			this.local('m-skip',encodeURIComponent(window.location.hash))
		}
	},
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
	async setModels(_this,keyValue,option){
		console.log(_this,keyValue,option)
		const opt = {
			model : 'model',
			...option
		}
		_this[opt.model] = {..._this[opt.model], ...keyValue }
		return _this[opt.model]
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
	// ======================================================================== 刷新局部
	// refresh(_this){ _this.setState({ key: (_this.state.key || 0) + 1}) },
};

export default _