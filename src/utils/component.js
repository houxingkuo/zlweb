
import Vue from 'vue';
import QS from 'qs';
import store from '@/store';
import router from '@/router';
import wx from 'weixin-js-sdk';
import api from '@/api'
import { Toast } from 'vant';

Vue.use(Toast);
/**
 *
 *获取cookie
 * @export
 * @param {*} key
 * @returns
 */
export function getCookie (key) {
    var reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)')
    var arr = new RegExp('(^| )' + key + '=([^;]*)(;|$)')
    try {
        arr = document.cookie.match(reg)
        return JSON.parse(unescape(arr[2]))
    } catch (err) {
        return null
    }
}

/**
 *
 *设置cookie
 * @export
 * @param {*} key
 * @param {*} value
 * @param {*} expiredays
 */
export function setCookie (key, value, expiredays) {
    var exdate = new Date()
    expiredays = expiredays || 365
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = key + '=' + escape(JSON.stringify(value)) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString()) + ';path=/'
}

/**
 *
 *删除cookie
 * @export
 * @param {*} key
 */
export function delCookie (key) {
    var exp = new Date()
    exp.setTime(exp.getTime() - 1)
    var cval = getCookie(key)
    if (cval != null) {
        document.cookie = key + '=' + cval + ';expires=' + exp.toGMTString() + ';path=/'
    }
}

/**
 *
 *复制功能
 * @export
 * @param {*} val 需要复制的内容
 */
export function copy(val, msg, Toast) {
    var input = document.createElement('input')
    input.value = val
    document.getElementById('app').appendChild(input).setAttribute('readOnly', 'true')
    input.select()
    Toast({
        position: 'top',
        message: msg
    })
    input.setSelectionRange(0, input.value.length)
    document.execCommand('Copy')
    document.getElementById('app').removeChild(input)
}

/**
 * RSA
 */
export function zhanlongHyRSA (parameterItems){
    var encrypt = new JSEncrypt()
    encrypt.setPublicKey("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDhK2RIUaEyYbfgbCqxejUlHQW9v1e53Yfex12BiGdQ2/QbFvFP0RzYIudlSY1V9AiSv73shcHARBDVNQR2OangPG3HCMA4ZII8mZMXRvF0gkhK+PI8TFRiKeX0cbHW3sUlVyym0FG0kokcy+8YQBhP+Z3Pus65VEqmxmRGerdNuQIDAQAB");
    var RasData = encrypt.encryptLong(QS.stringify(parameterItems))
    RasData = RasData.replace(/\+/g, "-");
    RasData = RasData.replace(/\//g, "_");
    RasData = RasData.replace(/=/g, "");
    return RasData
}

export function btnslogincheck (state, id) {
    var ua = window.navigator.userAgent.toLowerCase();
    let cookie = getCookie('ZHANLONGHY_DATA') == null || JSON.stringify(getCookie('ZHANLONGHY_DATA')) == "{}";
    // 领取礼包
    if (cookie) {
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            //微信环境下
            zhanlongHyWxLogin({to:{fullPath: location.href}})
            return false;
        } else {
            //非微信环境逻辑
            router.push({ path: '/login' });
            return false;
        }
    } else {
        return true;
    }
}

// 微信授权登录
export function zhanlongHyWxLogin (login) {
    wx.miniProgram.getEnv(function(res) {
        location.href = api.article.getWxLoginCode({
            type: res.miniprogram ? 2 : 1,
            url: `${location.origin}${login.to.fullPath}`,
            state: ''
        })
    })
}

/**
 * login 判断
 */
export function zhanlongHyLOGIN (data) {
    console.log(data)
    // 写入用户基本信息
    let userStore = store.getters.getUserInformation;
    userStore.avatar = data.info.avatar;
    userStore.nickname = data.info.nickname;
    userStore.uid = data.info.uid;
    userStore.coin = data.info.coin;
    userStore.mobile = data.info.cellphone;
    store.commit('setUserInformation', userStore);
    // 写入登录状态
    let loginStore = store.getters.getlogin;
    loginStore.status = false;
    store.commit('setLogin', loginStore);
    setCookie('ZHANLONGHY_DATA', data);
    if (loginStore.to.path && loginStore.to.path.indexOf('/login') == -1) {
        router.push({ path: loginStore.to.path });
    } else if (loginStore.from.path && loginStore.from.path.indexOf('/login') == -1) {
        router.push({ path: loginStore.from.path });
    } else {
        router.push({ path: '/' });
    }
}

/**
 * 账号多端登录
 * @returns 
 */
 export function loginKickedOut () {
    return setTimeout(() => {
        delCookie('ZHANLONGHY_DATA');
        // 初始
        let data = this.$store.getters.getUserInformation;
        data.avatar = '';
        data.nickname = '';
        data.coin = 0;
        data.uid = 0;
        data.gift_sum = 0;
        data.integral = 0;
        data.mobile = false;
        data.is_auth = false;
        this.$store.commit('setUserInformation', data);
        router.push({path: '/login'})
    }, 0);
}

/**
 *
 *获取平台
 * @export
 * @returns
 */
 export function isSysName() {
    var ua = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(ua) || /macintosh/.test(ua)) {
        return 'ios'
    } else if (/android/.test(ua)) {
        return 'android'
    } else {
        return 'pc'
    }
  }
  
  
  /**
   *
   *获取浏览器内核标识版本
   * @export
   * @returns
   */
  export function getBrowserInfo() {
    var agent = navigator.userAgent.toLowerCase()
    var regStr_ie = /msie [\d.]+;/gi
    var regStr_ff = /firefox\/[\d.]+/gi
    var regStr_chrome = /chrome\/[\d.]+/gi
    var regStr_saf = /safari\/[\d.]+/gi
    var reStr_applewebkit = /applewebkit\/[\d.]+/gi
    // IE
    if (agent.indexOf('msie') > 0) {
      return agent.match(regStr_ie)[0]
    }
    // firefox
    if (agent.indexOf('firefox') > 0) {
      return agent.match(regStr_ff)[0]
    }
    // Chrome
    if (agent.indexOf('chrome') > 0) {
      return agent.match(regStr_chrome)[0]
    }
    // Safari
    if ((agent.indexOf('safari') > 0 && agent.indexOf('chrome') < 0)) {
      return agent.match(regStr_saf)[0]
    }
    if (agent.indexOf('applewebkit') > 0 && agent.indexOf('chrome') < 0) {
      return agent.match(reStr_applewebkit)[0]
    }
  }
