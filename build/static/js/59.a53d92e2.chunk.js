(this["webpackJsonpreact-my"]=this["webpackJsonpreact-my"]||[]).push([[59],{138:function(t,e,n){"use strict";var a=Promise.all([n.e(0),n.e(2),n.e(1),n.e(3),n.e(22)]).then(n.bind(null,143)),c=Promise.all([n.e(0),n.e(2),n.e(1),n.e(14)]).then(n.bind(null,123)),o=window.$fn;e.a={interfaceConfirm:function(t,e,n,o){e?a.then((function(a){a.default({msg:"\u662f\u5426\u786e\u8ba4".concat(e,"\uff1f"),onOk:function(a){window.$http.submit(null,t,{param:n}).then((function(t){c.then((function(t){return t.default.success("".concat(e,"\u6210\u529f"))})),o(),a()}))}})})):window.$http.submit(null,t,{param:n}).then((function(t){c.then((function(t){return t.default.success("".concat(e,"\u6210\u529f"))})),o()}))},sysTime:function(t,e){var n=o.getUser(),a="9";a=o.hasObject(n)?e||(n.timeline_node?n.timeline_node:"9"):e||"9";var c=parseInt(a)>9?"".concat(a,":00:00"):"0".concat(a,":00:00"),i=new Date;i.getHours()<Number(a)?1===t&&i.setTime(i.getTime()-864e5):2===t&&i.setTime(i.getTime()+864e5);var r=i.getFullYear(),u=i.getMonth()+1>9?i.getMonth()+1:"0".concat(i.getMonth()+1),l=i.getDate()>9?i.getDate():"0".concat(i.getDate()),s=i.getHours()>9?i.getHours():"0".concat(i.getHours()),d=i.getMinutes()>9?i.getMinutes():"0".concat(i.getMinutes()),f=i.getSeconds()>9?i.getSeconds():"0".concat(i.getSeconds());return c?"".concat(r,"-").concat(u,"-").concat(l," ").concat(c):"".concat(r,"-").concat(u,"-").concat(l," ").concat(s,":").concat(d,":").concat(f)},intervalTime:function(t,e){var n=new Date,a=n;t&&(a=new Date(n.getTime()-24*t*60*60*1e3));var c=a.getFullYear(),o=a.getMonth()+1>9?a.getMonth()+1:"0".concat(a.getMonth()+1),i=a.getDate()>9?a.getDate():"0".concat(a.getDate()),r=a.getHours()>9?a.getHours():"0".concat(a.getHours()),u=a.getMinutes()>9?a.getMinutes():"0".concat(a.getMinutes()),l=a.getSeconds()>9?a.getSeconds():"0".concat(a.getSeconds());return e?"".concat(c,"-").concat(o,"-").concat(i," ").concat(e):"".concat(c,"-").concat(o,"-").concat(i," ").concat(r,":").concat(u,":").concat(l)},img_domain_url:function(t){if(t){var e=o.local("user");return e&&Object.keys(e).length>0&&e.img_domain?e.img_domain+t:t}return""},exportExcel:function(t){var e=t.api,n=t.apiType,a=t.param,c=t.cb;window.$http[n||"pull"](null,e,a).then((function(t){window.location.href=t.url,c&&c()}))},switchFlag:function(t){return t?1:0},flagSwitch:function(t){return"1"===String(t)}}},402:function(t,e,n){"use strict";n.r(e),n.d(e,"default",(function(){return y}));var a=n(5),c=n(22),o=n(23),i=n(27),r=n(25),u=n(24),l=n(0),s=n.n(l),d=n(138),f=window,h=f.$http,g=f.$fn,m=f.$async,p=m((function(){return Promise.all([n.e(0),n.e(2),n.e(1),n.e(3),n.e(13)]).then(n.bind(null,94))})),b=m((function(){return n.e(5).then(n.bind(null,135))})),w=m((function(){return n.e(6).then(n.bind(null,137))})),v=m((function(){return Promise.all([n.e(0),n.e(1),n.e(4),n.e(11)]).then(n.bind(null,133))})),y=function(t){Object(r.a)(n,t);var e=Object(u.a)(n);function n(){var t;Object(c.a)(this,n);for(var o=arguments.length,r=new Array(o),u=0;u<o;u++)r[u]=arguments[u];return(t=e.call.apply(e,[this].concat(r))).isEdit=!1,t.state={data:[],pag:{},selectedKeys:[]},t.forms=[{label:"\u6807\u672c\u7bb1\u53f7",name:"box_number",type:"input"},{label:"\u8fd0\u8f93\u65b9\u5f0f",name:"ship_type",type:"select",data:[],nameStr:"name",idStr:"value"},{label:"\u65e5\u671f",name:"date",type:"date-range",names:["startTime","endTime"]}],t.model={},t.fetch=function(e){return g.fetch.call(Object(i.a)(t),"gps-follow/index",e)},t.cols=[{type:"checkbox"},{title:"\u6807\u672c\u7bb1\u53f7",field:"box_number",width:150},{title:"\u5f53\u524d\u4f4d\u7f6e",field:"current_address",width:320},{title:"\u5f55\u5165\u65f6\u95f4",field:"gps_time",width:230},{title:"\u8fd0\u8f93\u4eba",field:"receiver_name",width:100},{title:"\u8fd0\u8f93\u65b9\u5f0f",field:"ship_type_name",width:100},{title:"\u72b6\u6001",field:"follow_status_name",width:100},{title:"\u64cd\u4f5c",align:"tc",width:100,render:function(t){t.rows;return Object(a.jsx)("div",{className:"plr5",children:Object(a.jsx)(p,{label:"\u67e5\u770b\u8f68\u8ff9",ghost:!0,onClick:function(){}})})}}],t.ButtonGroup=function(){return[{label:"\u624b\u52a8\u5f55\u5165",ghost:!0,onClick:function(){}},{label:"\u5220\u9664",ghost:!0,disabled:!g.hasArray(t.state.selectedKeys),onClick:function(){var e={uuid:t.state.selectedKeys.map((function(t){return t.uuid}))};d.a.interfaceConfirm("gps-follow/delete","\u5220\u9664",e,(function(){t.fetch(t.model)}))}}]},t}return Object(o.a)(n,[{key:"componentDidMount",value:function(){var t=this;g.dataSave("dis-item-43600-data").then((function(e){g.hasArray(e)?t.forms[1].data=e:h.submit(null,"dis-item/item",{param:{dis_code:43600},loading:!1}).then((function(e){t.forms[1].data=e,g.dataSave("dis-item-43600-data",e)}))})),this.fetch(this.model)}},{key:"render",value:function(){var t=this,e=this.state,n=e.data,c=e.pullLoading,o=e.pag;return Object(a.jsxs)(b,{title:"\u7269\u6d41\u8ddf\u8e2a",ButtonGroup:this.ButtonGroup(),children:[Object(a.jsx)(w,{data:this.forms,onChange:function(e,n){return g.onChange.call(t,e,n)},onSubmit:g.onSubmit.bind(this),onReset:g.onReset.bind(this,this.forms),loading:c,init:function(e){return t.form=e}}),Object(a.jsx)(v,{className:"xplr",cols:this.cols,data:n,loading:c,onRow:function(e){return t.setState({selectedKeys:e})},pag:o,onChange:function(e,n){return g.pageChange.call(t,{current:e,pageSize:n})},onSort:function(e){return g.onSort.call(t,e)}})]})}}]),n}(s.a.Component)}}]);