// eventProxy.js
//'use strict';
export default {
	Class: {},
	on(key, fn) {
		if(this.Class[key] === undefined) {
			this.Class[key] = [];
    	}
    	this.Class[key].push(fn);
	},
	off(key) {
		this.Class[key] = [];
	},
	publish() {
		if(arguments.length === 0){ return false }
		setTimeout(()=>{
	    	let key = arguments[0];	// key 为事件句柄
	    	let args = [].concat(Array.prototype.slice.call(arguments, 1));
	
			if(this.Class[key] !== undefined && this.Class[key].length > 0) {
				for(var i in this.Class[key]) {
					this.Class[key][i].apply(null, args);
				}
			}
		})
	},
	listen(_this){
		this.publish('refresh', _this.state.key)
		// 监听/订阅  事件
		this.on('refresh', (v) => {_this.setState({ key: _this.state.key++ })})
	},
	refresh(){
		this.publish('refresh')
	}
}