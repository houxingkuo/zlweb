<template>
    <div id="zlhy-user-page">
        <div class="header">
            <div class="userInformation">
                <div class="avatar">
                    <img :src="getUserInformation.avatar" :alt="getUserInformation.nickname" width="100%" />
                </div>
                <div class="context">
                    <label>{{ getUserInformation.nickname }}</label>
                    <p>ID：{{ getUserInformation.uid }}</p>
                </div>
            </div>
        </div>
        <ul class="userItems">
            <li class="bind" @click="onBindGift">
                <i class="zlhy-icon zlhy-icon-gift"></i>
                <p>我的礼包</p>
            </li>
            <li class="bind" @click="onBindRecharge">
                <i class="zlhy-icon zlhy-icon-wallet"></i>
                <p>我的钱包</p>
                <span>&nbsp;</span>
            </li>
            <!-- <li class="bind" @click="onBindSign">
                <i class="zlhy-icon zlhy-icon-sign"></i>
                <p>今日签到</p>
                <span style="padding: 0 10px 0 0;" v-if="getUserInformation.is_sign">已签到</span>
                <span style="padding: 0 10px 0 0;" v-else>未签到</span>
            </li> -->
        </ul>
        <ul class="userItems">
            <li :class="{'bind': !getUserInformation.is_auth}" @click="onBindCard">
                <i class="zlhy-icon zlhy-icon-idcard"></i>
                <p>实名认证</p>
                <span v-if="getUserInformation.is_auth">已认证</span>
                <span style="padding: 0 10px 0 0;" v-else>未认证</span>
            </li>
            <li :class="{'bind': getUserInformation.mobile == ''}" @click="onBindAccount">
                <i class="zlhy-icon zlhy-icon-bind"></i>
                <p>绑定账号</p>
                <span v-if="getUserInformation.mobile != ''">已绑定</span>
                <span style="padding: 0 10px 0 0;" v-else>未绑定</span>
            </li>
            <li class="bind" @click="onAgreement">
                <i class="zlhy-icon zlhy-icon-agreement"></i>
                <p>用户协议</p>
                <span>&nbsp;</span>
            </li>
            <li class="bind" @click="onPrivacy">
                <i class="zlhy-icon zlhy-icon-privacy"></i>
                <p>隐私政策</p>
                <span>&nbsp;</span>
            </li>
            <li class="bind" @click="exitLogin">
                <i class="zlhy-icon zlhy-icon-exit"></i>
                <p>退出登录</p>
                <span>&nbsp;</span>
            </li>
        </ul>
        <bind-account data-title="绑定账号" v-if="accountStatus" @onBindAccount="onBindAccount" />
        <bind-card data-title="实名认证" v-if="idcardStatus" :cardstate="1" @onBindCard="onBindCard" />
        <bind-gift data-title="我的礼包" v-if="giftStatus" @onBindGift="onBindGift" />
    </div>
</template>

<script>
import Vue from 'vue';
import { Toast } from 'vant';
import { delCookie, getCookie } from '@/utils/component';

Vue.use(Toast);
export default {
    name: 'userpage',
    data () {
        return {
            accountStatus: false,
            idcardStatus: false,
            giftStatus: false
        }
    },
    computed: {
        getUserInformation () {
            return this.$store.getters.getUserInformation
        }
    },
    methods: {
        onPrivacy () {
            this.$router.push('/privacy');
        },
        onAgreement () {
            this.$router.push('/agreement');
        },
        onBindAccount (status) {
            if (this.getUserInformation.mobile) return false
            this.accountStatus = !this.accountStatus
        },
        onBindCard (data) {
            if (this.getUserInformation.is_auth) return false
            this.idcardStatus = !this.idcardStatus
        },
        onBindGift (status) {
            this.giftStatus = !this.giftStatus
        },
        onBindRecharge () {
            this.$router.push('/recharge');
        },
        exitLogin () {
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
            this.$router.push('/');
        },
        getUserData () {
            this.$api.article.personal({
                uid: getCookie('ZHANLONGHY_DATA').info.uid
            }).then(res=> {
                // 写入用户基本信息
                let data = this.$store.getters.getUserInformation;
                data.integral = res.data.data.integral;
                data.mobile = res.data.data.mobile;
                data.is_auth = res.data.data.is_auth;
                // 写入vuex
                this.$store.commit('setUserInformation', data);
            }).catch(err => {
                console.log(err)
            })
        }
    },
    created () {
        this.getUserData();
    },
    mounted () {}
}
</script>

<style lang="less" scoped>
#zlhy-user-page{
    width: 375px;
    padding-bottom: 20px;
    background: #F8F8F8;
    min-height: 100vh;
    .header{
        width: 100%;
        height: 130px;
        padding: 30px 10px;
        background-image: url('../../assets/images/banner.jpg');
        background-repeat: no-repeat;
        background-size: 100%;
        overflow: hidden;
        .userInformation{
            display: flex;
            align-items: center;
            height: 70px;
            .avatar{
                width: 70px;
                height: 70px;
                border-radius: 70px;
                background: #fff;
                overflow: hidden;
            }
            .context{
                flex: 1;
                padding: 0 12px;
                text-align: left;
                label{
                    font-size: 16px;
                    font-weight: bold;
                    color: #333;
                }
                p{
                    font-size: 14px;
                    color: #333;
                    font-weight: bold;
                }
            }
            .signBtn{
                line-height: 30px;
                padding: 0 15px;
                border-radius: 30px;
                box-shadow: 0 3px 3px rgba(102, 102, 102, 0.7);
                color: #fff;
                background-image: linear-gradient(26deg, #30c1fd 0%, #7ad2fd 95%);
                position: relative;
            }
        }
    }
    .userItems{
        margin: 20px 10px;
        padding: 0 10px;
        border-radius: 8px;
        background: #fff;
        li:last-child{
            border-bottom: 0;
        }
        .bind::after{
            display: block;
            border: 1px solid;
            content: '';
            border-color: transparent transparent #999 #999;
            right: 0;
            top: 50%;
            margin-top: -4px;
            width: 8px;
            height: 8px;
            position: absolute;
            transform: rotate(-135deg);
            -ms-transform: rotate(-135deg);
            -moz-transform: rotate(-135deg);
            -webkit-transform: rotate(-135deg);
            -o-transform: rotate(-135deg);
        }
        li{
            display: flex;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
            position: relative;
            cursor: pointer;
            p{
                flex: 1;
                text-align: left;
            }
        }
    }
}
</style>
