import axios from 'axios'
import { Toast } from 'vant'
import { loginKickedOut } from '@/utils/component'
/**
  * 提示函数
  * 禁止点击蒙层、显示一秒后关闭
  */
const tip = msg => {
    Toast({
        position: 'top',
        message: msg,
        duration: 1000,
        forbidClick: true
    });
}

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
    // 状态码判断
    console.log(status)
    switch (status) {
        // 404请求不存在
        case 404:
            tip('请求的资源不存在')
            break;
        case 305:
            tip('您的账号已被封禁')
            loginKickedOut()
            break;
        case 306:
            tip('登录已过期')
            loginKickedOut()
            break;
        default:
            console.log(other);
            tip(other)
        }
}
// 创建axios实例
const instance = axios.create({
    // 公共接口--这里注意后面会讲
    baseURL: process.env.BASE_API,
    // 超时时间 单位是ms，这里设置了3s的超时时间
    timeout: 3 * 1000
})
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
/**
 * 请求拦截器
 * 每次请求前，检测是否需要加密验证
 */
// instance.interceptors.request.use(
//     config => {
//         if (config.method === 'post' && config.HACCESS) {
//             const data = QS.parse(config.data);
//             if (data.token || data.uid || data.app) {
//                 var hashDigest = CryptoJS.HmacSHA256(encodeURIComponent(QS.stringify(data)), data.token);
//                 var hashInBase64 = CryptoJS.enc.Base64.stringify(hashDigest);
//                 config.headers.LID = data.uid;
//                 config.headers.HACCESS = hashInBase64;
//             }
//         }
//         return config
//     },
//     error => Promise.error(error)
// )

// 响应拦截器
instance.interceptors.response.use(
    // 请求成功
    response => {
        if (response.status === 200) {
            if (response.data.code != 200) {
                errorHandle(response.data.code, response.data.msg)
                return Promise.reject(response)
            } else {
                return Promise.resolve(response)
            }
        } else {
            return Promise.reject(response)
        }
    },
    // 请求失败
    error => {
        const { response } = error;
        if (response) {
            // 请求已发出，但是不在2xx的范围
            errorHandle(response.status, response.data.msg)
            return Promise.reject(response)
        } else {
            // 处理断网的情况
            tip('请求超时')
            return Promise.reject(response)
            // eg:请求超时或断网时，更新state的network状态
            // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
            // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
        }
    }
)

export default instance
