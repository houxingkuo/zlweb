webpackJsonp([7],{"6Pom":function(t,a,e){"use strict";var i=e("7Ael"),s=(e.n(i),e("Dws6"));e.n(s)},hC99:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});e("6Pom");var i=e("1Zx3"),s=(e("vhY3"),e("ZAtG")),n=(e("5kso"),e("D/eJ")),c=(e("oOZB"),e("fT1p")),o=e("uvit"),r=e("cvKr");o.a.use(c.a),o.a.use(n.a),o.a.use(s.a),o.a.use(i.a);var d={name:"gamedetails",data:function(){return{status:!1,pageData:{},giftObj:{code:"",id:""}}},computed:{getUserInformation:function(){return this.$store.getters.getUserInformation}},watch:{getUserInformation:{handler:function(t,a){this.postPageData()},immediate:!0,deep:!0}},methods:{playgame:function(){this.$router.push("/gameapp/"+this.$route.params.id)},copycode:function(t){Object(r.b)(t,"礼包码复制成功",c.a)},getCode:function(t,a,e){var i=this;if(!Object(r.a)("gift"))return!1;this.$api.article.receiveGift({uid:this.getUserInformation.uid,id:t}).then(function(t){i.status=!0,i.pageData.gift[a].is_receive=1,i.pageData.gift[a].code=t.data.data.code,i.giftObj.code=t.data.data.code,i.giftObj.id=e}).catch(function(t){console.log(t)})},lockCode:function(t,a){this.status=!0,this.giftObj.code=t,this.giftObj.id=a},postPageData:function(){var t=this;this.$api.article.gameDetails({uid:this.getUserInformation.uid,gameid:this.$route.params.id}).then(function(a){console.log(a),t.pageData=a.data.data,t.pageData.id=t.$route.params.id,document.title=a.data.data.name}).catch(function(t){console.log(t)})}},created:function(){},mounted:function(){}},l={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{attrs:{id:"zlhy-detail-page"}},[e("van-sticky",[e("div",{staticClass:"game-bar"},[e("img",{staticClass:"pic",attrs:{src:t.pageData.icon,alt:t.pageData.name}}),t._v(" "),e("div",{staticClass:"info"},[e("h3",[t._v(t._s(t.pageData.name))]),t._v(" "),e("p",[t._v(t._s(t.pageData.publicity))])]),t._v(" "),e("a",{staticClass:"playgameBtn",attrs:{href:"javascript:void(0);",target:"_self"},on:{click:t.playgame}},[t._v("开始游戏")])])]),t._v(" "),e("div",{staticClass:"gameContent"},[""!=t.pageData.publicity?e("div",{staticClass:"introduce"},[e("label",{staticClass:"titlesMol"},[t._v("游戏简介")]),t._v(" "),e("p",{domProps:{innerHTML:t._s(t.pageData.publicity)}}),t._v(" "),e("div",{staticClass:"touch"},[e("ul",{style:{width:135*t.pageData.brief_img.length+"px"}},t._l(t.pageData.brief_img,function(t,a){return e("li",{key:a},[e("img",{staticStyle:{width:"125px",margin:"0 10px 0 0"},attrs:{src:t,alt:""}})])}),0)])]):t._e(),t._v(" "),void 0!==t.pageData.gift&&t.pageData.gift.length>0?e("div",{staticClass:"giftBox"},[e("label",{staticClass:"titlesMol",staticStyle:{"margin-top":"20px"}},[t._v("游戏礼包")]),t._v(" "),e("ul",t._l(t.pageData.gift,function(a,i){return e("li",{key:i},[e("div",{staticClass:"conText"},[e("div",{staticClass:"name"},[e("span",[t._v(t._s(a.name))])]),t._v(" "),e("p",{staticClass:"desc",domProps:{innerHTML:t._s(a.content)}}),t._v(" "),e("div",{staticClass:"progressBar"},[e("em",[t._v(t._s(a.surplus_sum)+"/"+t._s(a.total_sum))]),t._v(" "),e("span",{style:{width:a.surplus_sum/a.total_sum*100+"%"}})])]),t._v(" "),0==a.surplus_sum&&0==a.is_receive?e("a",{staticClass:"getGift",attrs:{href:"javascript:void(0);",target:"_self"}},[t._v("已完")]):0==a.is_receive?e("a",{staticClass:"getGift",attrs:{href:"javascript:void(0);",target:"_self"},on:{click:function(e){return t.getCode(a.id,i,t.pageData.id)}}},[t._v("领取")]):e("a",{staticClass:"getGift",attrs:{href:"javascript:void(0);",target:"_self"},on:{click:function(e){return t.lockCode(a.code,a.id)}}},[t._v("查看")])])}),0)]):t._e()]),t._v(" "),e("van-popup",{attrs:{round:""},model:{value:t.status,callback:function(a){t.status=a},expression:"status"}},[e("div",{attrs:{id:"giftFixed"}},[e("h2",[t._v("礼包兑换码")]),t._v(" "),e("div",{staticClass:"form"},[e("div",{staticClass:"list"},[e("input",{attrs:{type:"text",disabled:"disabled"},domProps:{value:t.giftObj.code}})]),t._v(" "),e("p",[t._v("游戏礼包兑换方式，点击下方复制按钮进行复制，再进入游戏内进行兑换即可")])]),t._v(" "),e("div",{staticClass:"btns"},[e("a",{attrs:{href:"javascript:void(0);",target:"_self"},on:{click:function(a){return t.copycode(t.giftObj.code)}}},[t._v("复制")]),t._v(" "),e("a",{attrs:{href:"javascript:void(0);",target:"_self"},on:{click:t.playgame}},[t._v("进入游戏")])])])])],1)},staticRenderFns:[]};var u=e("C7Lr")(d,l,!1,function(t){e("zOdC")},"data-v-03d48d0c",null);a.default=u.exports},zOdC:function(t,a){}});