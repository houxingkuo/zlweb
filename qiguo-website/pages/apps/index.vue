<template>
    <section class="container">
        <header-page :channel="channel" tab='apps' :tel="tel" :username="username" :status="status"/>
        <section id="h5_apps_content">
            <!-- 左侧内容 -->
            <div class="content_left">
                <!-- 游戏礼包 -->
                <section class="content_module">
                    <div class="module_title">
                        <h3 class="size">游戏库</h3>
                        <div class="nav">
                            <a href="javascript:void(0);" target="_self" :class="appsType == 1 ? 'on' : ''" @click="gamestype(1, 1)">最新</a>
                            <a href="javascript:void(0);" target="_self" :class="appsType == 2 ? 'on' : ''" @click="gamestype(2, 1)">最热</a>
                        </div>
                    </div>
                    <ul class="game_apps">
                        <li v-for="(item) in appsData" :key="item.gameid">
                            <div class="box_clear">
                                <nuxt-link :to="'/game/'+item.gameid" target="_blank" class="pic">
                                    <img :src="item.icon" :alt="item.gamename" width="100%">
                                </nuxt-link>
                                <nuxt-link :to="'/game/'+item.gameid" target="_blank" class="info">
                                    <p class="title">{{item.gamename}}</p>
                                    <p class="leiming">
                                        <span :title="item.new_category">{{item.new_category}}</span>
                                        <span>&nbsp;|&nbsp;</span>
                                        <span class="sentiment">
                                            <img src="/img/sentiment.png" alt="人气">
                                            <i :title="'人气'+item.rs">{{item.rs}}</i>
                                        </span>
                                    </p>
                                    <p class="desc">{{item.desc}}</p>
                                </nuxt-link>
                            </div>
                            <router-link :to="'/play?gameid=' + item.gameid" :target="target" class="play" v-if="status == true">开始玩</router-link>
                            <router-link to="/login" :target="target" class="play" v-else>开始玩</router-link>
                        </li>
                    </ul>
                    <div class="page_template">
                        <Page 
                        :total="pageNum"
                        :page-size="pageSize"
                        :current="current"
                        @on-change="handlePage"
                        show-total
                        show-elevator />
                    </div>
                </section>
            </div>
            <!-- 右侧内容 -->
            <div class="content_right">
                <section class="content_module">
                    <div class="down_app">
                        <a :href="'http://static.7guoyouxi.com/soft/corp/'+channel" target="_self">
                            <img src="/img/down_android.jpg" alt="安卓下载" width="100%">
                        </a>
                        <a href="javascript:void(0);" target="_self" @click="error('暂无iPhone版')">
                            <img src="/img/down_ios.jpg" alt="IOS下载" width="100%">
                        </a>
                        <div class="fr" style="width:125px;height:110px;overflow:hidden;position: absolute;right:0;top:0;">
                            <img src="http://www.7guoyouxi.com/img/code/qiguo_qgyx.png" alt="移动端二维码" style="width:90px;height:90px;margin:0 auto;display: block;">
                            <p style="text-align:center;font-size:12px;">扫码下载七果游戏</p>
                        </div>
                    </div>
                </section>
                <!-- 游戏排行榜 -->
                <section class="content_module mt20">
                    <div class="module_title">
                        <h3 class="size">游戏排行榜</h3>
                    </div>
                    <ul class="game_list" id="gameGrab">
                        <li @mouseenter="grabHoverStyle ($event)"  v-for="(item, index) in gamesList" :key="item.gameid" :class="index == 0 ? 'on' : ''">
                            <em class="num">{{index + 1}}</em>
                            <nuxt-link :to="'/game/'+item.gameid" target="_blank" class="pic">
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
@import '../../static/css/apps.less';
</style>
<script>
import 'iview/dist/styles/iview.css';
import HeaderPage from '~/components/HeaderPage.vue'
import FooterPage from '~/components/FooterPage.vue'
import axios from 'axios';
export default {
    data () {
        return {
            channel: 'qiguo_qgyx',
            tel: '',
            username: 'xxx',
            status: false,
            token: '',
            target: '_self',
            gamesList: [],
            appsData: [],
            appsType: 1,
            pageNum: 0,
            pageSize: 10,
            current: 1
        }
    },
    head () {
        return {
            title: 'H5游戏礼包大全|H5手机游戏礼包领取|免费手机页游礼包-七果H5游戏平台',
            meta: [
                { hid: 'keywords', name: 'keywords', content: 'H5游戏礼包,H5手机游戏礼包,手机页游礼包' },
                { hid: 'description', name: 'description', content: 'H5游戏礼包大全是由七果H5游戏平台为广大玩家提供的，还在找H5手机游戏礼包的朋友可以在此处免费领取到各类手机页游礼包了哦！' }
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
        //类型切换
        gamestype(type, current){
            this.current = current;
            this.$router.push({ path: '/apps/' + type + '-' + this.current});
        },
        handlePage(page){
            this.$router.push({ path: '/apps/1-'+page});
        }
    },
    asyncData () {
        return axios.all([
            axios.get('http://h5.7guoyouxi.com/html/index/game_more_data?type=1'),
            axios.get('http://h5.7guoyouxi.com/html/index/hot_game')
        ])
        .then(axios.spread(function (game_more_data, hot_game) {
            return {
                appsData: game_more_data.data.data.slice(10 * (1 - 1), 10 * 1),
                pageNum: game_more_data.data.data.length,
                gamesList: hot_game.data.data
            }
        }));
    },
    mounted(){
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
    }
}
</script>
