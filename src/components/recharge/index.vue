<template>
    <div id="zlhy-recharge-page">
        <van-sticky>
            <div class="usermoney">
                <p>账户余额：{{ coin }}龙币</p>
            </div>
        </van-sticky>
        <div class="content">
            <div class="recharge-warp">
                <p class="title" style="margin-top:30px;">热门游戏推荐</p>
                <div class="playedGame" v-if="getHotGameData !== undefined && getHotGameData.length > 0">
                    <div class="touchBox">
                        <ul :style="{'width': `${getHotGameData.length*111/37.5}rem`}">
                            <li v-for="(item, index) in getHotGameData" :key="index" @click="playgame(item.id)">
                                <img :src="item.icon" :alt="item.name" width="100%" />
                                <p class="name">{{ item.name }}</p>
                                <span class="btns">开始游戏</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <p class="title" style="margin-top:10px;">自定义充值金额</p>
                <van-field v-model="money" type="digit" placeholder="您可以输入充值金额" @focus="inputChange" />
                <p class="title" style="margin-top:20px;">快捷充值</p>
                <ul class="recharge-money-items">
                    <li @click="payMoney(10, 'list1')" v-bind:class="{'on': moneyList == 'list1'}">¥ 10.00</li>
                    <li @click="payMoney(50, 'list2')" v-bind:class="{'on': moneyList == 'list2'}">¥ 50.00</li>
                    <li @click="payMoney(100, 'list3')" v-bind:class="{'on': moneyList == 'list3'}">¥ 100.00</li>
                    <li @click="payMoney(500, 'list4')" v-bind:class="{'on': moneyList == 'list4'}">¥ 500.00</li>
                    <li @click="payMoney(1000, 'list5')" v-bind:class="{'on': moneyList == 'list5'}">¥ 1000.00</li>
                    <li @click="payMoney(2000, 'list6')" v-bind:class="{'on': moneyList == 'list6'}">¥ 2000.00</li>
                </ul>
            </div>
            <ol class="recharge-money-type">
                <li @click="payType = 'wx'">
                    <img src="@/assets/images/recharge/wechat.png" alt="微信">
                    <span>微信支付</span>
                    <em v-if="payType == 'wx'" class="on"></em>
                    <em v-else></em>
                </li>
                <li @click="payType = 'alipay'">
                    <img src="@/assets/images/recharge/alipay.png" alt="支付宝">
                    <span>支付宝支付</span>
                    <em v-if="payType == 'alipay'" class="on"></em>
                    <em v-else></em>
                </li>
            </ol>
            <a href="javascript:void(0);" target="_self" class="app-ptb-paybtn" @click="postPayData">确认支付</a>
            <p class="tips" @click="onBindPtb">阅读<span>《斩龙互娱平台币规则》</span></p>
        </div>
        <text-ptb data-title="平台币规则" v-if="ptbStatus" @onBindPtb="onBindPtb" />
        <div class="yindao-popup" v-if="yindao == true" @click="yindao = false">
            <img src="@/assets/images/yindao.png" alt="">
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { Toast, Field, cellGroup, Icon, Sticky } from 'vant';
import { getCookie } from '@/utils/component';

Vue.use(Toast);
Vue.use(Field);
Vue.use(Icon);
Vue.use(cellGroup);
Vue.use(Sticky);
export default {
    name: 'recharge',
    data () {
        return {
            coin: 0,
            digit: '',
            payType: 'wx',
            money: '',
            moneyList: 'list0',
            ptbStatus: false,
            submit: '',
            getHotGameData: [],
            yindao: false,
        }
    },
    methods: {
        // 开玩
        playgame (id) {
            this.$router.push(`/game/${id}`);
        },
        payMoney(money, list) {
            this.money = money;
            this.moneyList = list;
            console.log(money)
        },
        inputChange () {
            this.moneyList = 'list0';
        },
        postPayData () {
            if (this.money == '') {
                Toast('请输入要充值的面额');
                return false;
            }
            let type = '';
            if (this.payType == 'wx') {
                if (navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
                    type = 1;
                } else {
                    type = 4;
                }
                this.$api.article.createCoinOrder({
                    uid: getCookie('ZHANLONGHY_DATA').info.uid,
                    coin: this.money,
                    type: type
                }).then(res=> {
                    if (type == 1) {
                        this.onwxpay(res.data.data.pay.appId, res.data.data.pay.timeStamp, res.data.data.pay.nonceStr, res.data.data.pay.package, res.data.data.pay.signType, res.data.data.pay.paySign)
                    } else if (type == 4) {
                        location.href = res.data.data.pay;
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
            if(this.payType == 'alipay') {
                if (navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
                    this.yindao = true
                } else {
                    type = 3;
                    location.href = this.$api.article.createCoinOrderUrl({
                        uid: getCookie('ZHANLONGHY_DATA').info.uid,
                        coin: this.money,
                        type: type
                    })
                }
            }
        },
        onBindPtb (status) {
            this.ptbStatus = !this.ptbStatus
        },
        // 获取当前余额
        getCoin () {
            let cookie = getCookie('ZHANLONGHY_DATA') == null || JSON.stringify(getCookie('ZHANLONGHY_DATA')) == "{}";
            if (cookie) return false
            this.$api.article.getCoin({
                uid: getCookie('ZHANLONGHY_DATA').info.uid
            }).then(res=> {
                this.coin = res.data.data.coin
            }).catch(err => {
                console.log(err)
            })
        },
        onwxpay (appId, timeStamp, nonceStr, recharge, signType, paySign) {
            let $this = this;
            function onBridgeReady(){
                WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    "appId":appId,
                    "timeStamp":''+timeStamp+'',
                    "nonceStr":nonceStr,
                    "package": recharge,
                    "signType": signType,
                    "paySign":paySign
                },
                function(res){
                    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                    if(res.err_msg == "get_brand_wcpay_request:ok" ){
                        Toast('支付成功');
                        $this.getCoin();
                    } else if (res.err_msg == "get_brand_wcpay_request:cancel" || res.err_msg == "get_brand_wcpay_request:fail"){
                        Toast('支付失败');
                    }
                });
            }
            if (typeof WeixinJSBridge == "undefined"){
                if( document.addEventListener ){
                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                }else if (document.attachEvent){
                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                }
            }else{
                onBridgeReady();
            }
        },
        // 我玩过的游戏
        getHotGame (id) {
            this.$api.article.getHotGame({
                uid: getCookie('ZHANLONGHY_DATA').info.uid
            }).then(res=> {
                this.getHotGameData = res.data.data.list
            }).catch(err => {
                console.log(err)
            })
        },
    },
    created () {
        this.getCoin();
        this.getHotGame();
    },
    mounted () {}
}
</script>

<style lang="less" scoped>
#zlhy-recharge-page{
    width: 375px;
    .usermoney{
        background: #f4a460;
        position: relative;
        p{
            display: block;
            padding: 20px 0;
            font-size: 16px;
            font-weight: bold;
            color: #fff;
        }
        /deep/.van-icon{
            position: absolute;
            left: 15px;
            font-size: 18px;
            top: 50%;
            transform: translateY(-50%);
            color: #fff;
        }
    }
    .content{
        background: #fff;
        border-radius: 8px 8px 0 0;
        margin: -10px 0 50px 0;
        overflow: hidden;
        .title{
            margin: 5px 10px;
            border-left: 4px solid #FF7E99;
            text-align: left;
            padding: 0 0 0 5px;
            font-size: 14px;
            color: #333;
            font-weight: bold;
        }
        .playedGame{
            width: 100%;
            background: #fff;
            overflow: hidden;
            .touchBox{
                width: 100%;
                padding: 13px 0;
                overflow-y: hidden;
                overflow-x: auto;
                float: right;
                ul{
                    overflow: hidden;
                    li{
                        float: left;
                        width: 90px;
                        border: 1px solid #dedede;
                        margin: 0 10px;
                        padding: 5px 0;
                        border-radius: 4px;
                        overflow: hidden;
                        img{
                            width: 60px;
                            height: 60px;
                            margin: 0 auto;
                            border-radius: 15px;
                        }
                        .name{
                            display: block;
                            margin: 0 5px;
                            font-size: 10px;
                            color: #333;
                            text-align: center;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .btns{
                            font-size: 10px;
                            margin: 0 10px;
                            color: #fff;
                            display: block;
                            border-radius: 4px;
                            line-height: 20px;
                            background-color: #30c1fd;
                        }
                    }
                }
            }
        }
        .recharge-money-items{
            margin: 20px 0;
            overflow: hidden;
            li.on{border: 1px solid #f4a460;background-color: #f4a460;color: #fff;}
            li{
                width: 100px;
                line-height: 40px;
                text-align: center;
                border-radius: 8px;
                overflow: hidden;
                margin: 5px 12px;
                float: left;
                border: 1px solid #333;
                font-size: 14px;
                color: #333;
            }
        }
        .recharge-money-type{
            margin: 0 10px;
            overflow: hidden;
            li{
                display: flex;
                align-items: center;
                padding: 5px 0;
                img{
                    width: 30px;
                    height: 30px;
                }
                span{
                    flex: 1;
                    font-size: 14px;
                    color: #333;
                    text-align: left;
                    padding: 0 10px;
                }
                em.on{
                    background: url('../../assets/images/recharge/radio_on.png') top center no-repeat;
                    background-size: 100% 100%;
                }
                em{
                    width: 12px;
                    height: 12px;
                    background: url('../../assets/images/recharge/radio.png') top center no-repeat;
                    background-size: 100% 100%;
                }
            }
        }
        .app-ptb-paybtn{
            line-height: 40px;
            display: block;
            background: #3EC4FF;
            outline: none;
            border: none;
            font-size: 16px;
            color: #fff;
            border-radius: 40px;
            margin: 20px 50px 10px 50px;
        }
        .tips{
            font-size: 10px;
            color: #999;
            span{color: #3EC4FF;}
        }
    }
}
</style>
