webpackJsonp([6],{"7nyV":function(t,a){},HzJ8:function(t,a,i){t.exports={default:i("vY6q"),__esModule:!0}},"XO/m":function(t,a,i){var e=i("7NgR"),s=i("/tnA");t.exports=i("DH3n").getIterator=function(t){var a=s(t);if("function"!=typeof a)throw TypeError(t+" is not iterable!");return e(a.call(t))}},pSmS:function(t,a,i){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var e=i("HzJ8"),s=i.n(e),n=(i("5kso"),i("D/eJ"));i("uvit").a.use(n.a);var l={name:"shop",data:function(){return{informationTab:{index:1,item:["活动","公告","攻略"]},gameNewlistData:{npi:1,ids:"",data:[]}}},computed:{getUserInformation:function(){return this.$store.getters.getUserInformation},getTaskdot:function(){return this.$store.getters.getTaskdot}},methods:{newsdetails:function(t){this.$router.push({path:"/logsinfo/"+t})},logsTab:function(t){this.informationTab.index=t,this.gameNewlistData={npi:1,ids:"",data:[]},this.getNewlistData()},getNewlistData:function(){var t=this;this.$api.article.gameNewList({page:this.gameNewlistData.npi,type:this.informationTab.index+1,ids:this.gameNewlistData.ids}).then(function(a){t.gameNewlistData.npi=a.data.npi;var i=[],e=!0,n=!1,l=void 0;try{for(var o,r=s()(a.data.data.list);!(e=(o=r.next()).done);e=!0){var c=o.value;i.push(c.id),t.gameNewlistData.data.push(c)}}catch(t){n=!0,l=t}finally{try{!e&&r.return&&r.return()}finally{if(n)throw l}}t.gameNewlistData.ids=i.join(",")}).catch(function(t){console.log(t)})}},created:function(){this.getNewlistData()},mounted:function(){}},o={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{attrs:{id:"zhly-logs-page"}},[e("div",{staticClass:"logs-tab-warp"},[e("div",{staticClass:"tab-bg"},t._l(t.informationTab.item,function(a,i){return e("a",{key:i,attrs:{href:"javascript:void(0);",target:"_self"},on:{click:function(a){return t.logsTab(i)}}},[i===t.informationTab.index?e("span",{staticClass:"on"},[t._v(t._s(a))]):e("span",[t._v(t._s(a))])])}),0)]),t._v(" "),0==t.informationTab.index?e("div",{staticClass:"logs-content"},[0!=t.gameNewlistData.data.length?e("ul",{staticClass:"logsItem"},[t._l(t.gameNewlistData.data,function(a,i){return e("li",{key:i,on:{click:function(i){return t.newsdetails(a.id)}}},[e("label",{staticClass:"title"},[t._v(t._s(a.title))]),t._v(" "),e("span",[t._v(t._s(a.time))])])}),t._v(" "),0!=t.gameNewlistData.npi?e("p",{staticStyle:{padding:"30px 0","font-size":"14px"},on:{click:t.getNewlistData}},[t._v("点击加载更多")]):t._e()],2):e("div",{staticClass:"noKaifuGame"},[e("img",{attrs:{src:i("77eQ"),alt:"无数据",width:"50%"}})])]):1==t.informationTab.index?e("div",{staticClass:"logs-content"},[0!=t.gameNewlistData.data.length?e("ul",{staticClass:"logsItem"},[t._l(t.gameNewlistData.data,function(a,i){return e("li",{key:i,on:{click:function(i){return t.newsdetails(a.id)}}},[e("label",{staticClass:"title"},[t._v(t._s(a.title))]),t._v(" "),e("span",[t._v(t._s(a.time))])])}),t._v(" "),0!=t.gameNewlistData.npi?e("p",{staticStyle:{padding:"30px 0","font-size":"14px"},on:{click:t.getNewlistData}},[t._v("点击加载更多")]):t._e()],2):e("div",{staticClass:"noKaifuGame"},[e("img",{attrs:{src:i("77eQ"),alt:"无数据",width:"50%"}})])]):2==t.informationTab.index?e("div",{staticClass:"logs-content"},[0!=t.gameNewlistData.data.length?e("ul",{staticClass:"gameItem"},[t._l(t.gameNewlistData.data,function(a,i){return e("li",{key:i,on:{click:function(i){return t.newsdetails(a.id)}}},[e("div",{staticClass:"pic"},[e("img",{directives:[{name:"lazy",rawName:"v-lazy",value:a.icon,expression:"item.icon"}],attrs:{alt:a.name}})]),t._v(" "),e("div",{staticClass:"info"},[e("div",{staticClass:"title"},[e("label",{staticClass:"name"},[t._v(t._s(a.title))])]),t._v(" "),e("p",{staticClass:"desc"},[t._v(t._s(a.time))])]),t._v(" "),e("a",{staticClass:"playGameBtn",attrs:{href:"javascript:void(0);",target:"_self"}},[t._v("查看")])])}),t._v(" "),0!=t.gameNewlistData.npi?e("p",{staticStyle:{padding:"30px 0","font-size":"14px"},on:{click:t.getNewlistData}},[t._v("点击加载更多")]):t._e()],2):e("div",{staticClass:"noKaifuGame"},[e("img",{attrs:{src:i("77eQ"),alt:"无数据",width:"50%"}})])]):t._e()])},staticRenderFns:[]};var r=i("C7Lr")(l,o,!1,function(t){i("7nyV")},"data-v-056f4ab2",null);a.default=r.exports},vY6q:function(t,a,i){i("8LqW"),i("g5OY"),t.exports=i("XO/m")}});