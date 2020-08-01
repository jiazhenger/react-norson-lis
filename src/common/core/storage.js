/* ====================================== 本地存储配置  ====================================== */
import Store from '../store/storage'
const Storage = Store(window.localStorage)
const _ = {
	// 存储与获取数据
	local(name,data){
		name =  name || 'user'
		return arguments.length <= 1 ? Storage.get(name) : Storage.set(name,data)
	},
	// 移除数据
	remove(name){ Storage.remove(name || 'user') },
	// 获取用户信息
	getUser(){
		const user = Storage.get('user')
		return this.hasObject(user) ? user : { }
	},
};

export default _