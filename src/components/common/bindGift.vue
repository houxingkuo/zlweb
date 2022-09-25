<template>
    <van-popup v-model="status" round @click-overlay='onBindGift' class="showPanelFixed">
        <div id="bindGiftFixed">
            <h2>我的礼包</h2>
            <div class="touch">
                <ul>
                    <li v-for="(item, index) in data" :key="index">
                        <div class="pic" :style="{'background-image': `url(${item.icon}`}"></div>
                        <div class="info">
                            <label>{{ item.name }}</label>
                            <p>礼包码：<span>{{ item.code }}</span></p>
                            <dl>兑换积分：免费</dl>
                        </div>
                        <div class="btns">
                            <a href="javascript:void(0);" target="_self" class="btn-code" @click="copycode(item.code)">复制礼包码</a>
                            <a href="javascript:void(0);" target="_self" class="btn-play" @click="playgame(item.gameId)">开玩游戏</a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </van-popup>
</template>

<script>
import Vue from 'vue';
import { Toast, Popup, Field, Button } from 'vant';
import { copy, getCookie } from '@/utils/component';

Vue.use(Popup);
Vue.use(Field);
Vue.use(Button);
export default {
    name: 'bindAccount',
    data () {
        return {
            status: true,
            data: []
        }
    },
    methods: {
        onBindGift() {
            this.$emit('onBindGift', false)
        },
        copycode (code) {
            copy(code, '礼包码复制成功', Toast)
        },
        // 开玩
        playgame (id) {
            this.$router.push(`/game/${id}`);
        },
        // 游戏资讯
        getNewlistData () {
            this.$api.article.receiveGiftList({
                uid: getCookie('ZHANLONGHY_DATA').info.uid
            }).then(res=> {
                this.data = res.data.data.list;
            }).catch(err => {
                console.log(err)
            })
        }
    },
    created () {
        this.getNewlistData()
    },
    mounted () {}
}
</script>

<style lang="less" scoped>
#bindGiftFixed{
    width: 340px;
    padding: 10px;
    min-height: 200px;
    h2{
        display: block;
        text-align: center;
        font-size: 16px;
        line-height: 40px;
        color: #333;
    }
    .touch{
        max-height: 300px;
        overflow-x: hidden;
        overflow-y: auto;
    }
    ul{
        li:last-child{border: 0;}
        li{
            display: flex;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #ddd;
            .pic{
                width: 60px;
                height: 60px;
                background-repeat: no-repeat;
                background-size: cover;
                background-position: center;
                border-radius: 6px;
                overflow: hidden;
            }
            .info{
                flex: 1;
                text-align: left;
                padding: 0 5px;
                label{
                    display: block;
                    font-size: 12px;
                    color: #333;
                    font-weight: bold;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }
                p{
                    font-size: 10px;
                    color: #999;
                    span{color: #ed7e22;}
                }
                dl{
                    display: block;
                    font-size: 12px;
                    color: #999;
                }
            }
            .btns{
                display: flex;
                flex-direction: column;
                .btn-play{
                    background-color: #f4a460;
                }
                a{
                    display: inline-block;
                    line-height: 30px;
                    padding: 0 20px;
                    font-size: 10px;
                    color: #fff;
                    background-color: #b0c4ce;
                    border-radius: 4px;
                    margin: 5px 0;
                }
            }
        }
    }
}
/deep/.van-cell{background: #eee !important;border-radius: 8px;}
</style>
