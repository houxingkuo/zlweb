<template>
    <section id="h5_login">
        <header-page :channel="channel" tab="login" :tel="tel"/>
        <div class="h5_login_content">
            <div class="login_box">
                <div class="login_desc">
                    <h2>H5游戏</h2>
                    <strong>手机页游排行榜&nbsp;&nbsp;|&nbsp;&nbsp;免费H5游戏大全&nbsp;&nbsp;|&nbsp;&nbsp;七果H5游戏平台</strong>
                    <p>七果H5游戏平台为广大玩家提供各类好玩的H5手机游戏</p>
                </div>
                <!-- 快速登录 -->
                <section class="login_module">
                    <div class="module_title">
                        <h3 class="size">快速登录</h3>
                    </div>
                    <form class="login_form">
                        <input type="tel" name="username" placeholder="请输入手机号">
                        <div class="code">
                            <input type="text" name="code" placeholder="请输入验证码">
                            <input type="button" name="button" value="获取验证码" @click="cellphone()">
                        </div>
                        <button type="button" @click="islogin()">立即登录</button>
                    </form>
                    <div class="login_party">
                        <router-link to="/qq.html" target="_self">
                            <img src="/img/login_qq.png" width="50px" height="50px">
                            <p>QQ登录</p>
                        </router-link>
                        <router-link to="/wx.html" target="_self">
                            <img src="/img/login_wx.png" width="50px" height="50px">
                            <p>微信登录</p>
                        </router-link>
                        <router-link to="/wb.html" target="_self">
                            <img src="/img/login_wb.png" width="50px" height="50px">
                            <p>微博登录</p>
                        </router-link>
                    </div>
                    <div class="down_app">
                        <a :href="'http://static.7guoyouxi.com/soft/corp/'+channel" target="_self">
                            <img src="/img/down_android.jpg" alt="安卓下载" width="100%">
                        </a>
                        <a href="javascript:void(0);" target="_self" @click="error('iPhone暂不支持下载')">
                            <img src="/img/down_ios.jpg" alt="IOS下载" width="100%">
                        </a>
                        <div class="qrcode">
                            <img src="http://www.7guoyouxi.com/img/code/qiguo_qgyx.png" alt="移动端二维码">
                            <p>扫码下载七果游戏</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <footer-page :channel="channel"/>
    </section>
</template>
<style lang="less" scoped>
@import '../static/css/login.less';
</style>
<script>
import 'iview/dist/styles/iview.css';
import HeaderPage from '~/components/HeaderPage.vue'
import FooterPage from '~/components/FooterPage.vue'
import axios from 'axios'
export default {
    data () {
        return {
            channel: 'qgyx_qgyx',
            tel: ''
        }
    },
    head () {
        return {
            title: 'H5游戏登录',
            meta: [
                { hid: 'keywords', name: 'keywords', content: '手游首充号,手机游戏首充号,手游首充号交易平台,手机游戏首充号充值折扣,七果手游首充号' },
                { hid: 'description', name: 'description', content: '七果手游首充号平台是玩家首选的手游首充号交易平台，提供各种手游首充号交易、手游首充号充值，更有超低折扣的手机游戏首充号，安全可靠,便宜到家。' }
            ]
        }
    },
    components: {
        HeaderPage,
        FooterPage
    },
    methods: {
        //显示成功提示
        success (info) {
            this.$Message.success({
                content: info,
                duration: 2
            });
        },
        //显示警告提示
        warning (info) {
            this.$Message.warning({
                content: info,
                duration: 2
            });
        },
        //显示错误提示
        error (info) {
            this.$Message.error({
                content: info,
                duration: 2
            });
        },
        cellphone () {
            var el = document.getElementsByClassName('login_form');
            var ov = document.getElementsByTagName('body');
            var cl = document.getElementById('mask');
            var fix = document.getElementById('qrcode_fixed');
            //输入框内的手机号
            var id = el[0][0].value;
            if(id.length != 11){
                this.error('输入的手机号有误');
                return false;
            }else{
                this.tel = id;
                ov[0].style.overflow = 'hidden';
                cl.style.display = 'block';
                fix.style.top = '20%';
            }
        },
        islogin () {
            var el = document.getElementsByClassName('login_form');
            console.log(el);
            //输入框内的手机号
            var user = el[0][0].value;
            var pwd = el[0][1].value;
            if (user.length != 11) {
                this.error('输入的手机号有误');
                return false;
            } else if (pwd == '') {
                this.error('请输入验证码');
                return false;
            } else {
                axios.get('http://h5.7guoyouxi.com/html/user/login',{
                    params: {
                        type:'2',
                        name: user,
                        pwd: pwd,
                        channel: this.channel
                    }
                })
                .then((res) => {
                    if (res.data.code == 0) {
                        /*
                        * localStorage储存
                        */
                        this.success('登录成功');
                        localStorage.setItem('h5_qiguo_website', JSON.stringify(res.data.data));
                        if (window.history.length <= 2) {
                            this.$router.push('/')
                        } else {
                            this.$router.back(-1)
                        }
                    } else {
                        this.error(res.data.msg);
                    }
                })
            }
        }
    },
    mounted(){
        console.log(window.history.length)
    }
}
</script>