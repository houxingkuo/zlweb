import Vue from 'vue'
import  Vuex from 'vuex'

Vue.use(Vuex)

const state  = {
    login: {
        to: {},
        from: {},
        type: 'router',
        status: false
    },
    userInformation: {
        avatar: require('@/assets/images/icon.png'),
        nickname: '',
        coin: 0,
        uid: 0,
        integral: 0,
        mobile: '',
        is_auth: false
    },
    tune: 1,
    browser: {
        isAndroid: false, //navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1
        isIOS: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        isWx: navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger"
    },
    taskdot: false,
    gameinfopage: false
}

// 读取
const getters =  {
    getlogin: (state) => { return state.login;},
    getUserInformation: (state) => { return state.userInformation;},
    getTune: (state) => { return state.tune;},
    getBrowser: (state) => { return state.browser;},
    getTaskdot: (state) => { return state.taskdot;},
    getgameinfopage: (state) => { return state.gameinfopage;}
}
// 设置
const mutations = {
    setLogin(state, data){state.login = data},
    setUserInformation(state, data){state.userInformation = data},
    setChannel(state, tune){state.tune = tune},
    setTaskdot(state, data){state.taskdot = data},
    setgameinfopage(state, data){state.gameinfopage = data}
}

const actions = {
    commitUserList:({commit}, userList) => commit('setUserList',userList)
}

const store = new Vuex.Store({
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
})

export default store
