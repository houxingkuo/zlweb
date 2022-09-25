<template>
    <div class="game-ball-page" v-if="getgameinfopage">
        <!-- 遮罩层 -->
        <div class="game-overlay" @click="closeGameInfoPage"></div>
        <div class="game-btns">
            <div @click="toHome">
                <label :style="{'background-image': `url(${require('@/assets/images/icon/icon_game.png')}`}"></label>
                <p>更多游戏</p>
            </div>
            <div @click="reloadPage">
                <label :style="{'background-image': `url(${require('@/assets/images/icon/icon_init.png')}`}"></label>
                <p>刷新游戏</p>
            </div>
            <div @click="toHome">
                <label :style="{'background-image': `url(${require('@/assets/images/icon/icon_esc.png')}`}"></label>
                <p>退出游戏</p>
            </div>
        </div>
        <div class="game-tabbar-content">
            <!-- 用户信息 -->
            <div class="user-info-warp">
                <img :src="getUserInformation.avatar" class="userAvatar" alt="用户头像">
                <div class="info">
                    <p>{{ getUserInformation.nickname }}</p>
                    <span>uid:{{ getUserInformation.uid }}</span>
                </div>
                <div class="switch-account-btn" @click="loginStatus = true">
                    <img src="@/assets/images/icon/exit.png" alt="切换账号">
                    <p>切换帐号</p>
                </div>
            </div>
            <!-- 我的 -->
            <div class="tabbar-user-page" v-if="tabbarIndex == 0">
                <img src="@/assets/images/icon/hidden.png" alt="收起" class="close-tab-page" @click="tabbarIndex = -1">
                <div class="user-info">
                    <img :src="getUserInformation.avatar" alt="用户头像">
                    <div>
                        <p>{{ getUserInformation.nickname }}</p>
                        <span>uid:{{ getUserInformation.uid }}</span>
                    </div>
                </div>
                <ul>
                    <li>
                        <img src="@/assets/images/icon/icon_bind_tel.png" alt="">
                        <p>绑定手机</p>
                        <span class="on" v-if="getUserInformation.cellphone != ''">已绑定</span>
                        <span v-else @click="onBindAccount">未绑定</span>
                    </li>
                    <li>
                        <img src="@/assets/images/icon/icon_bind_authe.png" alt="">
                        <p>实名认证</p>
                        <span class="on" v-if="getUserInformation.is_auth">已认证</span>
                        <span v-else @click="onBindCard">未认证</span>
                    </li>
                </ul>
            </div>
            <!-- 礼包 -->
            <div class="tabbar-gift-page" v-if="tabbarIndex == 1">
                <img src="@/assets/images/icon/hidden.png" alt="收起" class="close-tab-page" @click="tabbarIndex = -1">
                <div class="touch">
                    <ul v-if="data.gift.ordinary.length != 0">
                        <li v-for="(item, index) in data.gift.ordinary" :key="item.id" :data-index="index">
                            <div class="gift-info">
                                <div class="gift-info-t">
                                    <img src="@/assets/images/icon/icon_lb.png" class="icon-lb" alt="礼包icon">
                                    <p class="gift-name">{{ item.name }}</p>
                                    <img src="@/assets/images/icon/icon_wh.png" class="icon-wh" alt="使用说明icon">
                                    <span @click="giftDescText = item.method;giftDesc = true">使用说明</span>
                                </div>
                                <div class="gift-info-b">
                                    {{ item.content }}
                                </div>
                            </div>
                            <div class="gift-get">
                                <button v-if="item.is_receive == 0" @click="getgiftcode(item.is_receive, item.id, index)">领取</button>
                                <button v-else @click="getgiftcode(item.is_receive, item.code)">查看</button>
                                <p>剩余:{{ item.surplus_sum }}</p>
                            </div>
                        </li>
                    </ul>
                    <img src="@/assets/images/icon/no-information.png" alt="" style="width: 40%;" v-else>
                </div>
            </div>
            <!-- 消息 -->
            <div class="tabbar-msg-page" v-else-if="tabbarIndex == 2">
                <img src="@/assets/images/icon/hidden.png" alt="收起" class="close-tab-page" @click="tabbarIndex = -1">
                <h3>我的消息</h3>
                <div class="touch">
                    <ul v-if="data.msg.list.length != 0">
                        <li v-for="(item, index) in data.msg.list" :key="index">
                            <label>{{ item.title }}</label>
                            <div v-html="item.content"></div>
                        </li>
                    </ul>
                    <img src="@/assets/images/icon/no-information.png" alt="" style="width: 40%;" v-else>
                </div>
            </div>
            <!-- 资讯 -->
            <div class="tabbar-logs-page" v-else-if="tabbarIndex == 3">
                <img src="@/assets/images/icon/hidden.png" alt="收起" class="close-tab-page" @click="tabbarIndex = -1">
                <van-tabs v-model="active">
                    <van-tab title="公告">
                        <div class="touch" v-if="data.information.notice.length != 0">
                            <div v-for="(item, index) in data.information.notice" :key="index" @click="logsFunc(item.id)">
                                <label>{{ item.content }}</label>
                                <p>{{ item.time }}</p>
                            </div>
                        </div>
                        <img src="@/assets/images/icon/no-information.png" alt="" style="width: 40%;" v-else>
                    </van-tab>
                    <van-tab title="活动">
                        <div class="touch" v-if="data.information.activity.length != 0">
                            <div v-for="(item, index) in data.information.activity" :key="index" @click="logsFunc(item.id)">
                                <label>{{ item.content }}</label>
                                <p>{{ item.time }}</p>
                            </div>
                        </div>
                        <img src="@/assets/images/icon/no-information.png" alt="" style="width: 40%;" v-else>
                    </van-tab>
                    <van-tab title="攻略">
                        <div class="touch" v-if="data.information.strategy.length != 0">
                            <div v-for="(item, index) in data.information.strategy" :key="index" @click="logsFunc(item.id)">
                                <label>{{ item.content }}</label>
                                <p>{{ item.time }}</p>
                            </div>
                        </div>
                        <img src="@/assets/images/icon/no-information.png" alt="" style="width: 40%;" v-else>
                    </van-tab>
                </van-tabs>
            </div>
            <!-- 客服 -->
            <div class="tabbar-server-page" v-else-if="tabbarIndex == 4">
                <img src="@/assets/images/icon/hidden.png" alt="收起" class="close-tab-page" @click="tabbarIndex = -1">
                <img src="@/assets/images/wx_kf.png" alt="" class="kf">
                <p>使用微信扫一扫<br>或长按识别联系客服</p>
            </div>
            <!-- 资讯内容 -->
            <div class="logs-content" v-if="logs.title != ''">
                <van-nav-bar
                :title="logs.title"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"
                />
                <div class="touch">
                    <div v-html="logs.content"></div>
                </div>
            </div>
        </div>
        <div class="game-tabbar">
            <div :class="{'tabbar-item': true, 'on': tabbarIndex == index}" data-tab="user" v-for="(item, index) in tabItem" :key="index" @click="tabbarIndex = index">
                <img class="icon" :src="item.icon" alt="">
                <p class="text">{{ item.name }}</p>
            </div>
        </div>
        <bind-account data-title="绑定账号" v-if="accountStatus" @onBindAccount="onBindAccount" />
        <bind-card data-title="实名认证" v-if="idcardStatus" @onBindCard="onBindCard" />
        <bind-login data-title="切换账号" v-if="loginStatus" @onBindLogin="onBindLogin" />
        <van-popup v-model="giftDesc" round class="showPanelFixed">
            <h3>礼包使用说明</h3>
            <div class="text" v-html="giftDescText"></div>
        </van-popup>
        <van-popup v-model="giftcodestate" round class="showCodeFixed">
            <h3 v-if="giftcode.state == 0">领取成功</h3>
            <h3 v-else>查看礼包</h3>
            <div class="text">券码：{{ giftcode.code }}</div>
            <button @click="giftcodestate = false">知道了</button>
        </van-popup>
    </div>
</template>

<script>
import Vue from 'vue';
import { Toast, Popup, Tab, Tabs, NavBar } from 'vant';

Vue.use(Toast);
Vue.use(Popup);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(NavBar);
export default {
    name: 'gameballpage',
    data () {
        return {
            tabItem: [{
                icon: require('@/assets/images/icon/icon_tabbar1.png'),
                name: '我的'
            },{
                icon: require('@/assets/images/icon/icon_tabbar2.png'),
                name: '礼包'
            },{
                icon: require('@/assets/images/icon/icon_tabbar3.png'),
                name: '消息'
            },{
                icon: require('@/assets/images/icon/icon_tabbar4.png'),
                name: '资讯'
            },{
                icon: require('@/assets/images/icon/icon_tabbar5.png'),
                name: '客服'
            }],
            tabbarIndex: -1,
            accountStatus: false,
            idcardStatus: false,
            loginStatus: false,
            data: {},
            giftDesc: false,
            giftDescText: '',
            giftcodestate: false,
            giftcode:{
                state: 0,
                code: ''
            },
            active: 1,
            logs:{
                title: '',
                content: ''
            }
        }
    },
    computed: {
        getgameinfopage () {
            return this.$store.getters.getgameinfopage;
        },
        getUserInformation () {
            return this.$store.getters.getUserInformation;
        }
    },
    methods: {
        reloadPage () {
            location.reload()
        },
        toHome () {
            this.$router.push({path: '/index'});
        },
        onClickLeft () {
            this.logs = {
                title: '',
                content: ''
            }
        },
        logsFunc (id) {
            this.$api.article.newsDetails({
                id: id
            }).then(res=> {
                this.logs = {
                    title: res.data.data.title,
                    content: res.data.data.content
                }
            }).catch(err => {
                console.log(err)
            })
        },
        onBindLogin () {
            this.loginStatus = !this.loginStatus
        },
        onBindAccount () {
            this.accountStatus = !this.accountStatus
        },
        onBindCard () {
            this.idcardStatus = !this.idcardStatus
        },
        closeGameInfoPage () {
            if (this.tabbarIndex == -1) {
                this.$store.commit('setgameinfopage', false)
            } else {
                this.tabbarIndex = -1
            }
        },
        getgiftcode (type, code, index) {
            if (type == 0) {
                // 领取礼包
                this.$api.article.receiveGift({
                    uid: this.getUserInformation.uid,
                    id: code
                }).then(res=> {
                    this.data.gift.ordinary[index].is_receive = 1
                    this.data.gift.ordinary[index].code = res.data.data.code
                    this.data.gift.ordinary[index].surplus_sum = res.data.data.surplus_sum
                    this.giftcode = {
                        state: 0,
                        code: res.data.data.code
                    }
                    this.giftcodestate = true
                }).catch(err => {
                    console.log(err)
                })
            } else {
                // 查看礼包
                this.giftcode = {
                    state: 1,
                    code: code
                }
                this.giftcodestate = true
            }
        },
        getdata () {
            this.$api.article.getsuspend({
                uid: this.getUserInformation.uid,
                id: this.$route.params.id
            }).then(res=> {
                console.log('1', res)
                this.data = res.data.data
            }).catch(err => {
                console.log(err)
            })
        }
    },
    created () {
        this.getdata();
    },
    mounted () {}
}
</script>

<style lang="less" scoped>
.game-ball-page{
    .game-overlay{
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9;
    }
    .close-tab-page{
        height: 20px;
        display: block;
        margin: 5px auto;
    }
    .game-btns{
        position: fixed;
        width: 50px;
        left: 13px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10;
        bottom: 220px;
        div{
            margin: 5px 0;
            label{
                width: 35px;
                height: 35px;
                border-radius: 100vh;
                background-color: #ff6e05;
                background-size: 50%;
                background-repeat: no-repeat;
                background-position: center;
                display: block;
                margin: 0 auto;
            }
            p{
                font-size: 10px;
                color: #fff;
                padding: 4px 0 0 0;
            }
        }
    }
    .game-tabbar{
        position: fixed;
        bottom: 30px;
        width: 350px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #fff;
        border-radius: 10px;
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
        .on::after{
            content: "";
            position: absolute;
            top: -30px;
            left: 50%;
            width: 0;
            height: 0;
            border: 10px solid;
            border-color: #fff transparent transparent;
            -webkit-transform: translateX(-50%);
            transform: translateX(-50%);
        }
        .tabbar-item{
            flex: 1;
            position: relative;
            img{
                width: 40px;
                margin: 0 auto;
            }
            p{
                font-size: 12px;
                color: #333;
            }
        }
    }
    .game-tabbar-content{
        .user-info-warp{
            position: fixed;
            width: 350px;
            padding: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            bottom: 130px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #fff;
            border-radius: 10px;
            z-index: 10;
            .userAvatar{
                width: 45px;
                height: 45px;
                border-radius: 100vh;
            }
            .info{
                flex: 1;
                padding: 0 8px;
                text-align: left;
                p{
                    font-size: 14px;
                    color: #333;
                }
                span{
                    font-size: 12px;
                    color: #999;
                }
            }
            .switch-account-btn{
                text-align: center;
                img{
                    height: 20px;
                }
                p{
                    font-size: 12px;
                    color: #333;
                }
            }
        }
        .tabbar-user-page{
            position: fixed;
            width: 350px;
            height: 60vh;
            bottom: 130px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #fff;
            border-radius: 10px;
            z-index: 11;
            .user-info{
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 10px;
                img{
                    width: 45px;
                    height: 45px;
                    border-radius: 100vh;
                }
                div{
                    flex: 1;
                    padding: 0 8px;
                    text-align: left;
                    p{
                        font-size: 14px;
                        color: #333;
                    }
                    span{
                        font-size: 12px;
                        color: #999;
                    }
                }
            }
            ul{
                li{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 15px 0;
                    margin: 0 10px;
                    border-bottom: 1px solid #EEEEEE;
                    img{
                        height: 15px;
                    }
                    p{
                        flex: 1;
                        padding: 0 10px;
                        font-size: 12px;
                        text-align: left;
                    }
                    span::after{
                        content: "";
                        display: block;
                        position: absolute;
                        right: 5px;
                        top: 50%;
                        margin-top: -4px;
                        width: 8px;
                        height: 8px;
                        border: 1px solid;
                        border-color: transparent transparent #999 #999;
                        transform: rotate(-135deg);
                    }
                    span.on{color: #ff6e05;}
                    span{
                        font-size: 12px;
                        color: #999;
                        position: relative;
                        padding: 0 14px 0 0;
                    }
                }
            }
        }
        .tabbar-server-page{
            position: fixed;
            width: 350px;
            height: 60vh;
            bottom: 130px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #fff;
            border-radius: 10px;
            z-index: 11;
            .kf{
                width: 50%;
                margin: 20% auto 0 auto;
                display: block;
            }
            p{
                font-size: 12px;
                color: #333;
            }
        }
        .tabbar-gift-page{
            position: fixed;
            width: 350px;
            height: 60vh;
            bottom: 130px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #fff;
            border-radius: 10px;
            z-index: 11;
            .touch{
                height: calc(60vh - 30px);
                overflow: scroll;
                ul{
                    li{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 15px 0;
                        margin: 0 10px;
                        border-bottom: 1px dashed #eee;
                        .gift-info{
                            flex: 1;
                            text-align: left;
                            padding: 0 10px 0 0;
                            .gift-info-t{
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                .icon-lb{
                                    height: 18px;
                                }
                                .icon-wh{
                                    height: 12px;
                                }
                                p{
                                    flex: 1;
                                    font-size: 12px;
                                    line-height: 20px;
                                    color: #333;
                                    font-weight: bold;
                                }
                                span{
                                    font-size: 10px;
                                    color: #999;
                                }
                            }
                        }
                        .gift-get{
                            width: 60px;
                            button{
                                display: block;
                                width: 100%;
                                height: 25px;
                                color: #fff;
                                font-size: 12px;
                                background: #ff6b00;
                                border: none;
                                border-radius: 4px;
                                outline: none;
                                margin: 0 auto;
                            }
                        }
                    }
                }
            }
        }
        .tabbar-msg-page{
            position: fixed;
            width: 350px;
            height: 60vh;
            bottom: 130px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #fff;
            border-radius: 10px;
            z-index: 11;
            h3{
                font-size: 18px;
                line-height: 30px;
                color: #333;
                display: block;
                text-align: left;
                padding: 0 10px;
            }
            .touch{
                height: calc(60vh - 60px);
                overflow: scroll;
                ul{
                    margin: 0 10px;
                    li{
                        padding: 10px 0;
                        text-align: left;
                        border-bottom: 1px dashed #eee;
                        label{font-size: 12px;color: #333;}
                        div{font-size: 12px;color: #999;}
                    }
                }
            }
        }
        .tabbar-logs-page{
            position: fixed;
            width: 350px;
            height: 60vh;
            bottom: 130px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #fff;
            border-radius: 10px;
            z-index: 11;
            .touch{
                height: calc(60vh - 80px);
                div{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 10px 0;
                    margin: 0 10px;
                    border-bottom: 1px dashed #cccccc;
                    label{
                        font-size: 12px;
                        color: #333;
                        flex: 1;
                        margin: 0 5px 0 0;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        text-align: left;
                    }
                    p{
                        font-size: 12px;
                        color: #999;
                    }
                }
            }
        }
        .logs-content{
            position: fixed;
            width: 350px;
            height: 60vh;
            bottom: 130px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #fff;
            border-radius: 10px;
            z-index: 12;
            /deep/.van-nav-bar{border-radius: 10px 10px 0 0;}
            .touch{
                height: calc(60vh - 50px);
                overflow: scroll;
                text-align: left;
                margin: 0 10px;
                font-size: 12px !important;
            }
        }
    }
    .showPanelFixed,.showCodeFixed{
        width: 250px;
        h3{
            font-size: 16px;
            color: #333;
            line-height: 50px;
        }
        .text{
            padding: 20px 10px;
        }
        button{
            display: block;
            width: 150px;
            line-height: 30px;
            border-radius: 8px;
            text-align: center;
            border: none;
            outline: none;
            font-size: 12px;
            color: #ffffff;
            margin: 10px auto 20px auto;
            background-image: linear-gradient(90deg, #71F7DE 0%, #52DCFA 100%);
        }
    }
}
</style>
