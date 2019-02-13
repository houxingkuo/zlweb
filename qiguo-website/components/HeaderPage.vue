<template>
    <section id="h5_header">
        <div class="header_top1">
            <em class="collection" title="把H5游戏添加到浏览器标签">收藏本站</em>
            <div class="header_btn">
                <em class="header_save" title="保存到桌面">保存桌面</em>
                <p class="header_login" v-if="status == true">
                    <router-link to="/user" type="link" target="_self">{{username}}</router-link>&nbsp;&#124;&nbsp;<span @click="logout()">注销</span>
                </p>
                <router-link to="/login" type="link" target="_self" class="header_login" v-else>亲，请登录</router-link>
            </div>
        </div>
        <div class="header_top2" v-if="tab != 'login'">
            <router-link to="/" type="link" target="_self" class="header_logo">
                <img src="/img/logo.png" alt="H5游戏" width="100%;">
            </router-link>
            <nav>
                <router-link to="/" type="link" target="_self" :class="tab == 'home' ? 'on' : ''">首页</router-link>
                <router-link to="/grab" type="link" target="_self" :class="tab == 'grab' ? 'on' : ''">礼包</router-link>
                <router-link to="/apps" type="link" target="_self" :class="tab == 'apps' ? 'on' : ''">游戏库</router-link>
            </nav>
            <form action="/search/game" method="get" class="header_search">
                <input type="text" name="search" value="" autocomplete="off" placeholder="搜索游戏">
            </form>
        </div>
        <div id="mask"></div>
        <div id="qrcode_fixed">
            <img :src="'http://h5.7guoyouxi.com/html/imageVcode/send_img_vcode?cellphone=' + tel" alt="图片验证码">
            <a href="javascript:void(0);" target="_self" @click="qrcodeChange()">看不清，换一换</a>
            <input type="text" placeholder="请输入图片验证码" />
            <div class="btn">
                <button class="isok" @click="isok()">确认</button>
                <button class="isno" @click="isno()">暂不</button>
            </div>
        </div>
    </section>
</template>
<script>
import axios from 'axios'
export default {
    props: ['channel','tab','tel','username','status'],
    data () {
        return {
        }
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
        /*
        * 图片验证检测
        */
        isok () {
            var el = document.getElementById('qrcode_fixed');
            axios.get('http://h5.7guoyouxi.com/html/public/send_yzm',{
                params: {
                    cellphone: this.tel,
                    img_vcode: el.children[2].value
                }
            })
            .then((res) => {
                if (res.data.code == 0) {
                    this.isno();
                    this.success('获取成功');
                } else {
                    this.error(res.data.msg);
                }
            })
        },
        /*
        * 弹框取消
        */
        isno () {
            var ov = document.getElementsByTagName('body');
            var cl = document.getElementById('mask');
            var fix = document.getElementById('qrcode_fixed');
            ov[0].style.overflow = 'auto';
            cl.style.display = 'none';
            fix.style.top = '-100%';
        },
        /*
        * 换一换验证码
        */
        qrcodeChange () {
           var el = document.getElementById('qrcode_fixed');
           el.children[0].setAttribute('src', 'http://h5.7guoyouxi.com/html/imageVcode/send_img_vcode?cellphone=' + this.tel + '&'+ Math.random());
        },
        /*
        * 退出登录
        */
        logout () {
            localStorage.removeItem('h5_qiguo_website');
            this.$router.go(0);
        }
    },
    mounted(){

    }
}
</script>