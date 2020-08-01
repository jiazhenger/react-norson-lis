/* ====================================== 获取参数  ====================================== */
const _ = {
	// 获取 url 参数
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
	}
}

export default _