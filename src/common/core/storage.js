/* ====================================== 本地存储配置  ====================================== */
import Store from '../store/storage'
import IndexDB from '../store/indexdb'
const Storage = Store(window.localStorage)
const Session = Store(window.sessionStorage)
const _ = {
	// 存储与获取数据
	local(name,data){
		name =  name || 'user'
		return arguments.length <= 1 ? Session.get(name) : Session.set(name,data)
	},
	// 移除数据
	remove(name){ Session.remove(name || 'user') },
	// 获取用户信息
	getUser(){
		const user = this.local()
		return this.hasObject(user) ? user : { }
	},
	// 长期存储
	longSave(name,data){
		return arguments.length <= 1 ? Storage.get(name) : Storage.set(name,data)
	},
	longRemove(name){ Storage.remove(name) },
	// 长期存储
	async dataSave(name,data){
		return arguments.length <= 1 ? await IndexDB.get(name) : IndexDB.set(name,data)
	},
	dataRemove(name){ IndexDB.remove(name) },
};

export default _