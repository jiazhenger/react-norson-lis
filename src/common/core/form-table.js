/* ======================================  表单搜索、表格展示数据、分页  ====================================== */
const _ = {
	fetch(api, param){
		window.$http.paging(this,api,{ param:{...param, ...this.model }, loading:false } )
	},
	onChange(v, press){
		let value = null
		for(let i in v){
			value = v[i]
		}
		window.$fn.setModels(this,v).then(data=>{
			if(press!==true || window.$fn.isEmpty(value)){ this.fetch() }
		})
	},
	onSubmit(){
		window.$fn.getBody(this.model)
		this.fetch()
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
	onReset(forms){
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
		
		this.fetch({})
	},
	pageChange({current, pageSize}){
		this.model = {...this.model, pageSize}
	    this.fetch({current})
	}
};

export default _