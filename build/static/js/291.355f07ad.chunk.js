(this["webpackJsonpreact-my"]=this["webpackJsonpreact-my"]||[]).push([[291],{469:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return g}));var i=n(5),a=n(22),l=n(23),r=n(27),c=n(25),o=n(24),u=n(0),s=n.n(u),d=window,h=d.$fn,f=d.$async,p=f((function(){return n.e(5).then(n.bind(null,135))})),b=f((function(){return n.e(6).then(n.bind(null,137))})),m=f((function(){return Promise.all([n.e(0),n.e(1),n.e(4),n.e(11)]).then(n.bind(null,133))})),g=function(e){Object(c.a)(n,e);var t=Object(o.a)(n);function n(){var e;Object(a.a)(this,n);for(var i=arguments.length,l=new Array(i),c=0;c<i;c++)l[c]=arguments[c];return(e=t.call.apply(t,[this].concat(l))).state={data:[],pag:{},selectedKeys:[]},e.forms=[{label:"\u6807\u7bb1\u53f7",name:"box_num",type:"input"},{label:"\u6807\u672c\u6761\u7801",name:"spec_code",type:"input"},{label:"\u63a5\u6536\u4eba",name:"receive_user",type:"input"},{label:"\u63a5\u6536\u65f6\u95f4",name:"date",type:"date-range",names:["start_date","end_date"]}],e.model={},e.fetch=function(t){return h.fetch.call(Object(r.a)(e),"sp-box-receive-log/index",t)},e.cols=[{title:"\u6807\u7bb1\u7f16\u53f7",field:"box_num",width:145},{title:"\u5f55\u5165\u603b\u6807\u672c\u6570",field:"spec_num_total",width:145},{title:"\u63a5\u6536\u603b\u6807\u672c\u6570",field:"receive_count",width:145},{title:"\u5f00\u7bb1\u6e29\u5ea6",field:"warm",width:145},{title:"\u6807\u672c\u6761\u7801",field:"spec_code",width:145},{title:"\u6761\u7801\u6807\u672c\u6570",field:"spec_num",width:145},{title:"\u63a5\u6536\u4eba",field:"receive_user",width:145},{title:"\u63a5\u6536\u65f6\u95f4",field:"created_at",width:145}],e.ButtonGroup=function(){return[]},e}return Object(l.a)(n,[{key:"componentDidMount",value:function(){this.fetch()}},{key:"render",value:function(){var e=this,t=this.state,n=t.data,a=t.pullLoading,l=t.pag;return Object(i.jsxs)(p,{title:"\u6807\u672c\u7bb1\u63a5\u6536\u8bb0\u5f55",ButtonGroup:this.ButtonGroup(),children:[Object(i.jsx)(b,{data:this.forms,onChange:function(t,n){return h.onChange.call(e,t,n)},onSubmit:h.onSubmit.bind(this),onReset:h.onReset.bind(this,this.forms),loading:a}),Object(i.jsx)(m,{className:"xplr",cols:this.cols,data:n,loading:a,onRow:function(t){return e.setState({selectedKeys:t})},pag:l,onChange:function(t,n){return h.pageChange.call(e,{current:t,pageSize:n})}})]})}}]),n}(s.a.Component)}}]);