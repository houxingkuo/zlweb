<template>
    <section class="container">
        <header-page :channel="channel" tab="home" :tel="tel" :username="username" :status="status"/>
        <section id="h5_content">
            <!-- 左侧内容 -->
            <div class="content_left">
                <!-- 轮播 -->
                <Carousel 
                :autoplay="touchSlide.autoplay"
                :autoplay-speed="touchSlide.autoplaySpeed"
                :dots="touchSlide.dots"
                :radius-dot="touchSlide.radiusDot"
                :trigger="touchSlide.trigger"
                :arrow="touchSlide.arrow"
                class="slider">
                    <CarouselItem v-for="(item) in slideData"
                    :key="item.title" :title="item.title">
                        <nuxt-link :to="'/game/' + item.gameid" :channel="channel" target="_blank">
                            <img :src="item.img" :alt="item.title">
                        </nuxt-link>
                    </CarouselItem>
                </Carousel>
                <!-- 我玩过的游戏 -->
                <section class="content_module mt20" v-if="gamesPlayed.length != 0">
                    <div class="module_title">
                        <h3 class="size">玩过的游戏</h3>
                    </div>
                    <ul class="games_played">
                        <li v-for="(item, index) in gamesPlayed" :key="item.gameid" v-if="index <= 4">
                            <nuxt-link :to="'/game/' + item.gameid" :channel="channel" target="_blank">
                                <img :src="item.icon" :alt="item.gamename" width="100%;">
                                <p :title="item.gamename">{{item.gamename}}</p>
                            </nuxt-link>
                        </li>
                    </ul>
                </section>
                <!-- 最新游戏 -->
                <section class="content_module mt20">
                    <div class="module_title">
                        <h3 class="size">最新游戏</h3>
                        <router-link to="/apps" target="_blank" class="more">更多+</router-link>
                    </div>
                    <ul class="game_news">
                        <li v-for="(item) in gamesNews" :key="item.gameid">
                            <nuxt-link :to="'game/'+item.gameid" :channel="channel" target="_blank" class="pic">
                                <img :src="item.icon" :alt="item.gamename" width="100%">
                            </nuxt-link>
                            <div class="info">
                                <p class="title" :title="item.gamename">{{item.gamename}}</p>
                                <p class="time">上线时间：<span :title="item.created">{{item.created}}</span></p>
                                <router-link :to="'/play?gameid=' + item.gameid" :target="target" class="play" v-if="status == true">开始玩</router-link>
                                <router-link to="/login" :target="target" class="play" v-else>开始玩</router-link>
                            </div>
                        </li>
                    </ul>
                </section>
                <!-- 精选游戏 -->
                <section class="content_module mt20">
                    <div class="module_title">
                        <h3 class="size">精选游戏</h3>
                        <router-link to="/apps" target="_blank" class="more">更多+</router-link>
                    </div>
                    <ul class="game_select">
                        <li v-for="(item) in gamesSelect" :key="item.gameid">
                            <img :src="item.img" :alt="item.gamename" width="100%" class="pic">
                            <div class="fix">
                                <nuxt-link :to="'/game/' + item.gameid" :channel="channel" target="_blank" class="info">
                                    <p class="title" :title="item.gamename">{{item.gamename}}</p>
                                    <p class="sentiment">
                                        <img src="/img/sentiment.png" alt="人气">
                                        <span :title="item.rs">{{item.rs}}</span>
                                    </p> 
                                </nuxt-link>
                                <router-link :to="'/play?gameid=' + item.gameid" :target="target" class="play" v-if="status == true">开始玩</router-link>
                                <router-link to="/login" :target="target" class="play" v-else>开始玩</router-link>
                            </div> 
                        </li>
                    </ul>
                </section>
            </div>
            <!-- 右侧内容 -->
            <div class="content_right">
                <!-- 快速登录 -->
                <section class="content_module">
                    <div class="module_title" v-if="status == false">
                        <h3 class="size">快速登录</h3>
                    </div>
                    <form class="login_form" v-if="status == false">
                        <input type="tel" name="username" placeholder="请输入手机号">
                        <div class="code">
                            <input type="text" name="code" placeholder="请输入验证码">
                            <input type="button" name="button" value="获取验证码" @click="cellphone()">
                        </div>
                        <button type="button" @click="islogin()">立即登录</button>
                    </form>
                    <div class="login_party" v-if="status == false">
                        <router-link to="" target="_self">
                            <img src="/img/login_qq.png" width="50px" height="50px">
                            <p>QQ登录</p>
                        </router-link>
                        <router-link to="" target="_self">
                            <img src="/img/login_wx.png" width="50px" height="50px">
                            <p>微信登录</p>
                        </router-link>
                        <router-link to="" target="_self">
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
                <!-- 游戏礼包 -->
                <section class="content_module mt20">
                    <div class="module_title">
                        <h3 class="size">游戏礼包</h3>
                        <router-link to="grab" target="_blank" :channel="channel" class="more">更多+</router-link>
                    </div>
                    <ul class="game_grab" id="gameGrab">
                        <li @mouseenter="grabHoverStyle ($event)"  v-for="(item, index) in hotGrab" :key="item.grabname" :class="index == 0 ? 'on' : ''">
                            <nuxt-link :to="'game/'+item.gameid" target="_blank" class="pic">
                                <img :src="item.icon" :alt="item.gamename" width="100%">
                            </nuxt-link>
                            <p class="title" :title="item.gamename">{{item.gamename}}</p>
                            <nuxt-link :to="'game/'+item.gameid" target="_blank" class="lock"><i></i>查看</nuxt-link>
                            <p class="desc" :title="item.grabname">{{item.grabname}}</p>
                        </li>
                    </ul>
                </section>
                <!-- 游戏排行榜 -->
                <section class="content_module mt20">
                    <div class="module_title">
                        <h3 class="size">游戏排行榜</h3>
                    </div>
                    <ul class="game_list" id="gameGrab">
                        <li @mouseenter="grabHoverStyle ($event)"  v-for="(item, index) in gameList" :key="item.gameid" :class="index == 0 ? 'on' : ''">
                            <em class="num">{{index + 1}}</em>
                            <nuxt-link :to="'game/'+item.gameid" :channel="channel" target="_blank" class="pic">
                                <img :src="item.icon" :alt="item.gamename" width="100%">
                            </nuxt-link>
                            <p class="title" :title="item.gamename">{{item.gamename}}</p>
                            <p class="sentiment" :title="'人气'+item.rs"><img src="/img/sentiment.png" alt="人气"><span>{{item.rs}}</span></p>
                        </li>
                    </ul>
                </section>
            </div>
        </section>
        <footer-page :channel="channel"/>
    </section>
</template>
<style lang="less" scoped>
@import '../static/css/home.less';
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
            touchSlide: {
                autoplay: true,
                autoplaySpeed: 3000,
                dots: 'inside',
                radiusDot: false,
                trigger: 'click',
                arrow: 'hover'
            },
            slideData: [],
            gamesPlayed: [],
            gamesNews: [],
            gamesSelect: [],
            hotGrab: [],
            gameList: []
        }
    },
    head () {
        return {
            title: 'H5游戏大全|好玩的H5手机游戏排行榜|免费H5手机页游平台-七果H5游戏平台',
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
        //游戏礼包hover
        grabHoverStyle($event){
            var lis = $event.path[1].children;
            for(var i = 0; i < lis.length; i++){
                lis[i].classList.remove('on');
            }
            $event.path[0].className = 'on';
        },
        cellphone () {
            var el = document.getElementsByClassName('login_form');
            var ov = document.getElementsByTagName('body');
            var cl = document.getElementById('mask');
            var fix = document.getElementById('qrcode_fixed');
            //输入框内的手机号
            var user = el[0][0].value;
            if(user.length != 11){
                this.error('输入的手机号有误');
                return false;
            }else{
                this.tel = user;
                ov[0].style.overflow = 'hidden';
                cl.style.display = 'block';
                fix.style.top = '20%';
            }
        },
        islogin () {
            var el = document.getElementsByClassName('login_form');
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
                        this.pagefun();
                    } else {
                        this.error(res.data.msg);
                    }
                })
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
            //我玩过的游戏
            axios.get('http://h5.7guoyouxi.com/html/index/my_history_play',{
                params: {
                    token: this.token
                }
            })
            .then((res) => {
                this.gamesPlayed = res.data.data;
            })
        }
    },
    asyncData () {
        return axios.all([
            axios.get('http://h5.7guoyouxi.com/html/index/h5_lunbo'),
            axios.get('http://h5.7guoyouxi.com/html/index/my_history_play'),
            axios.get('http://h5.7guoyouxi.com/html/index/new_game'),
            axios.get('http://h5.7guoyouxi.com/html/index/prime_game'),
            axios.get('http://h5.7guoyouxi.com/html/index/hot_grab'),
            axios.get('http://h5.7guoyouxi.com/html/index/hot_game')
        ])
        .then(axios.spread(function (h5_lunbo, my_history_play, new_game, prime_game, hot_grab, hot_game) {
            return {
                slideData: h5_lunbo.data.data,
                gamesPlayed: my_history_play.data.data,
                gamesNews: new_game.data.data,
                gamesSelect: prime_game.data.data,
                hotGrab: hot_grab.data.data,
                gameList: hot_game.data.data
            }
        }));
    },
    mounted(){
        this.pagefun();
    }
}
</script>
