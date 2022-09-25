<template>
    <div class="game-sdk">
        <!-- 选择支付类型 -->
        <van-popup v-model="pay_type_show" :closeable="true" round class="pay-type-page">
            <h3>您需要支付<br><span>&yen;{{ pay_param.money }}</span></h3>
            <div class="list" @click="coinpay">
                <img src="@/assets/images/icon/pay_ptb.png" alt="">
                <p>平台币支付</p>
                <span>余额：<em>{{ coin }}龙币</em></span>
            </div>
            <div class="list" @click="alipay">
                <img src="@/assets/images/icon/pay_alipay.png" alt="">
                <p>支付宝支付</p>
            </div>
            <div class="list" @click="wxpay">
                <img src="@/assets/images/icon/pay_wechat.png" alt="">
                <p>微信支付</p>
            </div>
            <p class="tips">龙币支付规则：1元等于10龙币</p>
        </van-popup>
        <!-- 第三方支付页面 -->
        <div class="pay-iframe" v-if="pay_url != ''">
            <iframe :src="pay_url" frameborder="0"></iframe>
            <div class="back" @click="pay_url = ''">返回<br>游戏</div>
        </div>
        <!-- 平台币充值 -->
        <div class="pay-coin-page" v-if="coin_show">
            <div class="user-info">
                <div>
                    <dl>
                        <img src="@/assets/images/icon/ptb_icon.png" alt="">
                        <span>账号余额</span>
                    </dl>
                    <dl>
                        <img src="@/assets/images/icon/ptb.png" alt="">
                        <p>{{coin}}龙币</p>
                    </dl>
                </div>
                <img :src="getUserInformation.avatar" alt="" class="face">
            </div>
            <div class="uid">用户uid：<span>{{getUserInformation.uid}}</span></div>
            <label>充值金额</label>
            <van-field v-model="digit" type="digit" placeholder="您可以输入充值金额" class="moneyinput" />
            <ul>
                <li v-for="(item, index) in list" :key="index" :class="{'on': digit == item}" @click="digit = item"><p>&yen;{{item}}.00</p><span>{{item*10}}龙币</span></li>
            </ul>
            <label>支付方式</label>
            <ol>
                <dl @click="check = 1">
                    <img src="@/assets/images/icon/radio.png" alt="" v-if="check == 2">
                    <img src="@/assets/images/icon/radio_on.png" alt="" v-else>
                    <span>微信</span>
                </dl>
                <dl @click="check = 2">
                    <img src="@/assets/images/icon/radio.png" alt="" v-if="check == 1">
                    <img src="@/assets/images/icon/radio_on.png" alt="" v-else>
                    <span>支付宝</span>
                </dl>
            </ol>
            <div class="submit" @click="rechargeCoin">确认支付</div>
            <p class="tips" @click="ruleshow = true">《斩龙互娱平台币规则》</p>
            <div class="back" @click="coin_show = false">返回<br>游戏</div>
            <div class="popup-coin-rule" v-if="ruleshow" @click="ruleshow = false">
                <div class="box">
                    <h3>斩龙互娱平台币规则</h3>
                    <div class="touch">
                        <div style="color: red;font-weight: bold;">一.充值比例。</div> <p>龙币的充值比例为1：10，例如充值1元可获得10个龙币。</p>  <div style="color: red;font-weight: bold;">二.什么是龙币？</div> <p>龙币是斩龙互娱游戏平台的通用币，为了方便用户充值游戏，游戏中心活跃度等推出的一种支付服务。龙币可用于兑换积分商城里面的各种奖励物品，游戏支付等。</p>  <div style="color: red;font-weight: bold;">三. 哪些地方可以使用龙币？</div> <p>1.实物商城</p> <p>实物商城上架的物品</p> <p>2.指定游戏</p> <p>指定的各类游戏可以使用龙币直接等额支付</p>  <div style="color: red;font-weight: bold;">四.如何获取？</div> <p>1.平台不定期抽奖，中将用户会以平台币形式发放</p> <p>2.平台充值，在平台币界面直接充值即可获取</p> <p>3.限时活动，在指定的活动期间参与者可获得平台币</p>  <div style="color: red;font-weight: bold;">五.龙币的有效期多久？</div> <p>龙币永久有效</p>
                    </div>
                </div>
            </div>
        </div>
        <!-- 扫码支付 -->
        <div class="pay-code-page" v-if="pay_codeimg != ''" @click="pay_codeimg = '';">
            <div>
                <img :src="pay_codeimg" frameborder="0" />
                <p v-if="code_type == 1">打开微信扫码支付</p>
                <p v-else>打开支付宝扫码支付</p>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { Toast, Popup, Field } from 'vant';

Vue.use(Toast);
Vue.use(Popup);
Vue.use(Field);
import { isSysName } from '@/utils/component'
export default {
    name: 'gamesdk',
    data () {
        return {
            iframe_show: false,
            pay_type_show: false,
            pay_param: {},
            pay_url: '',
            coin: 0,
            digit: '',
            list:[10, 50, 100, 500, 1000, 2000],
            check: 1,
            ruleshow: false,
            coin_show: false,
            pay_codeimg: '',
            code_type: 1
        }
    },
    computed: {
        getUserInformation () {
            return this.$store.getters.getUserInformation;
        }
    },
    methods: {
        clientType () {
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
                return 2
            } else if (/(Android)/i.test(navigator.userAgent)) { //判断Android
                return 1
            } else { //pc
                return 3
            };
        },
        wxwechat (data) {
            function onBridgeReady(){
                WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    "appId": data.appId,
                    "timeStamp": ''+data.timeStamp+'',
                    "nonceStr": data.nonceStr,
                    "package": data.package,
                    "signType": data.signType,
                    "paySign": data.paySign
                },
                function(res){
                    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                    if(res.err_msg == "get_brand_wcpay_request:ok" ){
                        Toast('支付成功');
                        document.getElementById("vue-game-iframe").contentWindow.zhanlongHyPay.coinGetData();
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
        uploadLogs (param) {
            this.$api.article.roleReport(param).then(res=> {
                console.log('上报成功', res)
            }).catch(err => {
                console.log(err)
            })
        },
        wxpay () {
            this.pay_type_show = false
            if (isSysName() != 'pc') {
                let type = 4
                navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger" ? type = 1 : type = 4
                this.pay_param.type = type
                this.pay_param.client = this.clientType() == 3 ? 3 : this.$route.query.client || 2;
                this.pay_param.clientType = this.clientType();
                this.$api.article.createGameOrder(1, this.pay_param).then(res=> {
                    console.log('支付接口', res)
                    if (type == 1) {
                        // 公众号支付
                        this.wxwechat(res.data.data.pay);
                    } else if (type == 4) {
                        // h5微信支付
                        window.location.href = res.data.data.pay
                    }
                }).catch(err => {
                    console.log(err)
                })
            } else {
                this.code_type = 1;
                this.pay_param.type = 7;
                this.pay_param.client = this.clientType() == 3 ? 3 : this.$route.query.client || 2;
                this.pay_param.clientType = this.clientType();
                this.pay_codeimg = this.$api.article.createGameOrder(2, this.pay_param)
            }
        },
        alipay () {
            this.pay_type_show = false
            if (isSysName() != 'pc') {
                this.pay_param.type = 3
                this.pay_param.client = this.clientType() == 3 ? 3 : this.$route.query.client || 2;
                this.pay_param.clientType = this.clientType();
                this.pay_url = this.$api.article.createGameOrder(2, this.pay_param)
            } else {
                this.code_type = 2;
                this.pay_param.type = 8;
                this.pay_param.client = this.clientType() == 3 ? 3 : this.$route.query.client || 2;
                this.pay_param.clientType = this.clientType();
                this.pay_codeimg = this.$api.article.createGameOrder(2, this.pay_param)
            }
        },
        coinpay () {
            this.pay_type_show = false
            if (this.coin >= this.pay_param.money * 10) {
                this.pay_param.type = 5
                this.pay_param.client = this.clientType() == 3 ? 3 : this.$route.query.client || 2;
                this.pay_param.clientType = this.clientType();
                this.$api.article.createGameOrder(1, this.pay_param).then(res=> {
                    Toast('支付成功')
                }).catch(err => {
                    console.log(err)
                })
            } else {
                // 龙币不足打开充值页面
                if (isSysName() != 'pc') {
                    this.coin_show = true
                } else {
                    Toast('龙币不足')
                }
            }
        },
        rechargeCoin () {
            if (this.check == 1) {
                // 微信充平台币
                let type = 4;
                navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger" ? type = 1 : type = 4
                this.$api.article.createCoinOrder(1, {
                    uid: this.getUserInformation.uid,
                    type: type,
                    coin: this.digit
                }).then(res=> {
                    console.log('支付接口', res)
                    if (type == 1) {
                        // 公众号支付
                        this.wxwechat(res.data.data.pay);
                    } else if (type == 4) {
                        // h5微信支付
                        window.location.href = res.data.data.pay
                    }
                }).catch(err => {
                    console.log(err)
                })
            } else {
                // 支付宝充平台币
                this.pay_url = this.$api.article.createCoinOrder(2, {
                    uid: this.getUserInformation.uid,
                    type: 3,
                    coin: this.digit
                })
            }
        },
        getcoin () {
            this.$api.article.getCoin({
                uid: this.getUserInformation.uid
            }).then(res=> {
                console.log(res)
                this.coin = res.data.data.coin
            }).catch(err => {
                console.log(err)
            })
        }
    },
    created () {},
    mounted () {
        let $this = this
        window.addEventListener('message', function (event) {
            switch (event.data.operation) {
                case "config":
                    // 初始化配置 进入游戏
                    console.log('初始化');
                    break;
                case "uploadGameRole":
                    // 上报角色
                    $this.uploadLogs(event.data.param);
                    break;
                case "onPay":
                    // 支付
                    $this.pay_param = event.data.param;
                    $this.getcoin();
                    $this.pay_type_show = true;
                    break;
                default:
                    break;
            }
        });
    }
}
</script>

<style lang="less" scoped>
.pay-type-page{
    padding: 20px 10px;
    width: 300px;
    h3{
        font-size: 20px;
        color: #333;
        span{
            font-size: 36px;
            color: #e8485e;
        }
    }
    .tips{
        font-size: 12px;
        color: #999;
        padding: 20px 0 0 0;
    }
    .list::after{
        display: block;
        border: 1px solid;
        content: '';
        border-color: transparent transparent #999 #999;
        right: 4px;
        top: 45%;
        transform: translateY(-50%);
        width: 8px;
        height: 8px;
        position: absolute;
        transform: rotate(-135deg);
    }
    .list{
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #eee;
        padding: 10px 0;
        position: relative;
        img{width: 30px;}
        p{
            flex: 1;
            text-align: left;
            font-size: 12px;
            color: #333;
            padding: 0 10px;
        }
        span{
            padding: 0 20px 0 0;
            text-align: right;
        }
        em{color: #e8485e;}
    }
}
.pay-iframe{
    position: fixed;
    width: 100%;
    height: 100vh;
    left: 0;
    top: 0;
    background-color: #fff;
    z-index: 9999999999;
    overflow: scroll;
    iframe{
        width: 375px;
        min-height: 100vh;
        margin: 0 auto;
    }
    .back{
        position: fixed;
        width: 75px;
        height: 75px;
        bottom: 10px;
        right: 10px;
        padding: 10px;
        border-radius: 100vh;
        font-size: 18px;
        color: #fff;
        background-color: rgba(64, 158, 255, 0.5);
        z-index: 2;
    }
}
.pay-code-page{
    position: fixed;
    width: 100%;
    height: 100vh;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99999999;
    div{
        width: 200px;
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        border-radius: 10px;
        background-color: #fff;
        img{
            width: 150px;
        }
        p{
            font-size: 12px;
            padding: 10px 0 0 0;
            color: #333;
        }
    }
}
.pay-coin-page{
    position: fixed;
    width: 100%;
    height: 100vh;
    left: 0;
    top: 0;
    background-color: #fff;
    z-index: 999999999;
    overflow: scroll;
    .user-info{
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        .face{
            width: 80px;
            height: 80px;
        }
        div{
            flex: 1;
            padding: 0 10px 0 0;
            dl{
                display: flex;
                justify-content: center;
                align-items: center;
                text-align: left;
                margin: 5px 0;
                img{
                    height: 30px;
                    margin: 0 10px 0 0;
                }
                span{
                    font-size: 14px;
                    color: #333;
                    flex: 1;
                }
                p{
                    font-size: 16px;
                    color: #0ff;
                    flex: 1;
                }
            }
        }
    }
    .uid{
        font-size: 16px;
        padding: 0 10px;
        color: #333;
        text-align: left;
        span{color: #ee0a24;}
    }
    label{
        font-size: 16px;
        color: #333;
        margin: 10px;
        padding: 0 10px;
        border-left: 5px solid #fb5757;
        display: block;
        text-align: left;
    }
    .moneyinput{
        margin: 0 10px;
        border: 1px solid #999;
        border-radius: 10px;
        width: auto;
    }
    /deep/.van-cell::after{border: none;}
    ul{
        margin: 10px 10px 0 10px;
        overflow: hidden;
        li:nth-child(3n){margin-right: 0;}
        li.on{border: 1px solid violet;}
        li{
            width: 100px;
            border: 1px solid #999;
            border-radius: 8px;
            padding: 10px;
            margin: 5px 27px 5px 0;
            float: left;
            p{
                font-size: 16px;
                color: violet;
            }
            span{
                font-size: 12px;
                color: #999;
            }
        }

    }
    ol{
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px;
        dl{
            flex: 1;
            text-align: left;
            img{
                height: 20px;
                vertical-align: middle;
            }
            span{
                font-size: 14px;
                color: #333;
                vertical-align: middle;
            }
        }
    }
    .submit{
        margin: 20px 10px 10px 10px;
        border-radius: 10px;
        background-color: #ee82ee;
        font-size: 16px;
        color: #fff;
        line-height: 40px;
    }
    .tips{
        font-size: 12px;
        color: #4ba4f8;
    }
    .popup-coin-rule{
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 3;
        .box{
            width: 300px;
            position: relative;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            border-radius: 10px;
            padding: 10px;
            h3{
                font-size: 16px;
                color: #333;
            }
            .touch{
                height: 50vh;
                overflow: scroll;
                text-align: left;
            }
        }
    }
    .back{
        position: fixed;
        width: 75px;
        height: 75px;
        bottom: 10px;
        right: 10px;
        padding: 10px;
        border-radius: 100vh;
        font-size: 18px;
        color: #fff;
        background-color: rgba(64, 158, 255, 0.5);
        z-index: 2;
    }
}
</style>
