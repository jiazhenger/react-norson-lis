(this["webpackJsonpreact-my"]=this["webpackJsonpreact-my"]||[]).push([[301],{527:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return O}));var a=n(11),l=n.n(a),o=n(14),i=n(5),s=n(22),c=n(23),r=n(27),u=n(25),d=n(24),h=n(0),b=n.n(h),f=window,p=f.$http,m=f.$fn,g=f.$async,v=(Promise.all([n.e(0),n.e(2),n.e(1),n.e(3),n.e(22)]).then(n.bind(null,143)),Promise.all([n.e(0),n.e(2),n.e(1),n.e(14)]).then(n.bind(null,123))),w=g((function(){return n.e(5).then(n.bind(null,135))})),j=g((function(){return n.e(6).then(n.bind(null,137))})),y=g((function(){return Promise.all([n.e(0),n.e(1),n.e(4),n.e(11)]).then(n.bind(null,133))})),k=g((function(){return Promise.all([n.e(0),n.e(2),n.e(1),n.e(3),n.e(13)]).then(n.bind(null,94))})),O=function(e){Object(u.a)(n,e);var t=Object(d.a)(n);function n(){var e;Object(s.a)(this,n);for(var a=arguments.length,l=new Array(a),o=0;o<a;o++)l[o]=arguments[o];return(e=t.call.apply(t,[this].concat(l))).state={data:[],pag:{},selectedKeys:[],data1:{}},e.options=[{label:"\u672a\u5ba1\u6838",value:"0"},{label:"\u5ba1\u6838\u901a\u8fc7",value:"1"},{label:"\u5ba1\u6838\u672a\u901a\u8fc7",value:"-1"}],e.forms=[{label:"\u533b\u9662\u540d\u79f0",name:"hosp_name"},{label:"\u533b\u9662\u6027\u8d28",name:"nature",type:"select",data:[]},{label:"\u533b\u9662\u4ee3\u7801",name:"hosp_code"},{label:"\u533b\u9662\u7ea7\u522b",name:"level",type:"select",data:[]},{label:"\u72b6\u6001",name:"enabled",type:"select",data:e.options,nameStr:"label",idStr:"value"}],e.model={hosp_name:"",nature:"",hosp_code:"",level:"",enabled:""},e.fetch=function(t){return m.fetch.call(Object(r.a)(e),"bs-hospital/index",{param:t})},e.cols=[{type:"checkbox"},{title:"\u533b\u9662\u4ee3\u7801",field:"hosp_code",width:120},{title:"\u533b\u9662\u6761\u7801",field:"hosp_spec",width:120},{title:"\u533b\u9662\u540d\u79f0",field:"hosp_name",width:120},{title:"\u533b\u9662\u6027\u8d28",field:"nature_name",width:120},{title:"\u533b\u9662\u7ea7\u522b",field:"level_name",width:120},{title:"\u521b\u5efa\u65f6\u95f4",field:"create_at",width:120},{title:"\u72b6\u6001",field:"enabled",width:120,render:function(t){var n=t.rows;return window.$fn.filterSelect(e.options,n.enabled,"label","value")}},{title:"\u64cd\u4f5c",width:160,render:function(t){var n=t.rows;return Object(i.jsxs)("div",{className:"plr5",children:[Object(i.jsx)(k,{className:"mr10",label:"\u7f16\u8f91",ghost:!0,onClick:function(){m.push(Object(r.a)(e),m.getRoot().root+"businessList/LowerLevel-hospital-clients/add?id="+n.uuid+"&isEdit=1")}}),Object(i.jsx)(k,{label:"\u7269\u4ef7\u7ba1\u7406",ghost:!0,onClick:function(){console.log(n),m.push(Object(r.a)(e),m.getRoot().root+"businessList/hospital-clients/clients?id="+n.uuid)}})]})}}],e.ButtonGroup=function(){return[{label:"\u65b0\u589e F1",code:"F1",onClick:function(){m.push(Object(r.a)(e),m.getRoot().root+"businessList/LowerLevel-hospital-clients/add?isEdit=1")}},{label:"\u5ba1\u6838",ghost:!0,disabled:0===e.state.selectedKeys.length,onClick:function(){var t={uuid:e.state.selectedKeys.map((function(e){return e.uuid}))};p.submit(null,"bs-hospital/exam",{param:t}).then((function(e){v.then((function(e){return e.default.success("\u5ba1\u6838\u6210\u529f")}))}))}},{label:"\u6253\u5370",ghost:!0,onClick:function(){}},{label:"\u6587\u4ef6\u5bfc\u5165",ghost:!0,onClick:function(){console.log("upload")}}]},e}return Object(c.a)(n,[{key:"getDataAsync",value:function(){var e=Object(o.a)(l.a.mark((function e(){var t=this;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:m.getDisItem({code:44100,callback:function(e){t.forms[1].data=e,console.log(e)}}),m.getDisItem({code:39e3,callback:function(e){t.forms[3].data=e,console.log(e)}});case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},{key:"componentDidMount",value:function(){this.getDataAsync(),this.fetch(this.model)}},{key:"render",value:function(){var e=this,t=this.state,n=t.data,a=t.pullLoading,l=t.pag;return Object(i.jsxs)(w,{title:"\u533b\u9662\u5ba2\u6237",ButtonGroup:this.ButtonGroup(),children:[Object(i.jsx)(j,{data:this.forms,onChange:function(t,n){return m.onChange.call(e,t,n)},onSubmit:m.onSubmit.bind(this),onReset:m.onReset.bind(this,this.forms),loading:a}),Object(i.jsx)(y,{className:"xplr",cols:this.cols,data:n,loading:a,onRow:function(t){e.setState({data1:t}),e.setState({selectedKeys:t})},pag:l,onChange:function(t,n){return m.pageChange.call(e,{current:t,pageSize:n})},onSort:function(t){return m.onSort.call(e,t)}})]})}}]),n}(b.a.Component)}}]);