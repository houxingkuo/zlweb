import axios from '@/utils/http'
import store from '@/store'
import QS from 'qs';
import { zhanlongHyRSA } from '@/utils/component'

/**
 * post header
 * 需添加时间戳和随机数this.dynamicNew (params)
 * 
 * 无需header的post，get正常形式请求
 */

const article = {
    // 登录
    login (params) {
        params.tune = store.state.tune;
        params.time = Date.parse(new Date()) / 1000;
        params.mp = 1;
        return axios.post(`/login/userLogin?reqdata=${zhanlongHyRSA(params)}`)
    },
    // 修改
    forgetPwd (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.post(`/user/forgetPwd?reqdata=${zhanlongHyRSA(params)}`)
    },
    // 发送验证码
    code (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.post(`/other/sendMsg?reqdata=${zhanlongHyRSA(params)}`)
    },
    // 个人中心
    personal (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.get(`/user/info?reqdata=${zhanlongHyRSA(params)}`)
    },
    // 签到
    userSign (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.get(`/user/signIn`, {params:params})
    },
    // 实名认证
    setIdCord (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.post(`/user/setIdcord?reqdata=${zhanlongHyRSA(params)}`)
    },
    // 绑定手机号
    bindPhone (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.post(`/user/bindPhone?reqdata=${zhanlongHyRSA(params)}`)
    },
    // 首页
    home (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.post(`/game/index?reqdata=${zhanlongHyRSA(params)}`)
    },
    // 最新上架
    gameShelves (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.get(`/game/newGame`, {params:params})
    },
    // 最新开服
    gameService (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.get(`/game/serverList`, {params:params})
        // return axios.get(`/game/newService`, {params:params})
    },
    // 游戏资讯
    gameNewList (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.get(`/game/newsList`, {params:params})
    },
    // 礼包列表
    gameGift (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.get(`/game/giftList?reqdata=${zhanlongHyRSA(params)}`)
    },
    // 领取礼包
    receiveGift (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.post(`/game/receiveGift?reqdata=${zhanlongHyRSA(params)}`)
    },
    // 兑换列表
    goodsList (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.get(`/game/goodsList`, {params:params})
    },
    // 积分日志
    integralLog (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.get(`/game/taskLog`, {params:params})
    },
    // 任务列表
    taskList (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.get(`/game/getTask?reqdata=${zhanlongHyRSA(params)}`)
    },
    // 我的礼包
    receiveGiftList (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.post(`/game/myGift?reqdata=${zhanlongHyRSA(params)}`)
    },
    // 游戏详情
    gameDetails (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.get(`/game/info?reqdata=${zhanlongHyRSA(params)}`)
    },
    // 咨询详情
    newsDetails (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.get(`/game/newsDetails`, {params:params})
    },
    // 我玩过的游戏
    getHotGame (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.get(`/game/getHotGame`, {params:params})
    },
    // 兑换详情
    goodsDetails (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.get(`/game/goodsDetail?reqdata=${zhanlongHyRSA(params)}`)
    },
    // 商品兑换
    goodsExchange (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.post(`/game/exchange?reqdata=${zhanlongHyRSA(params)}`)
    },
    // 积分兑换
    giftDetails (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.get(`/game/giftDetail?reqdata=${zhanlongHyRSA(params)}`)
    },
    // 获取平台币
    getCoin (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.post(`/user/getCoin?reqdata=${zhanlongHyRSA(params)}`)
    },
    // 创建订单
    createCoinOrder (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.post(`/order/createCoinOrder?reqdata=${zhanlongHyRSA(params)}`)
    },
    // 创建订单url打开
    createCoinOrderUrl (params) {
        params.time = Date.parse(new Date()) / 1000;
        return `${process.env.BASE_API}/order/createCoinOrder?reqdata=${zhanlongHyRSA(params)}`
    },
    // 获取微信code
    getWxLoginCode (params) {
        params.time = Date.parse(new Date()) / 1000;
        params.mp = 1;
        return `${process.env.BASE_API}/user/getWxLoginCode?${QS.stringify(params)}`
    },
    // 获取游戏地址
    getgameinfo (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.post(`/game/getGameUrl?reqdata=${zhanlongHyRSA(params)}`)
    },
    // 游戏sdk内容
    getsuspend (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.post(`/game/suspend?reqdata=${zhanlongHyRSA(params)}`)
    },
    // 游戏分类
    gameClassify () {
        return axios.post(`/game/gameClassify`)
    },
    // 游戏上报
    roleReport (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.get(`/game/roleReport`, {params:params})
    },
    // 发起订单支付
    createGameOrder (type, params) {
        params.time = Date.parse(new Date()) / 1000;
        if (type == 1) {
            return axios.post(`/order/createGameOrder?reqdata=${zhanlongHyRSA(params)}`)
        } else {
            return `${process.env.BASE_API}/order/createGameOrder?reqdata=${zhanlongHyRSA(params)}`
        }
    },
    // 平台币充值
    createCoinOrder (type, params) {
        params.time = Date.parse(new Date()) / 1000;
        if (type == 1) {
            return axios.post(`/order/createCoinOrder?reqdata=${zhanlongHyRSA(params)}`)
        } else {
            return `${process.env.BASE_API}/order/createCoinOrder?reqdata=${zhanlongHyRSA(params)}`
        }
    },
    // 获取平台币余额
    getCoin (params) {
        params.time = Date.parse(new Date()) / 1000;
        return axios.post(`/user/getCoin?reqdata=${zhanlongHyRSA(params)}`)
    }
}

export default article
