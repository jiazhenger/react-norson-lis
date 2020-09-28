import DataType from './utils/data-type'
import Storage from './core/storage'
import Query from './core/query'
import Rest from './core/rest'
import Inner from './core/inner'
/* ====================================== 全局变量及方法  ====================================== */
export default {
	// ======================================================================== 功能函数
	...DataType,
	...Storage,
	...Query,
	...Rest,
	...Inner,
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
	refresh(_this){ _this.setState({ key: (_this.state.key || 0) + 1}) },
	// 获取 router
	getRoot(){
		const hash = window.location.hash
		const arr = hash.split('/')
		return {
			root : '/' + arr[1] + '/',
			munu : arr[1]
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
}