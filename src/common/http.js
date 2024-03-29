/* ====================================== http 请求  ====================================== */
import axios from 'axios'
//import '@js/crypto-js'
import Config from './config'
import $fn from './fn'
// ===================================================== antd
//const CryptoJS = window.CryptoJS
// ===================================================== 公共函数
// 错误提法信息
const logMsg = (msg,content)=>{ Config.env && console.log(msg,content) }

// 配置头信息
const config = ({ type, token, api, upload  })=>{
	const content = ['application/json;charset=utf-8','application/x-www-form-urlencoded','multipart/form-data']
	if(upload){ type = 2 }
	const contentType = content[$fn.isValid(type) ? type : Config.contentType]
	// 签名验证
	/*
	let time = new Date().getTime();
    let sign = {
    	rest_timestamp:time.toString(),
		rest_sign:CryptoJS.DES.encrypt(time.toString(), CryptoJS.enc.Utf8.parse('__UWILLBE_'), { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7}).toString()
    }*/
	let header = token === false ? 
		{ 'Content-Type' 	: contentType } : 
		{ 
			'Content-Type'	: contentType,
			'Authorization'	: $fn.getToken()
		}
                
	return {
		baseURL: api,
		headers: header,
		timeout: 30000,
		//withCredentials : true	// 跨域请求想要带上cookies设置为 true
	}
}

// 序列化参数 {a:1,b:2} to ?a=1&b=2
const serializeParam = (body,isPost) => {
	if(!$fn.hasObject(body)) return '';
	let param = body;
	let str='';
	for(var i in param){
		const p = param[i]
		if($fn.hasArray(p)){
			p.forEach((v,j) =>{
				if($fn.isObject(v)){
					for(let k in v){
						str += i + '['+j+']' + '['+ k +']' + '=' + v[k] + '&'
					}
				}else{
					str += i + '['+j+']' + '=' + v + '&'
				}
			})
		}else{
			if($fn.isValid(param[i]) || param[i] === ''){ str += i + '=' + param[i] + '&' }
		}
	}
	if (str.charAt(str.length - 1) === '&'){ str = str.slice(0, str.length - 1) }
	str = isPost ? str : '?' + str
	return encodeURI(str);	// encodeURI 不对 [:, /, ;,?] 进行编码
}

// 序列化公参及自定义传参
//const combineParam = (body) => { return serializeParam(LS.get('login')) + serializeParam(body) }

// 将 body 以函数形式处理
const manageBody = body => {
	if($fn.isFunction(body)){
		return body()
	}else if($fn.hasObject(body)){
		for(var i in body){
			let v = body[i]
			if( !$fn.isValid(v) ){
				// delete body[i]
				v = ''
			}
		}
		return body
	}else{
		return body
	}
}
// 给空数据加类型
const setType = (_this,dataName) => {
	if(!_this) return
	let stack = _this[dataName]
	if($fn.isArray(stack)){
		stack = []
	}else if($fn.isObject(stack)){
		stack = {}
	}else{
		stack = ''
	}
	if($fn.isValid(dataName)){ _this[dataName] =  stack  }
	return stack;
}
// http 核心封装
/**
 * defined = {
 * 		onError: ()=>{}		// 只要出错就调用
 * 		suceessHander:()=>{}		// 只要调用接口成功就调用
 * 	    onEnd:()=>{}		// 成功或失败都调用
 * 		error:()=>{}				// 接口请求不通时调用
 * 		myToast:true				// 数据请求成功但不符合规则时，屏蔽默认提示，可在 then 中自定义提示
 * }
 *
 * */
const coreRequest = (url, param, action, defined) => {
	let UD = defined || {}
	
	let api = url.indexOf('http') !== -1 ? url : Config.api
	let body = manageBody(param);				// 处理自定义参数的不同形式 {} function
		body = UD.type === 1 ? serializeParam(body,true) : body
	let sParam = serializeParam(body);	// 序列化参数
	let promise;
	let configs = config({
		type	: UD.type,
		upload	: UD.upload,
		token	: UD.token,
		api		: api
	})
	
	$fn.isFunction(UD.onStart) && UD.onStart()		// 一开始就调用
	
	if(action === 'get'){
		promise = axios.get(url + sParam, configs);
		logMsg('%c' + action + ' === ' + api + url + sParam, 'color:blue')		// 输出 api
	}else{
		promise = axios.post(url, body, configs);
		logMsg('%c' + action + ' === ' + api + url + JSON.stringify(body), 'color:blue')	
	}
	
	// 加载效果
	return new Promise((resolve, reject) => {
		promise.then(res => {	// 接口正确接收数据处理
			let data = res.data;
			let code = data.status*1;
			if(code === 1){	// 数据请求成功
				resolve(data.data);
				logMsg(url + '===', data.data);
			} else if(code === -10404417 || code === -10404413){	// 登录信息已过期，请重新登录! || 未登录
				$fn.toast(data['msg'])
				$fn.remove()
				$fn.loginTo()
				// 跳转不同登录页
				setTimeout(()=>$fn.go('/login'))
			}else{ // 数据请求成功但不符合规则
				reject(data);
					
				if(UD.onMsg){
					$fn.isFunction(UD.onMsg) && UD.onMsg(data)		// 自定义提示
				}else{
					$fn.toast(data['msg'], UD.onError)			// 默认开启出错提示
				}
				
				// $fn.isFunction(UD.onError) && UD.onError(data)	// 只要出错就调用
				$fn.isFunction(UD.onFail) && UD.onFail(data)	// 数据处理不满足条件时调用
				
				logMsg(url + '===', data);
			}
			
			$fn.isFunction(UD.onEnd)		&& UD.onEnd(data)  		// 只要调用接口就调用
			$fn.isFunction(UD.onSuccess)	&& UD.onSuccess(data) 	// 只要调用接口成功就调用
			
		}, (err) => { 					// 接口错误处理
			if(!UD.noError){ $fn.toast('服务器或网络出错')}
			$fn.isFunction(UD.onNet) 	&& UD.onNet()				// 服务器出错或无网络调用
			$fn.isFunction(UD.onError) 	&& UD.onError()				// 只要出错就调用
			$fn.isFunction(UD.onEnd)	&& UD.onEnd()  				// 只要调用接口就调用
			//error(err, api + url)
		})
	})
}
// ===================================================== pull 请求组件
// post 请求
const post = (url,body,defined) => coreRequest(url,body,'post',defined)
// get 请求
const get = (url,body,defined) => coreRequest(url,body,'get',defined)
// ===================================================== pull 提交
const submit = (_this,api,option)=>{
	let opt = {
		param			: {},
		loadingText		: '数据提交中...',			
		successText		: '',					// 自定义成功提示
		succeedFn		: null,					// 成功之后执行
		errorText		: '',					// 自定义错误提示
		submitLoading	: 'submitLoading', 		// 加载判断
		loading			: true,
		runFirst		: true,					// 先跳转，后提示
		type			: Config.contentType, 	// Content-Type 类型
//		replace			: null,					// replace 路由
//		push			: null,					// push 路由
//		refresh			: false,				// 是否刷新
//		myToast		: false,				// 是否关闭默认提示
//		onEnd			: null,					// 无论请求成功或失败都执行此方法
//		onError			: null,					//
//		upload			: false,				// 调用上传接口
//		token			: false,
//		isBody			: false,
		...option
	}
	
	_this && _this.setState({ [opt.submitLoading] : true })
	opt.loading && $fn.loading(true,opt.loadingText)
	
	const run = ()=>{
		if(_this){
			opt.replace && _this.props.history.replace(opt.replace);
			opt.push && _this.props.history.push(opt.push)
		}
		opt.onSuccess && opt.onSuccess()
	}
	return new Promise((resolve, reject)=>{
		post(api,opt.param,{ 
			onStart	: ()=>{ opt.onStart && opt.onStart(true) },
			onEnd	: ()=>{
							_this && _this.setState({ [opt.submitLoading] : false })
							opt.loading && $fn.loading(false)
							opt.onEnd && opt.onEnd(false)
			},
			onMsg	: opt.onMsg && ( data => { $fn.isFunction(opt.onMsg) && opt.onMsg(data) }),
			noError	: opt.noError,
			onError	: opt.onError,
			upload	: opt.upload,
			token	: opt.token,
			isBody	: opt.isBody,
			type	: opt.type
		}).then(data=>{
			resolve(data)
			// 提示后执行
			if(opt.successText){
				if(opt.runFirst){
					$fn.toast(opt.successText);
					run();
				}else{
					$fn.toast(opt.successText,run)
				}
			}else{ // 直接执行
				run();
			}
		},data=>{
			reject(data)
			if(opt.myToast){
				_this.refs.toast && _this.refs.toast.open({ text: data['info'] })
			}
		})
	})
}
// ===================================================== 一般数据加载
const pull = (_this,api,option)=>{
	let opt = {
		dataName	: 'data',				// 数据名字
		loading		: false,				// 如果有加载效果
		param		:{},					// 参数
		pullLoading : 'pullLoading',		// 加载判断
		loadingText	: '数据加载中...',			
//		onSuccess	: null,			// 改变数据
//		onError		: null,
//		token		: false,
//		myToast	: false,
		...option
	}
	
	if(_this && $fn.isValid(opt.isFirst)){
		_this.setState({ [opt.pullLoading] : true, isFirst : opt.isFirst })
	}else{
		_this && _this.setState({ [opt.pullLoading] : true })
	}
	
	if(!opt.isFirst){
		opt.loading && $fn.loading(true,opt.loadingText)
	}
	
	return new Promise((resolve,reject)=>{
		get(api,opt.param,{
			onStart		: ()=>{ opt.onStart && opt.onStart(true) },
			onEnd		: ()=>{
								_this && _this.setState({ [opt.pullLoading] : false })
								opt.loading && $fn.loading(false)
								opt.onEnd && opt.onEnd(false)
			},
			onMsg	: opt.onMsg && ( data => { $fn.isFunction(opt.onMsg) && opt.onMsg(data) }),
			noError	: opt.noError,
			onError	: ()=>{
							setType(_this,opt.dataName) 	 // 出错，清空 data
							opt.onError && opt.onError()
							if(!opt.loading){ $fn.loading(false) }
			},
			token	: opt.token,
		}).then(data=>{
			if($fn.isValid(data)){
				if($fn.isFunction(opt.onSuccess)){
					data = opt.onSuccess(data);
				}
				if($fn.isValid(opt.dataName)){
					_this && _this.setState({ [opt.dataName] : data });
				}
				resolve(data);
			}else{
				let stack = setType(_this,opt.dataName);
				resolve(stack);
			}
		})
	})
}
// ===================================================== 分页
const paging = (_this,api,option)=>{
	let opt = {
		dataName		: 'data',				// 数据名字
		loading			: true,					// 如果有加载效果
		param			: { },						// 参数
		pagingLoading	: 'pullLoading',		// 加载判断
		resetData		: false,				// 是否重新设置 data，false 不允许
//		format			: {},						// 格式化时间
		pag				: 'pag'
	}
	
	Object.assign(opt,option || {});
	
	const { current, pageSize } = opt.param || {}
	const param = {
		page  	: current || 1, 		// 当前页
		limit 	: pageSize || 20,		// 每页显示多少条数据
	    ...opt.param,
	}
	delete param.pageSize
	delete param.total
	delete param.current
	
	return new Promise((resolve)=>{
		pull(_this,api,{
			onStart		: ()=>{ opt.onStart && opt.onStart(true) },
			onEnd		: ()=>{ opt.onStart && opt.onEnd(true) },
			onError		: opt.onError,
			loading		: opt.loading,
			param		: param ,
			pullLoading	: opt.pagingLoading,
			resetData	: true,
			dataName	: null
		}).then(data=>{
			const result = data.items || data
			_this.setState({ 
				[opt.pag]:{
					..._this.state[opt.pag],
					current		: +data.current, 		    // 当前页码
					total		: +data.total_items,		// 总共多少条数据
					totalPage	: +data.total_pages,		// 总共多少页
					pageSize	: +data.limit,				// 每页显示多少条数据
				}
			},()=>{
				if($fn.isValid(opt.dataName)){
					_this.setState({ [opt.dataName]: result })
					resolve(result)
				}
			})
			opt.callback && opt.callback(data);
		})
	})
}
export default { submit, pull, paging }