import Vue from 'vue'
import App from './app'
import router from './router'
import store from './store'
import api from './api'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import './assets/css/reset.css'
import './assets/css/icon.css'
import './assets/css/font-awesome.min.css'
import 'lib-flexible/flexible.js'
import 'swiper/css/swiper.css'

// 隐私政策
import textPrivacy from '@/components/common/textPrivacy'
// 用户协议
import textAgreement from '@/components/common/textAgreement'
// 平台币充值规则
import textPtb from '@/components/common/textPtb'
// 绑定账号
import bindAccount from '@/components/common/bindAccount'
// 实名认证
import bindCard from '@/components/common/bindCard'
// 我的礼包
import bindGift from '@/components/common/bindGift'
// 登录
import bindLogin from './components/common/bindLogin'
// 安全备案号
import bindFooter from '@/components/common/bindFooter'
Vue.component('textPrivacy', textPrivacy)
Vue.component('textAgreement', textAgreement)
Vue.component('textPtb', textPtb)
Vue.component('bindAccount', bindAccount)
Vue.component('bindCard', bindCard)
Vue.component('bindGift', bindGift)
Vue.component('bindLogin', bindLogin)
Vue.component('bindFooter', bindFooter)

Vue.use(VueAwesomeSwiper)

// 将api挂载到vue的原型上
Vue.prototype.$api = api

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})
