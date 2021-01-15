import DataType from './utils/data-type'
import Storage from './core/storage'
import Query from './core/query'
import Rest from './core/rest'
import Inner from './core/inner'
import FormTable from './core/form-table'

/* ====================================== 全局变量及方法  ====================================== */
export default {
	// ======================================================================== 功能函数
	...DataType,
	...Storage,
	...Query,
	...Rest,
	...Inner,
	...FormTable,
	// ======================================================================== 全局变量
	c0:'#2cd1d2',
	c1:'#FF5218',
	menuWidth: 200,
	// ======================================================================== 正则匹配
	//	isTel(v){ return /^1[0-9]{10}$/.test(v) },
	//	isPwd(v){ return /\w{6,18}$/.test(v) },
	//	pwdReg: /\w{6,18}$/,
	//	isId(v){ return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(v) },
	//	isCard(v){ return /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/.test(v) },
	//	isCard(v){ return true},
	//	isEmail(v){ return /^([0-9A-Za-z\-_]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g.test(v) },
	//	isInt(v){ return /^[1-9]\d*$/.test(v) }, // 整数
	// ======================================================================== 数据处理
	// 处理 DatePicker 的 RangePicker 获取的时间
	getRange(data,t){
		if(this.hasArray(data)){
			return {
				sdate: this.format(data[0],{t}),
				edate: this.format(data[1],{t}),
			}
		}else{
			return {
				start:null,
				end:null
			}
		}
	},
	// 处理 DatePicker 获取的单个时间
	getDate(data,t){
		return data ? this.format(data[0],{t}) : null
	},
	// 将无效数据剔除
	getBody(data){
		for(var i in data){
			let v = data[i]
			if( !this.isValid(v) ){
				delete data[i]
			}
		}
		return data
	},
	// 给 data 添加 key
	addKey(data,format){
		const { page } = data
		const pageSize = page.limit
		const current = page.current
		const rows = data.items
		
		const num = pageSize*(current -1) + 1;
		if(this.hasArray(rows)){
			rows.forEach((v,i)=>{ 
				rows[i]['key'] = num + i;
				// 格式化时间
				if(this.hasObject(format)){
					format.f.forEach((m,k)=>{
						v[m + 'Str'] = this.format(v[m],{t:format.t})
					})
				}
			})
		}
		return rows;
	},
	addKeys(rows,format){
		if(this.hasArray(rows)){
			rows.forEach((v,i)=>{ 
				rows[i]['key'] = i + 1;
				// 格式化时间
				if(this.hasObject(format)){
					format.f.forEach((m,k)=>{
						v[m + 'Str'] = this.format(v[m],{t:format.t})
					})
				}
			})
		}else if(this.hasObject(rows)){
			Object.keys(rows).forEach((v,i)=>{
				// 格式化时间
				if(this.hasObject(format)){
					format.f.forEach((m,k)=>{
						rows[m + 'Str'] = this.format(rows[m],{t:format.t})
					})
				}
			})
		}
	},
	// 刷新key
	// refresh(_this){ _this.setState({ key: (_this.state.key || 0) + 1}) },
	refreshRouter(){
		window.proxy.refresh()
	},
	// 获取 router | 获取多个参数
	getRoot(n){
		const hash = window.location.hash
		const arr = hash.split('/') 
		if (n) {
			let root = '/' 
			arr.forEach((i, index) => {
				if (index > 0 && index <= n) {
					root += i + '/'  
				}
			}) 
			return {
				root : root, 
			}
		} else { 
			return {
				root : '/' + arr[1] + '/',
				munu : arr[1]
			}
		}
	},
	getRouter(data){
		const { root, munu} = this.getRoot()
		const _data = JSON.parse(JSON.stringify(data))
		let flag = null
		const deep = data => {
			data.forEach((v,i)=>{
				if(!flag){
					if(i === 0){
						v.root = root + v.root
						if(v.to){ v.to = root + v.to }
						flag = true
					}
				}
				if(v.path){
					v.path = root + v.path
				}
				if(!v.component && !root){
					v.component = munu + '/' + v.path
				}
				const children = v.children
				if(this.hasArray(children)){
					deep(children)
				}
			})
		}
		deep(_data)
		return _data
	},
	leak(callback){
		let clear
		return time => {
			clearTimeout(clear)
			clear = setTimeout(()=>{
				callback()
			},time || 100)
		}
	},
	// ======================================================================== 薛玉梅
	// 过滤查询 | data:数据源 , value：值 , nameStr：[name]要取的值字段 , idStr：[value]要取的值value
	filterSelect (data, value, nameStr, idStr) {
		if (value) {
			let d = data.filter(i => String(i[idStr || 'value']) === String(value)) 
			return this.hasArray(d) ? d[0][nameStr || 'name'] : ''
		} else {
			return '--'
		}
	},
	// ======================================================================== 赵兴英
	/**
	 * 获取字典表
	 * @param {code} 字典编码
	 * @param {callback} 回调
	 **/
	getDisItem({code, callback}) {
		this.dataSave(`dis-item-${code}`).then(local => {
			if(this.hasArray(local)){
				callback && callback(local)
			}else{
				window.$http.submit(null,'dis-item/item', { param:{dis_code:code}, loading:false}).then(data=>{
					this.dataSave(`dis-item-${code}`, data)
					callback && callback(data)
				})
			}
		})
	},
	// ======================================================================== 赵兴英
	/**
	 * 更新缓存信息
	 * @param {updateList} 待更新列表
	 **/
    updateCacheList(updateList) {
		let api = ''
		updateList.map((item) => {
			api = item.api.replace('api/', '')
			window.$http.submit(null, api).then(data=>{
				let save = data.items ? data.items : data
				this.dataSave(`${item.api}`, save)
			})
		})
	},
	// ======================================================================== 赵兴英
	// 设置缓存
	setCache() {
		let updateList = []
		window.$http.submit(null, 'cache-api/index').then(data=>{
			this.dataSave('cache-list').then(local => {
				if (this.hasArray(local)) {
					data.forEach(item => {
						local.forEach(i => {
							if (item.api === i.api && new Date(item.updated_at).getTime() > new Date(i.updated_at).getTime()) {
								updateList.push(item)
								i.updated_at = item.updated_at
							}
						})
					})
					this.dataSave('cache-list', local) // 存数据
				} else {
					updateList = data
					this.dataSave('cache-list', updateList) // 存数据
				}
				this.hasArray(updateList) && this.updateCacheList(updateList)
			})
		})
	},
	// ======================================================================== 赵兴英
	/**
	 * 获取列表缓存
	 * @param {cache} 缓存名称
	 * @param {name} 下拉文本
	 * @param {id} 下拉value
	 * @param {callback} 回调
	 **/
	getCache({cache, name, id, callback}) {
		this.dataSave(cache).then(data => {
			if (this.hasArray(data)) {
				data.map(item => {
					item['name'] = item[name] || item['name']
					item['value'] = item[id] || item['value']
				})
			}
			callback && callback(data)
		})
	},
	// ======================================================================== 赵兴英
	/**
	 * 编辑时设置提交表单值
	 * @param {submit} 提交表单 
	 * @param {data} 接口返回数据（info接口） 
	 * @param {callback} 回调 
	 */
	setSubmitValues(submit, data, callback) {
		submit.forEach(item => {
			for (let i in data) {
				if (i === item.name) {
					item.value = data[i]
				}
			}
		})
		callback && callback(submit)
	},
	// ======================================================================= 赵兴英
	/**
	 * 去掉'api/'
	 * @param {api} 接口地址
	 */
	replaceApi(api) {
		let d = api.replace('api/', '')
		return d || ''
	},
	// ======================================================================= 赵兴英
	/**
	 * 处理符号方法
	 * @param { val } 需要转换的值
	 */
	handleSymbol(val) {
		if (val && val.indexOf('+') >= 0) {
			val = val.replace(/\+/g, '%2B')
		}
		if (val && val.indexOf('/') >= 0) {
			val = val.replace(/\//g, '%2F')
		}
		return val
	}, 
	/**
	 * 转换接口参数 
	 */
	getObjectParam (name, data) {
		let stack = {}
		for(let i in data){
			const value = data[i];
			if(this.hasArray(value)){
				value.forEach((v,k)=>{
					stack[name + '['+ i +'][' + k +']'] = v
				})
			}else{
				stack[name + '['+ i +']'] = value
			}
		}
		return stack
	}
}