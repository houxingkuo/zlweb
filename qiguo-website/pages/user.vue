<template>
    <section class="container">
        <header-page :channel="channel" tab="user" :tel="tel" :username="username" :status="status"/>
        <section id="h5_user_content">
            <section class="content_module">
                <div class="module_title">
                    <h3 class="size">个人资料</h3>
                </div>
                <div class="userInfoBox">
                    <img :src="userInfo.usericon" :alt="userInfo.username" class="userIcon">
                    <div class="userSize">
                        <h3>{{userInfo.username}}</h3>
                        <p>上次登录时间：{{userInfo.usertime}}</p>
                    </div>
                </div>
            </section>
            <section class="content_module mt20 relative">
                <button class="editorBtn" v-if="h5_shoucang_list.length > 0" @click="editorFun($event)">编辑</button>
                <div class="tabBtn">
                    <a href="javascript:void(0);" target="_self" class="on" @click="tabContent($event, 0)">我最近玩过的游戏</a>
                    <a href="javascript:void(0);" target="_self" @click="tabContent($event, 1)">我收藏的游戏</a>
                    <a href="javascript:void(0);" target="_self" @click="tabContent($event, 2)">游戏礼包</a>
                </div>
                <div class="tabItems">
                    <ul class="playGames on" v-if="my_history_play.length > 0">
                        <li v-for="(item) in my_history_play" :key="item.gamename">
                            <a href="" target="_blank">
                                <img :src="item.icon" :alt="item.gamename">
                                <p>{{item.gamename}}</p>
                            </a>
                        </li>
                    </ul>
                    <ul class="playGames on" v-else>
                        <li class="isnothing">
                            <p>还没有玩过的游戏，赶快去找喜欢的游戏玩吧！</p>
                        </li>
                    </ul>
                    <ul class="collectGames" v-if="h5_shoucang_list.length > 0">
                        <li v-for="(item) in h5_shoucang_list" :key="item.gamename">
                            <a href="" target="_blank">
                                <img :src="item.icon" :alt="item.gamename">
                                <p>{{item.gamename}}</p>
                            </a>
                        </li>
                    </ul>
                    <ul class="collectGames" v-else>
                        <li class="isnothing">
                            <p>暂无收藏的游戏！</p>
                        </li>
                    </ul>
                    <ul class="grabGames" v-if="uer_gamegrab.length > 0">
                        <li v-for="(item) in uer_gamegrab" :key="item.pid">
                            <div class="info">
                                <h4>{{item.grabname}}</h4>
                                <p>{{item.content}}</p>
                            </div>
                            <button>使用礼包</button>
                        </li>
                    </ul>
                    <ul class="grabGames" v-else>
                        <li class="isnothing">
                            <p>暂无游戏礼包！</p>
                        </li>
                    </ul>
                </div>
            </section>
        </section>
        <footer-page :channel="channel"/>
    </section>
</template>
<style lang="less" scoped>
@import '../static/css/user.less';
</style>
<script>
import 'iview/dist/styles/iview.css';
import HeaderPage from '~/components/HeaderPage.vue'
import FooterPage from '~/components/FooterPage.vue'
import axios from 'axios'
export default {
    data () {
        return {
            channel: 'qiguo_qgyx',
            status: false,
            target: '_self',
            token:'',
            username: 'xxx',
            tel: '',
            userInfo:{
                username: '',
                usericon: '',
                usertime: ''
            },
            editorStatus: true,
            my_history_play: [],
            h5_shoucang_list: [],
            uer_gamegrab: []
        }
    },
    head () {
        return {
            title: '用户中心',
            meta: [
                { hid: 'keywords', name: 'keywords', content: 'H5游戏,H5手机游戏,手机页游排行榜,免费H5游戏大全,七果H5游戏平台' },
                { hid: 'description', name: 'description', content: '七果H5游戏平台为广大玩家提供各类好玩的H5手机游戏、手机页游排行榜，让喜欢H5游戏的朋友可以找到最新最全的免费H5游戏。' }
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
        tabContent ($event, index) {
            if (this.editorStatus) {
                //按钮切换
                var el = document.getElementsByClassName('tabBtn');
                var $lis = el[0].children;
                for(var i = 0; i < $lis.length; i++){
                    $lis[i].classList.remove('on');
                }
                $event.path[0].className = 'on';
                //内容切换
                var $uls = document.getElementsByClassName('tabItems');
                var $ullist = $uls[0].children;
                for(var i = 0; i < $lis.length; i++){
                    $ullist[i].classList.remove('on');
                    if (i == index) {
                        $ullist[i].classList.add('on');
                    }
                }
                //编辑
                var $b = document.getElementsByClassName('editorBtn');
                if (index == 1) {
                    $b[0].style.display = 'block';
                } else {
                    $b[0].style.display = 'none';
                }
            }
        },
        editorFun ($event) {
            //编辑收藏游戏
            var $uls = document.getElementsByClassName('collectGames');
            var $lis = $uls[0].children;
            console.log($lis)
            if(this.editorStatus){
                this.editorStatus = false;
                $event.path[0].innerHTML = '完成';
                for(var i = 0; i < $lis.length; i++){
                    $lis[i].classList.add('shake_rotate');
                }
            }else{
                this.editorStatus = true;
                $event.path[0].innerHTML = '编辑';
                for(var i = 0; i < $lis.length; i++){
                    $lis[i].classList.remove('shake_rotate');
                }
            }
        },
        pagefun () {
            var cachedata = JSON.parse(localStorage.getItem('h5_qiguo_website'));
            if (cachedata != null) {
                /*显示我玩过的模块及隐藏快速登录入口*/
                this.status = true;
                /*非登录情况下登录页需要当前页面打开，登录后需要新开窗口打开*/
                this.target = '_blank';
                /*用户唯一值*/
                this.token = cachedata.token;
                /*页头需要参数*/
                this.username = cachedata.username;
            }
            if (this.token == '' || this.token == null) {
                this.$router.push({ path: '/'});
                return false;
            }
            //用户信息
            axios.get('http://h5.7guoyouxi.com/html/index/user_info',{
                params: {
                    token: this.token
                }
            })
            .then((res) => {
                this.userInfo.username = res.data.data.usernick;
                this.userInfo.usericon = res.data.data.userimg;
                this.userInfo.usertime = res.data.data.logintime;
            })
            //我玩过的游戏
            axios.get('http://h5.7guoyouxi.com/html/index/my_history_play',{
                params: {
                    token: this.token
                }
            })
            .then((res) => {
                this.my_history_play = res.data.data;
            })
            //我收藏的游戏
            axios.get('http://h5.7guoyouxi.com/html/index/h5_shoucang_list',{
                params: {
                    token: this.token
                }
            })
            .then((res) => {
                this.h5_shoucang_list = res.data.data;
            })
            //我收藏的游戏
            axios.get('http://h5.7guoyouxi.com/html/index/uer_gamegrab',{
                params: {
                    token: this.token
                }
            })
            .then((res) => {
                for (var i = 0; i < res.data.data.length; i++) {
                    res.data.data.pid = i;
                }
                this.uer_gamegrab = res.data.data;
            })
        }
    },
    mounted(){
        this.pagefun();
    }
}
</script>