(this["webpackJsonpreact-my"]=this["webpackJsonpreact-my"]||[]).push([[258],{138:function(t,e,n){"use strict";var a=Promise.all([n.e(0),n.e(2),n.e(1),n.e(3),n.e(22)]).then(n.bind(null,143)),c=Promise.all([n.e(0),n.e(2),n.e(1),n.e(14)]).then(n.bind(null,123)),o=window.$fn;e.a={interfaceConfirm:function(t,e,n,o){e?a.then((function(a){a.default({msg:"\u662f\u5426\u786e\u8ba4".concat(e,"\uff1f"),onOk:function(a){window.$http.submit(null,t,{param:n}).then((function(t){c.then((function(t){return t.default.success("".concat(e,"\u6210\u529f"))})),o(),a()}))}})})):window.$http.submit(null,t,{param:n}).then((function(t){c.then((function(t){return t.default.success("".concat(e,"\u6210\u529f"))})),o()}))},sysTime:function(t,e){var n=o.getUser(),a="9";a=o.hasObject(n)?e||(n.timeline_node?n.timeline_node:"9"):e||"9";var c=parseInt(a)>9?"".concat(a,":00:00"):"0".concat(a,":00:00"),i=new Date;i.getHours()<Number(a)?1===t&&i.setTime(i.getTime()-864e5):2===t&&i.setTime(i.getTime()+864e5);var u=i.getFullYear(),r=i.getMonth()+1>9?i.getMonth()+1:"0".concat(i.getMonth()+1),l=i.getDate()>9?i.getDate():"0".concat(i.getDate()),s=i.getHours()>9?i.getHours():"0".concat(i.getHours()),d=i.getMinutes()>9?i.getMinutes():"0".concat(i.getMinutes()),g=i.getSeconds()>9?i.getSeconds():"0".concat(i.getSeconds());return c?"".concat(u,"-").concat(r,"-").concat(l," ").concat(c):"".concat(u,"-").concat(r,"-").concat(l," ").concat(s,":").concat(d,":").concat(g)},intervalTime:function(t,e){var n=new Date,a=n;t&&(a=new Date(n.getTime()-24*t*60*60*1e3));var c=a.getFullYear(),o=a.getMonth()+1>9?a.getMonth()+1:"0".concat(a.getMonth()+1),i=a.getDate()>9?a.getDate():"0".concat(a.getDate()),u=a.getHours()>9?a.getHours():"0".concat(a.getHours()),r=a.getMinutes()>9?a.getMinutes():"0".concat(a.getMinutes()),l=a.getSeconds()>9?a.getSeconds():"0".concat(a.getSeconds());return e?"".concat(c,"-").concat(o,"-").concat(i," ").concat(e):"".concat(c,"-").concat(o,"-").concat(i," ").concat(u,":").concat(r,":").concat(l)},img_domain_url:function(t){if(t){var e=o.local("user");return e&&Object.keys(e).length>0&&e.img_domain?e.img_domain+t:t}return""},exportExcel:function(t){var e=t.api,n=t.apiType,a=t.param,c=t.cb;window.$http[n||"pull"](null,e,a).then((function(t){window.location.href=t.url,c&&c()}))},switchFlag:function(t){return t?1:0},flagSwitch:function(t){return"1"===String(t)}}},600:function(t,e,n){"use strict";n.r(e),n.d(e,"default",(function(){return y}));var a=n(5),c=n(2),o=n(22),i=n(23),u=n(27),r=n(25),l=n(24),s=n(0),d=n.n(s),g=n(138),f=window,h=f.$http,m=f.$fn,p=f.$async,b=Promise.all([n.e(0),n.e(2),n.e(1),n.e(14)]).then(n.bind(null,123)),w=p((function(){return n.e(5).then(n.bind(null,135))})),v=p((function(){return n.e(6).then(n.bind(null,137))})),_=p((function(){return Promise.all([n.e(0),n.e(1),n.e(4),n.e(11)]).then(n.bind(null,133))})),y=function(t){Object(r.a)(n,t);var e=Object(l.a)(n);function n(){var t;Object(o.a)(this,n);for(var a=arguments.length,i=new Array(a),r=0;r<a;r++)i[r]=arguments[r];return(t=e.call.apply(e,[this].concat(i))).isEdit=!1,t.state={data:[],pag:{},selectedKeys:[]},t.outsourStatusOption=[{label:"\u5168\u90e8",value:""},{label:"\u5f85\u6d3e\u9001",value:1},{label:"\u5df2\u9001\u8fbe",value:3}],t.outsourStatusOption1=[{label:"\u5168\u90e8",value:""},{label:"\u5f85\u6d3e\u9001",value:1},{label:"\u6d3e\u9001\u4e2d",value:2},{label:"\u5df2\u9001\u8fbe",value:3}],t.forms=[{label:"\u6d3e\u9001\u72b6\u6001",name:"outsourcing_status",type:"select",data:t.outsourStatusOption,nameStr:"label",idStr:"value"},{label:"\u5916\u9001\u65f6\u95f4",name:"date",type:"date-range",names:["start_date","end_date"]},{label:"\u6761\u7801\u53f7",name:"spec_code",type:"input"}],t.model={},t.fetch=function(e){return m.fetch.call(Object(u.a)(t),"specimen/myOutsourcingList",e)},t.cols=[{type:"checkbox"},{title:"\u5916\u9001\u5355\u4f4d",field:"outsourcing_company",width:150},{title:"\u6d3e\u9001\u72b6\u6001",field:"outsourcing_status",width:90,render:function(e){var n=e.rows;return m.filterSelect(t.outsourStatusOption1,n.outsourcing_status,"label","value")}},{title:"\u63a5\u6536\u65f6\u95f4",field:"created_at",width:150},{title:"\u6761\u7801",field:"spec_code",width:120},{title:"\u59d3\u540d",field:"patient_name",width:100},{title:"\u6027\u522b",field:"sex_name",width:60},{title:"\u5e74\u9f84",field:"age_first_val",width:80},{title:"\u81ea\u7136\u9879\u76ee",field:"parent_kind_name",width:300}],t.ButtonGroup=function(){return[{label:"\u5df2\u9001\u8fbe",ghost:!0,disabled:!m.hasArray(t.state.selectedKeys),onClick:function(){var e={outsourcing_status:3,spec_code:t.state.selectedKeys.map((function(t){return t.spec_code}))};h.submit(null,"specimen/changeOutsourcingStatus",{param:e}).then((function(e){b.then((function(t){return t.default.success("\u64cd\u4f5c\u6210\u529f")})),t.fetch(t.model)}))}},{label:"\u5bfc\u51fa",ghost:!0,disabled:!m.hasArray(t.state.data),onClick:function(){g.a.exportExcel({api:"specimen/myOutsourcingList",param:{param:Object(c.a)(Object(c.a)({},t.model),{},{export:"1"})}})}}]},t}return Object(i.a)(n,[{key:"componentDidMount",value:function(){this.fetch(this.model)}},{key:"render",value:function(){var t=this,e=this.state,n=e.data,c=e.pullLoading,o=e.pag;return Object(a.jsxs)(w,{title:"\u6211\u7684\u5916\u5305\u6e05\u5355",ButtonGroup:this.ButtonGroup(),children:[Object(a.jsx)(v,{data:this.forms,onChange:function(e,n){return m.onChange.call(t,e,n)},onSubmit:m.onSubmit.bind(this),onReset:m.onReset.bind(this,this.forms),loading:c,init:function(e){return t.form=e}}),Object(a.jsx)(_,{className:"xplr",cols:this.cols,data:n,loading:c,onRow:function(e){return t.setState({selectedKeys:e})},pag:o,onChange:function(e,n){return m.pageChange.call(t,{current:e,pageSize:n})},onSort:function(e){return m.onSort.call(t,e)}})]})}}]),n}(d.a.Component)}}]);