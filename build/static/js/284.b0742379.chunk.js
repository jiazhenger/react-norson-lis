(this["webpackJsonpreact-my"]=this["webpackJsonpreact-my"]||[]).push([[284],{455:function(t,e,n){"use strict";n.r(e),n.d(e,"default",(function(){return w}));var a=n(5),i=n(22),l=n(23),r=n(27),o=n(25),c=n(24),s=n(0),u=n.n(s),d=window,f=d.$fn,h=d.$async,p=h((function(){return n.e(5).then(n.bind(null,135))})),b=h((function(){return n.e(6).then(n.bind(null,137))})),m=h((function(){return Promise.all([n.e(0),n.e(1),n.e(4),n.e(11)]).then(n.bind(null,133))})),w=function(t){Object(o.a)(n,t);var e=Object(c.a)(n);function n(){var t;Object(i.a)(this,n);for(var a=arguments.length,l=new Array(a),o=0;o<a;o++)l[o]=arguments[o];return(t=e.call.apply(e,[this].concat(l))).state={data:[],pag:{},selectedKeys:[]},t.forms=[{label:"\u539f\u6761\u7801",name:"old_spec_code",type:"input"},{label:"\u521b\u5efa\u65f6\u95f4",name:"date",type:"date-range",names:["start_date","end_date"]}],t.model={},t.fetch=function(e){return f.fetch.call(Object(r.a)(t),"spec-split/index",e)},t.cols=[{title:"\u6807\u672c\u7c7b\u578b",field:"spec_type_name",width:150},{title:"\u539f\u6761\u7801",field:"new_spec_code",width:150},{title:"\u65b0\u6761\u7801",field:"old_spec_code",width:150},{title:"\u8bf4\u660e",field:"description",width:150},{title:"\u521b\u5efa\u65f6\u95f4",field:"created_at",width:150},{title:"\u72b6\u6001",field:"split_status",width:150,render:function(t){var e=t.rows;return window.$fn.filterSelect([{name:"\u505c\u6b62\u62c6\u5206",value:-1}],e.split_status,"name","value")}}],t.ButtonGroup=function(){return[]},t}return Object(l.a)(n,[{key:"componentDidMount",value:function(){this.fetch()}},{key:"render",value:function(){var t=this,e=this.state,n=e.data,i=e.pullLoading,l=e.pag;return Object(a.jsxs)(p,{title:"\u7981\u6b62\u62c6\u5206",ButtonGroup:this.ButtonGroup(),children:[Object(a.jsx)(b,{data:this.forms,onChange:function(e,n){return f.onChange.call(t,e,n)},onSubmit:f.onSubmit.bind(this),onReset:f.onReset.bind(this,this.forms),loading:i}),Object(a.jsx)(m,{className:"xplr",cols:this.cols,data:n,loading:i,onRow:function(e){return t.setState({selectedKeys:e})},pag:l,onChange:function(e,n){return f.pageChange.call(t,{current:e,pageSize:n})}})]})}}]),n}(u.a.Component)}}]);