<template>
    <div id="zlhy-detail-page" >
        <!-- <div class="gamePic boxbackground">
            <img src="@/assets/images/banner.jpg" :alt="pageData.name" width="100%" v-if="pageData.top_picture == ''" />
            <img :src="pageData.top_picture" :alt="pageData.name" width="100%" v-else />
        </div> -->
        <van-sticky>
            <div class="game-bar">
                <img :src="pageData.icon" :alt="pageData.name" class="pic">
                <div class="info">
                    <h3>{{ pageData.name }}</h3>
                    <p>{{ pageData.publicity }}</p>
                </div>
                <a href="javascript:void(0);" target="_self" class="playgameBtn" @click="playgame">开始游戏</a>
            </div>
        </van-sticky>
        <div class="gameContent">
            <div class="introduce" v-if="pageData.publicity != ''">
                <label class="titlesMol">游戏简介</label>
                <p v-html="pageData.publicity"></p>
                <div class="touch">
                    <ul :style="{'width': `${135*pageData.brief_img.length}px`}">
                        <li v-for="(item, index) in pageData.brief_img" :key="index">
                            <img :src="item" alt="" style="width:125px;margin: 0 10px 0 0;">
                        </li>
                    </ul>
                </div>
            </div>
            <div class="giftBox" v-if="pageData.gift !== undefined && pageData.gift.length > 0">
                <label class="titlesMol" style="margin-top: 20px;">游戏礼包</label>
                <ul>
                    <li v-for="(item, index) in pageData.gift" :key="index">
                        <div class="conText">
                            <div class="name"><span>{{ item.name }}</span></div>
                            <p class="desc" v-html="item.content"></p>
                            <div class="progressBar">
                                <em>{{ item.surplus_sum  }}/{{ item.total_sum }}</em>
                                <span :style="{'width': item.surplus_sum / item.total_sum * 100 + '%'}"></span>
                            </div>
                        </div>
                        <a href="javascript:void(0);" target="_self" class="getGift" v-if="item.surplus_sum == 0 && item.is_receive == 0">已完</a>
                        <a href="javascript:void(0);" target="_self" class="getGift" @click="getCode(item.id, index, pageData.id)" v-else-if="item.is_receive == 0">领取</a>
                        <a href="javascript:void(0);" target="_self" class="getGift" @click="lockCode(item.code, item.id)" v-else>查看</a>
                    </li>
                </ul>
            </div>
        </div>
        <van-popup v-model="status" round>
            <div id="giftFixed">
                <h2>礼包兑换码</h2>
                <div class="form">
                    <div class="list">
                        <input type="text" disabled="disabled" :value="giftObj.code">
                    </div>
                    <p>游戏礼包兑换方式，点击下方复制按钮进行复制，再进入游戏内进行兑换即可</p>
                </div>
                <div class="btns">
                    <a href="javascript:void(0);" target="_self" @click="copycode(giftObj.code)">复制</a>
                    <a href="javascript:void(0);" target="_self" @click="playgame">进入游戏</a>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import Vue from 'vue'
import { Toast, Lazyload, Popup, Sticky } from 'vant'
import { copy, btnslogincheck } from '@/utils/component';

Vue.use(Toast);
Vue.use(Lazyload);
Vue.use(Popup);
Vue.use(Sticky);
export default {
    name: 'gamedetails',
    data () {
        return {
            status: false,
            pageData: {},
            giftObj:{
                code: '',
                id: ''
            }
        }
    },
    computed: {
        getUserInformation () {
            return this.$store.getters.getUserInformation
        }
    },
    watch: {
        getUserInformation: {
            handler(newName, oldName) {
                this.postPageData();
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        // 开玩
        playgame () {
            this.$router.push(`/gameapp/${this.$route.params.id}`);
        },
        // 复制礼包码
        copycode (code) {
            copy(code, '礼包码复制成功', Toast)
        },
        // 领取礼包
        getCode (id, index, gameid) {
            if (!btnslogincheck('gift')) return false
            this.$api.article.receiveGift({
                uid: this.getUserInformation.uid,
                id: id
            }).then(res=> {
                this.status = true;
                this.pageData.gift[index].is_receive = 1;
                this.pageData.gift[index].code = res.data.data.code;
                this.giftObj.code = res.data.data.code;
                this.giftObj.id = gameid;
            }).catch(err => {
                console.log(err)
            })
        },
        // 查看礼包码
        lockCode (code, id) {
            this.status = true;
            this.giftObj.code = code;
            this.giftObj.id = id;
        },
        // 页面数据
        postPageData () {
            this.$api.article.gameDetails({
                uid: this.getUserInformation.uid,
                gameid: this.$route.params.id
            }).then(res=> {
                console.log(res)
                this.pageData = res.data.data;
                this.pageData.id = this.$route.params.id;
                document.title = res.data.data.name;
            }).catch(err => {
                console.log(err)
            })
        },
    },
    created () {},
    mounted () {}
}
</script>

<style lang="less" scoped>
#zlhy-detail-page{
    width: 375px;
    img{
        display: block;
    }
    .gamePic{
        width: 100%;
        position: relative;
    }
    .boxbackground::after{
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        background-image: linear-gradient(-180deg, rgba(0, 0, 0, 0.1) 60%, #000000 100%);
    }
    .game-bar{
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        z-index: 1;
        background-color: #fff;
        overflow: hidden;
        .pic{
            width: 70px;
            height: 70px;
            border-radius: 15px;
            display: block;
        }
        .info{
            width: 160px;
            height: 70px;
            text-align: left;
            flex: 1;
            line-height: 35px;
            padding: 0 10px;
            h3{
                font-size: 16px;
                font-weight: bold;
                color: #333;
            }
            p{
                font-size: 12px;
                color: #333;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .playgameBtn{
            line-height: 35px;
            padding: 0 12px;
            border-radius: 8px;
            color: #fff;
            display: block;
            font-size: 13px;
            background-color: #f4a460;
        }
    }
    .gameContent{
        width: 100%;
        margin: 0 auto 20px auto;
        overflow: hidden;
        .introduce{
            padding: 0 20px;
            overflow: hidden;
            p{
                font-size: 12px;
                text-align: left;
            }
            .touch{
                overflow-x: auto;
                overflow-y: hidden;
                margin: 10px 0 0 0;
                ul{
                    overflow: hidden;
                    li{
                        float: left;
                    }
                }
            }
        }
        .giftBox{
            overflow: hidden;
            padding: 0 20px;
            ul{
                overflow: hidden;
                li{
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    margin: 10px 0;
                    border-radius: 8px;
                    background: #F8F8F8;
                    .conText{
                        text-align: left;
                        flex: 1;
                        margin: 0 20px 0 0;
                        .name{
                            font-size: 14px;
                            color: #333;
                        }
                        .desc{
                            font-size: 10px;
                            padding: 5px 0;
                            color: #999;
                        }
                        .progressBar{
                            width: 100%;
                            height: 15px;
                            border-radius: 15px;
                            overflow: hidden;
                            position: relative;
                            font-size: 10px;
                            color: #fff;
                            background: #d6d6d6;
                            em,span{width: 100%;left: 0;top: 0;border-radius: 15px;height: 15px;position: absolute;}
                            em{
                                text-align: center;
                                z-index: 1;
                            }
                            span{
                                display: inline-block;
                                background-color: #f4a460;
                            }
                        }
                    }
                    .getGift{
                        line-height: 25px;
                        padding: 0 15px;
                        border-radius: 25px;
                        color: #f4a460;
                        border: 1px solid #f4a460;
                    }
                }
            }
        }
    }
    .titlesMol{
        width: 250px;
        line-height: 30px;
        display: block;
        font-size: 14px;
        color: #333;
        font-weight: bold;
        text-align: left;
    }
}
#giftFixed{
    width: 300px;
    padding: 10px;
    min-height: 200px;
    h2{
        display: block;
        text-align: center;
        font-size: 16px;
        line-height: 40px;
        color: #333;
    }
    .form{
        margin: 0 10px;
        .list{
            margin: 0 0 10px;
            input{
                width: 100%;
                outline: none;
                line-height: 30px;
                border-radius: 30px;
                border: none;
                background: #ccc;
                text-align: center;
            }
        }
    }
    .btns{
        display: flex;
        justify-content:center;
        align-items: center;
        a{
            display: block;
            width: 120px;
            height: 30px;
            line-height: 30px;
            border-radius: 8px;
            background: #fc8c5f;
            color: #fff;
            text-align: center;
            margin: 10px 5px;
        }
    }
}
</style>

