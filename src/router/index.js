import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import api from '@/api'
import { getCookie, zhanlongHyWxLogin, zhanlongHyLOGIN } from '@/utils/component'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject){
    return originalPush.call(this, location, onResolve, onReject)
  }
  return originalPush.call(this, location).catch(err => err)
}
const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'index',
            component: () => import('@/components'),
            meta: {
                title: '斩龙互娱',
                requireAuth: false
            },
            children: [
                {
                    path: '',
                    name: 'index',
                    component: () => import('@/components/home'),
                    meta: {
                        title: '斩龙互娱',
                        requireAuth: false
                    }
                },
                {
                    path: 'index',
                    component: () => import('@/components/home'),
                    meta: {
                        title: '斩龙互娱',
                        requireAuth: false
                    }
                },
                {
                    path: 'gift',
                    name: 'gift-page',
                    component: () => import('@/components/gift'),
                    meta: {
                        title: '游戏礼包',
                        requireAuth: false
                    }
                },
                {
                    path: 'logs',
                    name: 'logs-page',
                    component: () => import('@/components/logs'),
                    meta: {
                        title: '游戏资讯',
                        requireAuth: false
                    }
                },
                {
                    path: 'user',
                    name: 'user-page',
                    component: () => import('@/components/user'),
                    meta: {
                        title: '个人中心',
                        requireAuth: true
                    }
                }
            ]
        },
        {
            path: '/recharge',
            name: 'recharge-page',
            component: () => import('@/components/recharge'),
            meta: {
                title: '我的钱包',
                requireAuth: true
            }
        },
        {
            path: '/detail',
            name: 'detail-default',
            component: () => import('@/components/detail/default'),
            meta: {
                title: '游戏详情',
                requireAuth: false
            }
        },
        {
            path: '/detail/:id',
            name: 'detail-index',
            component: () => import('@/components/detail/index'),
            meta: {
                title: '游戏详情',
                requireAuth: false
            }
        },
        {
            path: '/logsinfo',
            name: 'logsinfo',
            component: () => import('@/components/news/default'),
            meta: {
                title: '咨询详情',
                requireAuth: false
            }
        },
        {
            path: '/logsinfo/:id',
            name: 'logsinfo-index',
            component: () => import('@/components/news/index'),
            meta: {
                title: '咨询详情',
                requireAuth: false
            }
        },
        {
            path: '/game',
            name: 'game-details',
            component: () => import('@/components/game/default'),
            meta: {
                title: '斩龙互娱游戏',
                requireAuth: true
            }
        },
        {
            path: '/game/:id',
            name: 'game-index',
            component: () => import('@/components/game/index'),
            meta: {
                title: '',
                requireAuth: true
            }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/components/login'),
            meta: {
                title: '登录',
                requireAuth: false
            }
        },
        {
            path: '/agreement',
            name: 'agreement',
            component: () => import('@/components/common/textAgreement'),
            meta: {
                title: '用户协议',
                requireAuth: false
            }
        },
        {
            path: '/privacy',
            name: 'privacy',
            component: () => import('@/components/common/textPrivacy'),
            meta: {
                title: '隐私政策',
                requireAuth: false
            }
        },
        {
            path: '*',
            name: '404',
            component: () => import('@/components/404'),
            meta: {
                title: '404',
                requireAuth: false
            }
        }
    ]
})

let clientType = function () {
    if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        return 2
    } else if (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1) {
        return 1
    } else {
        return 0
    }
}

/**
 * 路由守卫
 * 路由发生变化修改页面title
 * 判断该路由是否需要登录权限
 * 判断本地是否存在ZHANLONGHY_DATA
 * 如果本地存在ZHANLONGHY_DATA则不允许直接跳转到登录页面
 */
router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    let ua = window.navigator.userAgent.toLowerCase();
    let cookie = getCookie('ZHANLONGHY_DATA') == null || JSON.stringify(getCookie('ZHANLONGHY_DATA')) == "{}";
    let login = store.getters.getlogin;
    let user = store.getters.getUserInformation;
    let tune = store.getters.getTune;
    tune = to.query.tune ? to.query.tune : store.getters.getTune;
    store.commit('setChannel', tune);
    // vuex login
    if (to.matched.some(res=>res.meta.requireAuth)) {
        login.to = to;
        login.from = from;
        login.type = 'router';
        store.commit('setLogin', login);
    }
    // vuex user
    user.avatar = cookie ? '' : getCookie('ZHANLONGHY_DATA').info.avatar;
    user.nickname = cookie ? '' : getCookie('ZHANLONGHY_DATA').info.nickname;
    user.uid = cookie ? 0 : getCookie('ZHANLONGHY_DATA').info.uid;
    user.coin = cookie ? 0 : getCookie('ZHANLONGHY_DATA').info.coin;
    user.mobile = cookie ? 0 : getCookie('ZHANLONGHY_DATA').info.cellphone;
    store.commit('setUserInformation', user);
    // 检查url有code，并没有cookie，并且在微信三种情况满足下去做微信登录
    if (to.query.code && cookie && ua.match(/MicroMessenger/i) == 'micromessenger') {
        api.article.login({
            type: 4,
            code: to.query.code,
            tune: store.getters.getTune,
            gameid: 0,
            client: 2,
            clientType: clientType()
        }).then(res=> {
            zhanlongHyLOGIN(res.data.data)
        }).catch(err => {
            console.log(err)
        })
        return false;
    }
    // 判断该页面是否需要登陆
    if(to.matched.some(res=>res.meta.requireAuth) && cookie) {
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            zhanlongHyWxLogin(login)
        } else {
            next({ path: '/login' })
        }
    } else {
        if (to.query.tune || to.query.is_applet) {
            next()
            return false
        }
        if (from.query.tune || from.query.is_applet) {
            let toQuery = JSON.parse(JSON.stringify(to.query));
            if (from.query.is_applet) {
                toQuery.is_applet = from.query.is_applet;
            }
            if (from.query.tune) {
                toQuery.tune = from.query.tune;
            }
            router.push({
                path: to.path,
                query: toQuery
            })
        } else {
            next();
        }
    }
})
export default router
