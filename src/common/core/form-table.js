/* ======================================  表单搜索、表格展示数据、分页  ====================================== */
const _ = {
	fetch(api, param, cb){
		return window.$http.paging(this,api,{ param:{...param, ...this.model }, loading:false, callback: data=>{
			cb&&cb(data)
		} } )
	},
	onChange(v, press, callback, noFetch){
		let value = null
		for(let i in v){
			value = v[i]
		} 
		const params = callback ? callback() : null
		window.$fn.setModels(this, { ...v, ...params}).then(data=>{
			// 	// 薛 | 2020-10-21 | 判断是否需要change执行fetch方法 
			// 	let isInexecution = true
			// 	if (this.state.inexecution && this.state.inexecution.length) {
			// 		isInexecution = (this.state.inexecution.filter(j => j === Object.keys(v)[0])).length > 0 ? false : true
			// 	}   
			// if(isInexecution && (press!==true || window.$fn.isEmpty(value))){ this.fetch() }
			if(!noFetch && (press!==true || window.$fn.isEmpty(value))){ this.fetch() }
		})
	},
	onSubmit(){
		window.$fn.getBody(this.model)
		this.fetch()
		// callback && callback()
	},
	onSort(v){
		if(v){
			this.model = {...this.model, ...v}
		}else{
			delete this.model.sort
			delete this.model.sort_type
		}
		this.fetch()
	},
	onReset(forms, callback){
		//this.model = {}
		// this.cols.forEach(v=>{
		// 	if(v.order !== undefined){
		// 		delete v.order
		// 	}
		// })
		forms.forEach(v=>{
			const { name, names } = v
			if(names){
				delete this.model[names[0]]
				delete this.model[names[1]]
			}else{
				delete this.model[name]
			}
		})
		callback && callback()
		
		this.fetch({})
	},
	pageChange({current, pageSize}){
		this.model = {...this.model, pageSize}
	    this.fetch({current})
	}
};

export default _