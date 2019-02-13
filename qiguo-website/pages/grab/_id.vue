<template>
    <section class="container">
        <header-page :channel="channel" tab='grab' :tel="tel" :username="username" :status="status"/>
        <section id="h5_grab_content">
            <!-- 左侧内容 -->
            <div class="content_left">
                <!-- 游戏礼包 -->
                <section class="content_module">
                    <div class="module_title">
                        <h3 class="size">游戏礼包</h3>
                    </div>
                    <ul class="grab_page_item">
                        <li v-for="(item) in grabData" :key="item.grabname">
                            <div class="game_info">
                                <nuxt-link :to="'/game/'+item.gameid" target="_blank" class="pic">
                                    <img :src="item.icon" :alt="item.gamename" width="100%;">
                                </nuxt-link>
                                <p class="title" :title="item.gamename">{{item.gamename}}</p>
                                <p class="leiming">
                                    <span :title="item.new_category">{{item.new_category}}</span>
                                    <span>&nbsp;|&nbsp;</span>
                                    <span class="sentiment">
                                        <img src="/img/sentiment.png" alt="人气">
                                        <i :title="'人气'+item.rs">{{item.rs}}</i>
                                    </span>
                                </p>
                                <p class="desc" :title="item.desc">{{item.desc}}</p>
                                <router-link :to="'/play?gameid=' + item.gameid" :target="target" class="play" v-if="status == true">开始玩</router-link>
                                <router-link to="/login" :target="target" class="play" v-else>开始玩</router-link>
                                <div class="qrcode">
                                    <img :src="'http://h5.7guoyouxi.com'+item.qrcode" alt="扫一扫，手机玩" width="100%">
                                    <p>扫一扫，手机玩</p>
                                </div>
                            </div>
                            <ol>
                                <dl v-for="(items) in item.yxlb" :key="items.grabid">
                                    <p class="title">{{items.grabname}}</p>
                                    <p class="desc">
                                        <span title="强化石x200 金币（500000）">{{items.content}}</span>
                                    </p>
                                    <div class="progress_bar">
                                        <p><span :style="'width:' + items.bfb"></span></p>剩余{{items.bfb}}
                                    </div>
                                    <a href="/login" target="_self" class="receive" v-if="status == false">领取礼包</a>
                                    <a href="javascript:void(0);" target="_self" class="receive" v-else-if="status == true && items.type == 1" @click="receive($event, items.gameid, items.grabid)">领取礼包</a>
                                    <a href="javascript:void(0);" target="_self" class="receive" style="background: #ccc;" v-else>已领取</a>
                                </dl>
                            </ol>
                        </li>
                    </ul>
                    <div class="page_template">
                        <Page 
                        :total="pageNum"
                        :page-size="pageSize"
                        :current="current"
                        @on-change="handlePage"
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
                <!-- 热门游戏礼包 -->
                <section class="content_module mt20">
                    <div class="module_title">
                        <h3 class="size">热门游戏礼包</h3>
                    </div>
                    <ul class="game_grab" id="gameGrab">
                        <li @mouseenter="grabHoverStyle ($event)" v-for="(item, index) in hotGrab" :key="item.grabname" :class="index == 0 ? 'on' : ''">
                            <nuxt-link :to="'/game/'+item.gameid" target="_blank" class="pic">
                                <img :src="item.icon" :alt="item.gamename" width="100%">
                            </nuxt-link>
                            <p class="title" :title="item.gamename">{{item.gamename}}</p>
                            <nuxt-link :to="'/game/'+item.gameid" target="_blank" class="lock"><i></i>查看</nuxt-link>
                            <p class="desc" :title="item.grabname">{{item.grabname}}</p>
                        </li>
                    </ul>
                </section>
            </div>
        </section>
        <footer-page :channel="channel"/>
    </section>
</template>
<style lang="less" scoped>
@import '../../static/css/grab.less';
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
            grabId: 0,
            hotGrab: [],
            grabData: [],
            pageNum: 0,
            pageSize: 2,
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
        handlePage(page){
            this.$router.push({ path: '/grab/'+page});
        },
        /*
        * 领取礼包
        */
        receive ($event, gameid, grabid) {
            if (this.grabId == grabid) return false;
            axios.get('http://h5.7guoyouxi.com/html/index/get_grab',{
                params: {
                    token: this.token,
                    gameid: gameid,
                    grabid: grabid
                }
            })
            .then((res) => {
                if (res.data.code == 0) {
                    this.grabId = grabid;
                    $event.path[0].innerHTML = '已领取';
                    $event.path[0].style.background = '#ccc';
                }
            })
        }
    },
    asyncData ({params}) {
        return axios.all([
            axios.get('http://h5.7guoyouxi.com/html/index/grab_data?page=' + params.id),
            axios.get('http://h5.7guoyouxi.com/html/index/hot_grab')
        ])
        .then(axios.spread(function (grab_data, hot_grab) {
            return {
                grabData: grab_data.data.data,
                pageNum: grab_data.data.page_num * 2,
                hotGrab: hot_grab.data.data
            }
        }));
    },
    mounted(){
        this.current = parseInt($nuxt.$route.params.id);
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
