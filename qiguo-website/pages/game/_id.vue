<template>
    <section class="container">
        <header-page :channel="channel" tab='gameinfo' :tel="tel" :username="username" :status="status"/>
        <section id="h5_game_content">
            <!-- 左侧内容 -->
            <div class="content_left">
                <!-- 游戏详情 -->
                <section class="content_module">
                    <div class="module_title">
                        <h3 class="size">{{gamename}}</h3>
                    </div>
                    <ul class="grab_page_item">
                        <li>
                            <div class="game_info">
                                <nuxt-link :to="'/game/'+gameid" target="_blank" class="pic">
                                    <img :src="gameicon" :alt="gamename" width="100%;">
                                </nuxt-link>
                                <p class="title" :title="gamename">{{gamename}}</p>
                                <p class="leiming">
                                    <span :title="new_category">{{new_category}}</span>
                                    <span>&nbsp;|&nbsp;</span>
                                    <span class="sentiment">
                                        <img src="/img/sentiment.png" alt="人气">
                                        <i :title="'人气'+rs">{{rs}}</i>
                                    </span>
                                </p>
                                <p class="desc" :title="gamedesc">{{gamedesc}}</p>
                                <router-link :to="'/play?gameid=' + gameid" :target="target" class="play" v-if="status == true">开始玩</router-link>
                                <router-link to="/login" :target="target" class="play" v-else>开始玩</router-link>
                                <div class="qrcode">
                                    <img :src="qrcode" alt="扫一扫，手机玩" width="100%">
                                    <p>扫一扫，手机玩</p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </section>
                <!-- 游戏礼包 -->
                <section class="content_module mt20" v-if="grabLength != 0">
                    <div class="module_title">
                        <h3 class="size">{{gamename}}礼包</h3>
                    </div>
                    <ul class="game_grab_item" id="grabBox">
                        <li v-for="(item) in gameData.gift" :key="item.id">
                            <img src="/img/grab_icon.png" alt="游戏礼包" class="pic">
                            <p class="title" :title="item.name">{{item.name}}</p>
                            <p class="desc"><span :title="item.content">礼包内容：{{item.content}}</span></p>
                            <div class="progress_bar">
                                <p><span :style="'width:'+item.bfb"></span></p>剩余{{item.bfb}}
                            </div>
                            <a href="/login" target="_self" class="receive" v-if="status == false">领取礼包</a>
                            <a href="javascript:void(0);" target="_self" class="receive" v-else-if="status == true && item.type == 1" @click="receive($event, item.id)">领取礼包</a>
                            <a href="javascript:void(0);" target="_self" class="receive" style="background: #ccc;" v-else>已领取</a>
                        </li>
                    </ul>
                    <a href="javascript:void(0);" class="chakan" @click="cheackgrab($event)">查看更多礼包∨</a>
                </section>
                <!-- 图片介绍&内容介绍 -->
                <section class="content_module mt20">
                    <div id="imagesSlide">
                        <div class="box">
                            <ul :style="'width:' + picData.length * 218 + 'px;'">
                                <li v-for="(item) in picData" :key="item.img">
                                    <img :src="item.img">
                                </li>
                            </ul>
                        </div>
                        <a href="javascript:void(0);" target="_self" class="btn_l" @click="slideLeft()"></a>
                        <a href="javascript:void(0);" target="_self" class="btn_r on" @click="slideRight()"></a>
                    </div>
                    <p class="notes">{{gamenotes}}</p>
                </section>
            </div>
            <!-- 右侧内容 -->
            <div class="content_right">
                <!-- 游戏排行榜 -->
                <section class="content_module">
                    <div class="module_title">
                        <h3 class="size">游戏排行榜</h3>
                        <router-link to="grab" target="_blank" class="more">更多+</router-link>
                    </div>
                    <ul class="game_list" id="gameGrab">
                        <li @mouseenter="grabHoverStyle ($event)"  v-for="(item, index) in gameList" :key="item.gameid" :class="index == 0 ? 'on' : ''">
                            <em class="num">{{index + 1}}</em>
                            <nuxt-link :to="'game/'+item.gameid" target="_blank" class="pic">
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
@import '../../static/css/game.less';
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
            cheackStatus: true,
            grabLength: 0,
            gamename: '',
            gameicon: '',
            gameid: '',
            gamenotes: '',
            new_category: '',
            rs: '',
            gamedesc: '',
            qrcode: '',
            gameData: [],
            picData: [],
            gameList: [],
            pageSize: 1
        }
    },
    head () {
        return {
            title: this.gamename+'H5游戏在线玩|'+this.gamename+'H5手游马上玩|'+this.gamename+'手机页游下载-七果H5游戏平台',
            meta: [
                { hid: 'keywords', name: 'keywords', content: this.gamename+'H5,'+this.gamename+'H5游戏,'+this.gamename+'H5手游,'+this.gamename+'H5在线玩,'+this.gamename+'手机页游'},
                { hid: 'description', name: 'description', content: this.gamename+'H5游戏是由七果H5游戏平台为广大玩家提供，让喜欢'+this.gamename+'H5手游的朋友可以在线玩'+this.gamename+'H5游戏了哦！'}
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
        //查看更多礼包
        cheackgrab($event){
            var el = document.getElementById('grabBox');
            if(this.cheackStatus){
                el.style.height = 'auto';
                $event.path[0].innerHTML = '收起更多礼包∧';
                this.cheackStatus = false;
            }else{
                el.style.height = '181px';
                $event.path[0].innerHTML = '查看更多礼包∨';
                this.cheackStatus = true;
            }
        },
        //往左
        slideLeft(){
            var num = Math.round(this.picData.length / 3);
            if(this.pageSize != 1){
                this.pageSize--;
                if(this.pageSize > num){
                    return false;
                }
                $("#imagesSlide ul").css({
                    'overflow': 'hidden',
                    'transition-duration':'0.3s',
                    'transform':'translate3d(+' + 654 * (this.pageSize - 1) + 'px, 0px, 0px)',
                    'backface-visibility': 'hidden'
                });
            }else{
                this.warning('已是最左边了哦！');
            }
        },
        //往左
        slideRight(){
            var num = Math.round(this.picData.length / 3);
            if(this.pageSize != num){
                this.pageSize++;
                if(this.pageSize > num){
                    return false;
                }
                $("#imagesSlide ul").css({
                    'overflow': 'hidden',
                    'transition-duration':'0.3s',
                    'transform':'translate3d(-' + 654 * (this.pageSize - 1) + 'px, 0px, 0px)',
                    'backface-visibility': 'hidden'
                });
            }else{
                this.warning('已是最右边了哦！');
            }
        },
        /*
        * 领取礼包
        */
        receive ($event, grabid) {
            if (this.grabId == grabid) return false;
            axios.get('http://h5.7guoyouxi.com/html/index/get_grab',{
                params: {
                    token: this.token,
                    gameid: $nuxt.$route.params.id,
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
            axios.get('http://h5.7guoyouxi.com/html/index/game_detail_data?gameid=' + params.id),
            axios.get('http://h5.7guoyouxi.com/html/index/hot_game')
        ])
        .then(axios.spread(function (game_detail_data, hot_game) {
            return {
                gameData: game_detail_data.data.data,                                           //数据
                picData: game_detail_data.data.data.info.img,                                   //图片介绍
                grabLength: game_detail_data.data.data.gift.length,                             //礼包数组长度
                gamename: game_detail_data.data.data.info.gamename,                             //游戏名称
                gameicon: game_detail_data.data.data.info.icon,                                 //游戏icon
                gameid: game_detail_data.data.data.info.gameid,                                 //游戏id
                new_category: game_detail_data.data.data.info.new_category,                     //游戏类型
                rs: game_detail_data.data.data.info.rs,                                         //游戏热度
                gamedesc: game_detail_data.data.data.info.desc,                                 //游戏描述
                qrcode: 'http://h5.7guoyouxi.com' + game_detail_data.data.data.info.qrcode,     //游戏二维码
                gamenotes: game_detail_data.data.data.info.notes,                               //游戏介绍
                gameList: hot_game.data.data
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
