<template>
    <div id="zlhy-gift-page">
        <van-search
        v-model="value"
        show-action
        shape="round"
        placeholder="输入“游戏名称” 搜索礼包"
        @search="onSearch"
        >
            <template #action>
                <div @click="onSearch">搜索</div>
            </template>
        </van-search>
        <ul class="gameItem">
            <li v-for="(item, index) in giftData.data" :key="index">
                <div class="gameBox">
                    <div class="pic" @click="gamesdetails(item.game_id)">
                        <img :src="item.icon" :alt="item.game_name" width="100%">
                    </div>
                    <div class="info" @click="gamesdetails(item.game_id)">
                        <label>{{ item.game_name }}</label>
                        <p>礼包</p>
                    </div>
                    <a href="javascript:void(0);" target="_self" class="playGameBtn" @click="playgame(item.game_id)">开玩</a>
                </div>
                <div class="moreGiftBox" v-if="item.gift.length != 0">
                    <div class="giftList">
                        <ol>
                            <dl v-for="(giftitems, inx) in item.gift" :key="inx" v-show="inx < 2">
                                <div class="conText">
                                    <div class="name"><span>{{ giftitems.name }}</span></div>
                                    <p class="desc" v-html="giftitems.content"></p>
                                    <div class="progressBar">
                                        <em>{{ giftitems.surplus_sum  }}&nbsp;/&nbsp;{{ giftitems.total_sum }}</em>
                                        <span :style="{'width': giftitems.surplus_sum / giftitems.total_sum * 100 + '%'}"></span>
                                    </div>
                                </div>
                                <a href="javascript:void(0);" target="_self" class="getGift" v-if="giftitems.surplus_sum == 0 && giftitems.is_receive == 0">已完</a>
                                <a href="javascript:void(0);" target="_self" class="getGift" @click="getCode(giftitems.id, index, inx, item.game_id)" v-else-if="giftitems.is_receive == 0">领取</a>
                                <a href="javascript:void(0);" target="_self" class="getGift" @click="lockCode(giftitems.code, item.game_id)" v-else>查看</a>
                            </dl>
                        </ol>
                        <a href="javascript:void(0);" target="_self" class="btn-more" v-if="item.gift.length > 2" @click="moreBtn($event)">查看剩余({{item.gift.length - 2}}个)礼包</a>
                    </div>
                </div>
            </li>
            <dl v-if="giftData.data == undefined || giftData.data.length == 0">
                <img src="@/assets/images/icon/no-information.png" alt="无数据" width="50%">
            </dl>
        </ul>
        <p @click="getGiftData" v-if="giftData.npi != 0" style="padding:30px 0;font-size:14px;">点击加载更多</p>
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
                    <a href="javascript:void(0);" target="_self" @click="playgame(giftObj.id)">进入游戏</a>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import Vue from 'vue';
import { Lazyload, Search, Tag, Popup, Toast } from 'vant';
import { copy, btnslogincheck } from '@/utils/component';
Vue.use(Lazyload);
Vue.use(Search);
Vue.use(Tag)
Vue.use(Popup)
Vue.use(Toast)
export default {
    name: 'gift',
    data() {
        return {
            status: false,
            value: '',
            giftData: {
                npi: 1,
                ids: '',
                data:[]
            },
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
                if (JSON.stringify(this.$route.query) != '{}') return
                this.giftData = {
                    npi: 1,
                    ids: '',
                    data:[]
                }
                this.getGiftData();
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        onSearch () {
            this.giftData = {
                npi: 1,
                ids: '',
                data:[]
            }
            this.getGiftData();
        },
        // 前往游戏详情页
        gamesdetails (id) {
            this.$router.push(`/detail/${id}`)
        },
        // 开玩
        playgame (id) {
            this.$router.push(`/game/${id}`);
        },
        moreBtn (e) {
            let el = e.target.parentElement.getElementsByTagName('dl');
            for (let i = 0; i < el.length; i++) {
                el[i].style.display = "flex";
            }
            e.target.remove();
        },
        // 领取礼包
        getCode (id, f_index, z_index, game_id) {
            if (!btnslogincheck('gift')) return false
            this.$api.article.receiveGift({
                uid: this.getUserInformation.uid,
                id: id
            }).then(res=> {
                this.status = true;
                this.giftData.data[f_index].gift[z_index].is_receive = 1;
                this.giftData.data[f_index].gift[z_index].code = res.data.data.code;
                this.giftObj.code = res.data.data.code;
                this.giftObj.id = game_id;
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
        copycode (code) {
            copy(code, '礼包码复制成功', Toast)
        },
        // 礼包列表
        getGiftData () {
            this.$api.article.gameGift({
                page: this.giftData.npi,
                uid: this.getUserInformation.uid,
                keywords: this.value,
                ids: this.giftData.ids
            }).then(res=> {
                console.log(res)
                this.giftData.npi = res.data.npi;
                let ids = [];
                for (const iterator of res.data.data.list) {
                    ids.push(iterator.game_id);
                    this.giftData.data.push(iterator)
                }
                this.giftData.ids = ids.join(',');
            }).catch(err => {
                console.log(err)
            })
        }
    },
    created() {
        if (JSON.stringify(this.$route.query) != '{}') {
            this.value = this.$route.query.name
            this.onSearch();
        }
    },
    mounted() {}
}

</script>

<style lang="less" scoped>
#zlhy-gift-page{
    width: 375px;
    /deep/.van-search__action{
        background-color: #60a9f4;
        color: #fff;
        border: 0;
        border-radius: 8px;
        margin: 0 0 0 5px;
    }
    /deep/.van-search--show-action, /deep/.van-search{
        padding: 10px;
    }
    .gameItem{
        width: 100%;
        li{
            background: #f3f3f3;
            margin: 10px;
            border-radius: 8px;
            padding: 0 10px;
            .gameBox{
                display: flex;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid #DEDEDE;
                .pic{
                    width: 60px;
                    height: 60px;
                    overflow: hidden;
                    margin: 0 10px 0 0;
                    cursor: pointer;
                }
                .info{
                    flex: 1;
                    text-align: left;
                    label{
                        font-size: 16px;
                        color: #333;
                        font-weight: bold;
                        cursor: pointer;
                    }
                    p{
                        font-size: 12px;
                        color: #999;
                        padding: 3px 0 0 0;
                        cursor: pointer;
                    }
                }
                .playGameBtn{
                    line-height: 30px;
                    padding: 0 15px;
                    border-radius: 30px;
                    color: #fff;
                    background-color: #f4a460;
                }
            }
            .moreGiftBox{
                overflow: hidden;
                .giftList{
                    overflow: hidden;
                    ol{
                        display: block;
                        dl:last-child{border: 0;}
                        dl{
                            display: flex;
                            align-items: center;
                            padding: 10px 0;
                            border-bottom: 1px solid #DEDEDE;
                            .conText{
                                text-align: left;
                                flex: 1;
                                margin: 0 20px 0 0;
                                .name{
                                    font-size: 14px;
                                    color: #333;
                                    font-weight: bold;
                                }
                                .desc{
                                    font-size: 10px;
                                    padding: 5px 0;
                                    color: #999;
                                }
                                .progressBar{
                                    width: 100%;
                                    height: 12px;
                                    border-radius: 100vh;
                                    overflow: hidden;
                                    position: relative;
                                    font-size: 10px;
                                    color: #fff;
                                    background: #b1aeae;
                                    em,span{width: 100%;left: 0;top: 0;border-radius: 100vh;height: 12px;position: absolute;line-height: 13px;}
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
                    .btn-more{
                        font-size: 14px;
                        color: #9aa5f0;
                        padding: 10px 20px;
                        display: inline-block;
                    }
                }
            }
        }
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
                color: #a986c4;
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
/deep/.van-search--show-action{padding: 10px;}
</style>
