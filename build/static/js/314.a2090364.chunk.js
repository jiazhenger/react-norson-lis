(this["webpackJsonpreact-my"]=this["webpackJsonpreact-my"]||[]).push([[314],{571:function(e,s,t){"use strict";t.r(s),t.d(s,"default",(function(){return f}));var n=t(5),a=t(11),c=t.n(a),r=t(14),i=t(22),l=t(23),d=t(25),j=t(24),b=t(0),h=t.n(b),m=window,o=m.$http,u=m.$fn,p=m.$async,x=p((function(){return Promise.all([t.e(0),t.e(2),t.e(1),t.e(3),t.e(17)]).then(t.bind(null,146))})),O=p((function(){return Promise.all([t.e(0),t.e(2),t.e(1),t.e(3),t.e(13)]).then(t.bind(null,94))})),w=p((function(){return t.e(5).then(t.bind(null,135))})),f=function(e){Object(d.a)(t,e);var s=Object(j.a)(t);function t(){var e;Object(i.a)(this,t);for(var n=arguments.length,a=new Array(n),c=0;c<n;c++)a[c]=arguments[c];return(e=s.call.apply(s,[this].concat(a))).state={form:{},id:u.query("id"),model:{}},e}return Object(l.a)(t,[{key:"getDataAsync",value:function(){var e=Object(r.a)(c.a.mark((function e(){var s,t=this;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:(s=this.state.id)&&o.submit(null,"kd-report-spec/info",{param:{uuid:s}}).then((function(e){setTimeout((function(){t.setState({form:e})}))}));case 2:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"componentDidMount",value:function(){this.getDataAsync()}},{key:"render",value:function(){var e=this,s=this.state,t=s.form,a=s.id;return Object(n.jsx)(w,{title:a?"\u67e5\u770b\u62a5\u544a\u5355":"",children:Object(n.jsxs)("div",{className:"ex fv xplr pt10",children:[Object(n.jsx)("h6",{className:"w xmlr h40 bbor1 mb10",children:"\u62a5\u544a\u5355\u57fa\u7840\u4fe1\u606f"}),Object(n.jsxs)("div",{className:"fxw",children:[Object(n.jsxs)("div",{className:"ant-row mb20",style:{width:"25%"},children:[Object(n.jsx)("span",{children:"\u7f16\u53f7\uff1a"}),Object(n.jsx)("span",{className:"b",children:t.spec_num})]}),Object(n.jsxs)("div",{className:"ant-row mb20",style:{width:"25%"},children:[Object(n.jsx)("span",{children:"\u6807\u672c\u6761\u7801\uff1a"}),Object(n.jsx)("span",{className:"b",children:t.spec_code})]}),Object(n.jsxs)("div",{className:"ant-row mb20",style:{width:"25%"},children:[Object(n.jsx)("span",{children:"\u62a5\u544a\u5355\u8def\u5f84\uff1a"}),Object(n.jsx)("span",{className:"b",children:t.report_path})]}),Object(n.jsxs)("div",{className:"ant-row mb20",style:{width:"25%"},children:[Object(n.jsx)("span",{children:"\u6240\u5c5e\u533b\u9662\uff1a"}),Object(n.jsx)("span",{className:"b",children:t.hosp_name})]}),Object(n.jsxs)("div",{className:"ant-row mb20",style:{width:"25%"},children:[Object(n.jsx)("span",{children:"\u6240\u5c5e\u6d3e\u9001\u4eba\uff1a"}),Object(n.jsx)("span",{className:"b",children:t.salesman_name})]}),Object(n.jsxs)("div",{className:"ant-row mb20",style:{width:"25%"},children:[Object(n.jsx)("span",{children:"\u751f\u6210\u65f6\u95f4\uff1a"}),Object(n.jsx)("span",{className:"b",children:t.created_at})]}),Object(n.jsxs)("div",{className:"ant-row mb20",style:{width:"25%"},children:[Object(n.jsx)("span",{children:"\u6d3e\u9001\u5b8c\u6210\u65f6\u95f4\uff1a"}),Object(n.jsx)("span",{className:"b",children:t.update_at})]}),Object(n.jsxs)("div",{className:"ant-row mb20",style:{width:"25%"},children:[Object(n.jsx)("span",{children:"\u62a5\u544a\u5355\u72b6\u6001\uff1a"}),Object(n.jsx)("span",{className:"b",children:t.status_name})]})]}),Object(n.jsx)("h6",{className:"w xmlr h40 bbor1 mb10",children:"\u62a5\u544a\u5355\u6570\u636e"}),Object(n.jsx)(x,{value:t.json_data,width:"100%",mode:"textarea",rows:12}),Object(n.jsx)("div",{className:"mt20 tc",children:Object(n.jsx)(O,{label:"\u8fd4\u56de",size:"large",ghost:!0,className:"mr15",width:90,onClick:function(){u.back(e)}})})]})})}}]),t}(h.a.Component)}}]);