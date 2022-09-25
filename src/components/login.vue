<template>
    <div id="zlhy-login-page" @click="closeBingLogin">
        <div class="box" @click.stop>
            <div class="form" v-if="formType == 1">
                <div class="list">
                    <van-field v-model="account" :left-icon="require('@/assets/images/login/icon_account.png')" placeholder="请输入账号" />
                </div>
                <div class="list">
                    <van-field v-model="password" :left-icon="require('@/assets/images/login/icon_pwd.png')" type="password" placeholder="请输入密码" />
                </div>
                <div class="loginAgreement">
                    <van-checkbox v-model="checked" icon-size="15px" checked-color="#07c160">我已阅读</van-checkbox>
                    <span @click="onAgreement">《用户协议》</span>
                    <span @click="onPrivacy">《隐私政策》</span>
                </div>
                
                <a href="javascript:void(0);" target="_self" class="postBind" @click="postLoginData">登录</a>
                <div class="tabs">
                    <a href="javascript:void(0);" target="_self" class="tabs_l" @click="formType = 2">账号注册</a>
                    <a href="javascript:void(0);" target="_self" class="tabs_r" @click="formType = 3">忘记密码</a>
                </div>
            </div>
            <div class="form" v-else-if="formType == 2">
                <div class="list">
                    <van-field v-model="tel_zhuce" type="tel" :left-icon="require('@/assets/images/login/icon_phone.png')" placeholder="请输入手机号码" />
                </div>
                <div class="list">
                    <van-field
                    v-model="sms_zhuce"
                    center
                    clearable
                    placeholder="请输入短信验证码"
                    maxlength="6"
                    :left-icon="require('@/assets/images/login/icon_code.png')"
                    ></van-field>
                    <a href="javascript:void(0);" target="_self" class="getCode" style="background-color:#38dafd;" v-if="time_zhuce == 0" @click="timeOut(60)">获取验证码</a>
                    <a href="javascript:void(0);" target="_self" class="getCode" style="background-color:#cccccc;" v-else>{{ time_zhuce }}</a>
                </div>
                <div class="list">
                    <van-field v-model="password_zhuce" :left-icon="require('@/assets/images/login/icon_pwd.png')" type="password" placeholder="请输入密码" />
                </div>
                <a href="javascript:void(0);" target="_self" class="postBind" @click="postLoginData">注册登录</a>
                <div class="tabs">
                    <a href="javascript:void(0);" target="_self" class="tabs_l" @click="formType = 1">账号登录</a>
                </div>
            </div>
            <div class="form" v-else-if="formType == 3">
                <div class="list">
                    <van-field v-model="tel_xiugai" type="tel" :left-icon="require('@/assets/images/login/icon_phone.png')" placeholder="请输入手机号码" />
                </div>
                <div class="list">
                    <van-field
                    v-model="sms_xiugai"
                    center
                    clearable
                    placeholder="请输入短信验证码"
                    maxlength="6"
                    :left-icon="require('@/assets/images/login/icon_code.png')"
                    ></van-field>
                    <a href="javascript:void(0);" target="_self" class="getCode" style="background-color:#38dafd;" v-if="time_xiugai == 0" @click="timeOut(60)">获取验证码</a>
                    <a href="javascript:void(0);" target="_self" class="getCode" style="background-color:#cccccc;" v-else>{{ time_xiugai }}</a>
                </div>
                <div class="list">
                    <van-field v-model="password_xiugai" :left-icon="require('@/assets/images/login/icon_pwd.png')" type="password" placeholder="请输入密码" />
                </div>
                <a href="javascript:void(0);" target="_self" class="postBind" @click="postLoginData">修改密码</a>
                <div class="tabs">
                    <a href="javascript:void(0);" target="_self" class="tabs_l" @click="formType = 1">账号登录</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { Popup, Field, Button, Checkbox, CheckboxGroup, Toast } from 'vant';
import { setCookie, zhanlongHyLOGIN } from '@/utils/component'

Vue.use(Popup);
Vue.use(Field);
Vue.use(Button);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Toast);
export default {
    name: 'bindLogin',
    data () {
        return {
            clientType: 0,
            checked: true,
            formType: 1,
            tel_zhuce: '',
            sms_zhuce: '',
            password_zhuce: '',
            time_zhuce: 0,
            tel_xiugai: '',
            sms_xiugai: '',
            password_xiugai: '',
            time_xiugai: 0,
            account: '',
            password: '',
        }
    },
    methods: {
        closeBingLogin() {
            let login = this.$store.getters.getlogin;
            login.status = false;
            this.$store.commit('setLogin', login);
        },
        onPrivacy () {
            this.$router.push('/privacy');
        },
        onAgreement () {
            this.$router.push('/agreement');
        },
        // 60秒倒计时
        timeOut (wait) {
            let $this = this;
            if ($this.time_zhuce != 0 || $this.time_xiugai != 0) {
                Toast('发送验证码频繁');
                return false;
            }
            // 注册登录发送验证码
            if ($this.formType == 2) {
                if ($this.tel_zhuce == '') return false
                this.$api.article.code({
                    type: 1,
                    phone: $this.tel_zhuce,
                    uid: 0
                }).then(res=> {
                    console.log(res.data)
                    $this.time_zhuce = wait;
                    let timeClose = setInterval(() => {
                        $this.time_zhuce--;
                        if ($this.time_zhuce == 0) {
                            clearInterval(timeClose);
                        }
                    }, 1000);
                }).catch(err => {
                    console.log(err)
                })
            }
            // 修改登录发送验证码
            if ($this.formType == 3) {
                if ($this.tel_xiugai == '') return false
                this.$api.article.code({
                    type: 3,
                    phone: $this.tel_xiugai,
                    uid: 0
                }).then(res=> {
                    console.log(res.data)
                    $this.time_xiugai = wait;
                    let timeClose = setInterval(() => {
                        $this.time_xiugai--;
                        if ($this.time_xiugai == 0) {
                            clearInterval(timeClose);
                        }
                    }, 1000);
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        postLoginData () {
            // 账密登录
            if (this.formType == 1) {
                if (this.account == '') return false
                if (this.password == '') return false
                if (!this.checked) {
                    Toast('请勾选用户协议&隐私政策');
                    return false;
                }
                this.$api.article.login({
                    type: 3,
                    phone: this.account,
                    pwd: this.password,
                    tune: this.$store.getters.getTune,
                    client: 2,
                    clientType: this.clientType,
                    gameid: 0
                }).then(res=> {
                    console.log(res);
                    zhanlongHyLOGIN(res.data.data)
                }).catch(err => {
                    console.log(err)
                })
            }
            // 注册并登录
            if (this.formType == 2) {
                if (this.tel_zhuce == '') return false
                if (this.sms_zhuce == '') return false
                if (this.password_zhuce == '') return false
                this.$api.article.login({
                    type: 2,
                    phone: this.tel_zhuce,
                    code: this.sms_zhuce,
                    pwd: this.password_zhuce,
                    tune: this.$store.getters.getTune,
                    client: 2,
                    clientType: this.clientType,
                    gameid: 0
                }).then(res=> {
                    zhanlongHyLOGIN(res.data.data)
                }).catch(err => {
                    console.log(err)
                })
            }
            // 修改并登录
            if (this.formType == 3) {
                if (this.tel_xiugai == '') return false
                if (this.sms_xiugai == '') return false
                if (this.password_xiugai == '') return false
                this.$api.article.forgetPwd({
                    phone: this.tel_xiugai,
                    code: this.sms_xiugai,
                    pwd: this.password_xiugai
                }).then(res=> {
                    Toast('修改成功')
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    },
    created () {
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
            this.clientType = 2
        } else if (/(Android)/i.test(navigator.userAgent)) { //判断Android
            this.clientType = 1
        } else { //pc
            this.clientType = 3
        };
    },
    mounted () {}
}
</script>

<style lang="less" scoped>
#zlhy-login-page::after{
    content: "";
    width:100%;
    height:100%;
    position: absolute;
    left:0;
    top:0;
    background: inherit;
    filter: blur(6px);
    z-index: 2;
}
#zlhy-login-page{
    width: 375px;
    min-height: 100vh;
    background-image: url('../assets/images/login/bg.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    overflow: hidden;
    position: relative;
    .box{
        width: 290px;
        margin: 30% auto 0 auto;
        overflow: hidden;
        position: relative;
        z-index: 3;
        .icon{
            font-weight: bold;
            h3{
                display: block;
                text-align: center;
                font-size: 20px;
                padding: 10px;
                color: #333;
            }
        }
        .form{
            background: #fff;
            border-radius: 8px;
            padding: 20px;
            overflow: hidden;
            .list{
                margin: 0 0 10px;
                border-bottom: 1px solid #eee;
                display: flex;
                align-items: center;
                .getCode{
                    width: 120px;
                    padding: 7px 0;
                    font-size: 12px;
                    border-radius: 4px;
                    margin: 0 0 0 10px;
                    color: #fff;
                }
            }
            .postBind{
                display: block;
                line-height: 35px;
                color: #fff;
                font-size: 14px;
                background: #9e3118;
                border-radius: 35px;
            }
            .loginAgreement{
                display: flex;
                align-items: center;
                padding: 10px 0;
                span{
                    color: #38dafd;
                    text-decoration: underline;
                }
            }
            .tabs{
                padding: 10px 0;
                overflow: hidden;
                a{
                    font-size: 12px;
                    text-decoration: underline;
                    margin: 0 10px;
                }
                .tabs_l{color: #999;}
                .tabs_r{color: #999;}
            }
        }
    }
    .tips{
        display: block;
        font-size: 10px;
        padding: 10px 0;
        color: #999;
        text-align: left;
    }
}
/deep/.van-cell{padding: 10px 0 ;}
</style>
