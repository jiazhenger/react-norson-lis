(this["webpackJsonpreact-my"]=this["webpackJsonpreact-my"]||[]).push([[111],{437:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return N}));var l=n(5),a=n(22),i=n(23),r=n(25),c=n(24),s=n(0),o=n.n(s),d=window,b=d.$fn,u=d.$async,m=u((function(){return Promise.all([n.e(0),n.e(2),n.e(1),n.e(12),n.e(337)]).then(n.bind(null,307))})),j=u((function(){return Promise.all([n.e(0),n.e(2),n.e(1),n.e(12),n.e(78)]).then(n.bind(null,318))})),h=u((function(){return Promise.all([n.e(0),n.e(2),n.e(1),n.e(3),n.e(13)]).then(n.bind(null,94))})),p=u((function(){return Promise.all([n.e(0),n.e(2),n.e(1),n.e(3),n.e(17)]).then(n.bind(null,146))})),f=u((function(){return Promise.all([n.e(0),n.e(2),n.e(1),n.e(12),n.e(19)]).then(n.bind(null,170))})),x=u((function(){return Promise.all([n.e(0),n.e(30)]).then(n.bind(null,204))})),O=u((function(){return n.e(33).then(n.bind(null,298))})),v={sortLabel:"\u4f4d\u7f6e\u6392\u5e8f",sortName:"sort",contentLabel:"\u5185\u5bb9",contentName:"content"},N=function(e){Object(r.a)(n,e);var t=Object(c.a)(n);function n(){var e;Object(a.a)(this,n);for(var l=arguments.length,i=new Array(l),r=0;r<l;r++)i[r]=arguments[r];return(e=t.call.apply(t,[this].concat(i))).state={paperTypeOption:[],checked:!1,loading:!1,addList:[{sortLabel:"\u4f4d\u7f6e\u6392\u5e8f",sortName:"sort",contentLabel:"\u5185\u5bb9",contentName:"content"}]},e}return Object(i.a)(n,[{key:"componentDidMount",value:function(){var e=this;b.getDisItem({code:38e3,callback:function(t){e.setState({paperTypeOption:t})}})}},{key:"render",value:function(){var e=this,t=this.state,n=t.paperTypeOption,a=t.addList,i=t.checked,r=t.loading,c=this.props.onClose;return Object(l.jsxs)(m,{className:"submit-form small-form fv ex ",layout:"horizontal",children:[Object(l.jsxs)("div",{className:"ex rel",children:[Object(l.jsxs)("div",{className:"fxw",children:[Object(l.jsx)(j,{label:"\u6807\u7b7e\u6a21\u677f\u540d\u79f0",name:"tpl_number",rules:[{required:!0}],children:Object(l.jsx)(p,{p:"\u8bf7\u8f93\u5165\u6807\u7b7e\u6a21\u677f\u540d\u79f0",width:180,bordered:!1,size:"middle"})}),Object(l.jsx)(j,{label:"\u7eb8\u578b",name:"tpl_number",children:Object(l.jsx)(f,{data:n,p:"\u8bf7\u9009\u62e9\u7eb8\u578b",width:180,bordered:!1,size:"middle",onChanged:function(e,t){}})})]}),Object(l.jsx)("div",{className:"mt15 ml20",children:Object(l.jsx)(x,{value:i,label:"\u53ea\u663e\u793a\u5f53\u524d\u6253\u5370\u673a\u652f\u6301\u7684\u7eb8\u578b",onChange:function(e){}})}),Object(l.jsx)("div",{className:"wh fv r5px bcf",children:Object(l.jsx)(O,{title:"\u5185\u5bb9\u8bbe\u7f6e",noPadding:!0,children:Object(l.jsx)(h,{label:"\u589e\u52a0",loading:r,onClick:function(t){var n=a;n.push(v),e.setState({addList:n}),console.log(a)}})})}),Object(l.jsx)("div",{className:"",children:b.hasArray(a)&&a.map((function(e,t){return Object(l.jsxs)("div",{className:"fxw fxm mt20",children:[Object(l.jsx)(j,{label:e.sortLabel,name:e.sortName,rules:[{required:e.required}],children:Object(l.jsx)(p,{p:"\u8bf7\u8f93\u5165".concat(e.sortLabel),width:120,bordered:!1,size:"middle"})}),Object(l.jsx)(j,{label:e.contentLabel,name:e.contentName,rules:[{required:e.required}],children:Object(l.jsx)(f,{data:n,p:"\u8bf7\u9009\u62e9\u5185\u5bb9",width:120,bordered:!1,size:"middle",onChanged:function(e,t){}})}),Object(l.jsx)(h,{className:"ml40",label:"\u5220\u9664",loading:r,onClick:function(e){}})]},t)}))})]}),Object(l.jsxs)("div",{className:"fxmc mt20",children:[Object(l.jsx)(h,{label:"\u53d6\u6d88",ghost:!0,className:"mr15",size:"middle",width:90,onClick:c}),Object(l.jsx)(h,{label:"\u786e\u5b9a Enter",htmlType:"sbumit",size:"middle",width:90})]})]})}}]),n}(o.a.Component)}}]);