(this["webpackJsonpreact-my"]=this["webpackJsonpreact-my"]||[]).push([[290],{462:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return j}));var i=n(5),a=n(2),s=n(22),c=n(23),l=n(27),o=n(25),r=n(24),u=n(0),d=n.n(u),p=window,h=p.$http,m=p.$fn,b=p.$async,f=b((function(){return n.e(5).then(n.bind(null,135))})),_=b((function(){return n.e(6).then(n.bind(null,137))})),y=b((function(){return Promise.all([n.e(0),n.e(1),n.e(4),n.e(11)]).then(n.bind(null,133))})),g=n.e(9).then(n.bind(null,144)),j=function(e){Object(o.a)(n,e);var t=Object(r.a)(n);function n(){var e;Object(s.a)(this,n);for(var i=arguments.length,c=new Array(i),o=0;o<i;o++)c[o]=arguments[o];return(e=t.call.apply(t,[this].concat(c))).state={data:[],pag:{},selectedKeys:[],searchForm:[]},e.forms=[{label:"\u6253\u5370\u6570\u91cf",name:"copies",type:"input"},{label:"\u6279\u91cf\u6253\u5370",name:"is_batch",type:"checkbox"},{label:"\u6761\u7801\u53f7",name:"spec_number",type:"input",noVisible:!1},{label:"\u5f00\u59cb\u6761\u7801",name:"spec_start",type:"input",noVisible:!0},{label:"\u7ed3\u675f\u6761\u7801",name:"spec_end",type:"input",noVisible:!0},{label:"\u6807\u672c\u67b6\u4ee3\u7801",name:"sf_code",type:"input"}],e.model={},e.fetch=function(t){return h.paging(Object(l.a)(e),"receive/printlists",{param:Object(a.a)(Object(a.a)({},t),{},{pageSize:e.pageSize},e.model),loading:!1})},e.cols=[{type:"checkbox"},{title:"\u6807\u672c\u6761\u7801\u53f7",field:"spec_code",width:120},{title:"\u75c5\u4eba\u59d3\u540d",field:"patient_name",width:100},{title:"\u68c0\u6d4b\u9879\u76ee",field:"kind_name",width:100},{title:"\u5b9e\u9a8c\u53f7",field:"lb_tpl",width:100},{title:"\u5c97\u4f4d",field:"job_id",width:100},{title:"\u79d1\u5ba4",field:"team_name",width:100},{title:"\u6807\u672c\u67b6\u4ee3\u7801",field:"sf_code",width:150},{title:"\u6807\u672c\u7c7b\u578b",field:"spec_type_name",width:150},{title:"\u6807\u672c\u63a5\u6536\u65f6\u95f4",field:"sp_receive_time",width:150}],e.ButtonGroup=function(){return[{label:"\u6253\u5370\u5b9e\u9a8c\u53f7\u6807\u7b7e F2",code:"F2",disabled:!m.hasArray(e.selectedKeys),onClick:function(){}}]},e}return Object(c.a)(n,[{key:"componentDidMount",value:function(){var e=this;this.setState({searchForm:this.forms}),g.then((function(t){m.getCache({cache:t.default.ProjectTeamSelect,name:"name",id:"uuid",callback:function(t){m.hasArray(t)?e.forms[1].data=t:h.submit(null,"bs-hospital/select").then((function(t){e.forms[1].data=t,m.setCache()}))}})}))}},{key:"render",value:function(){var e=this,t=this.state,n=t.data,a=t.pullLoading,s=t.pag,c=t.searchForm;return Object(i.jsxs)(f,{title:"\u6253\u5370\u5b9e\u9a8c\u53f7",ButtonGroup:this.ButtonGroup(),children:[Object(i.jsx)(_,{data:c,onChange:function(t,n,i){var a=i.name;m.onChange.call(e,t,n,(function(){a&&"is_batch"===a&&(t.is_batch?(e.form.resetFields(["spec_number"]),c.forEach((function(e){"spec_number"===e.name?e.noVisible=!0:"spec_start"!==e.name&&"spec_end"!==e.name||(e.noVisible=!1)})),e.setState({searchForm:c})):(e.form.resetFields(["spec_start","spec_end"]),c.forEach((function(e){"spec_start"===e.name||"spec_end"===e.name?e.noVisible=!0:"spec_number"===e.name&&(e.noVisible=!1)})),e.setState({searchForm:c})))}),!0)},onSubmit:m.onSubmit.bind(this),onReset:m.onReset.bind(this,this.forms),loading:a,init:function(t){return e.form=t}}),Object(i.jsx)(y,{className:"xplr",cols:this.cols,data:n,loading:a,onRow:function(t){return e.setState({selectedKeys:t})},pag:s,onChange:function(t,n){return m.pageChange.call(e,{current:t,pageSize:n})}})]})}}]),n}(d.a.Component)}}]);