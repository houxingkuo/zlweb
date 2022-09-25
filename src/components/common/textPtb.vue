<template>
    <van-popup v-model="status" round @click-overlay='onBindPtb'>
        <div id="ruleText">
            <h2>斩龙互娱平台币规则</h2>
            <div class="touch">
                <label>一.充值比例。</label>
                <p>龙币的充值比例为1：10，例如充值1元可获得10个龙币。</p>
                
                <label>二.什么是龙币？</label>
                <p>龙币是斩龙互娱游戏平台的通用币，为了方便用户充值游戏，游戏中心活跃度等推出的一种支付服务。龙币可用于兑换积分商城里面的各种奖励物品，游戏支付等。</p>
                
                <label>三. 哪些地方可以使用龙币？</label>
                <p>1.实物商城</p>
                <p>实物商城上架的物品</p>
                <p>2.指定游戏</p>
                <p>指定的各类游戏可以使用龙币直接等额支付</p>
                
                <label>四.如何获取？</label>
                <p>1.平台不定期抽奖，中将用户会以平台币形式发放</p>
                <p>2.平台充值，在平台币界面直接充值即可获取</p>
                <p>3.限时活动，在指定的活动期间参与者可获得平台币</p>
                
                <label>五.龙币的有效期多久？</label>
                <p>龙币永久有效</p>
            </div>
        </div>
    </van-popup>
</template>

<script>
import Vue from 'vue';
import { Popup } from 'vant';

Vue.use(Popup);
export default {
    name: 'guardianshipText',
    data () {
        return {
            status: true
        }
    },
    methods: {
        onBindPtb() {
            this.$emit('onBindPtb', false)
        }
    },
    created () {},
    mounted () {}
}
</script>

<style lang="less" scoped>
#ruleText{
    width: 350px;
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
        height: 70vh;
        overflow-x: hidden;
        overflow-y: auto;
        text-align: left;
        label{
            font-size: 14px;
            color: #333;
        }
        p{
            font-size: 12px;
            padding: 5px 0;
            color: #999;
        }
    }
}
</style>
