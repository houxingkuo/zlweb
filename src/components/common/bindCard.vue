<template>
    <van-popup v-model="status" :close-on-click-overlay="false" round @click-overlay='onBindCard'>
        <div id="bindCardFixed">
            <h2>实名认证</h2>
            <div class="form">
                <div class="list">
                    <van-field v-model="username" placeholder="请输入姓名" />
                </div>
                <div class="list">
                    <van-field v-model="idcard" placeholder="请输入身份证号码" />
                </div>
            </div>
            <a href="javascript:void(0);" target="_self" class="postBind" @click="getIDcardData">确认登记</a>
            <p class="tips">
                尊敬的用户，根据国家规定游戏需要进行实名认证<br>
                1、信息仅用于认证且绝对保密<br>
                2、未成年人游戏支付额度有限制 
            </p>
        </div>
    </van-popup>
</template>

<script>
import Vue from 'vue';
import { Popup, Field, Button, Toast } from 'vant';
import { getCookie } from '@/utils/component';

Vue.use(Popup);
Vue.use(Field);
Vue.use(Button);
Vue.use(Toast);
export default {
    name: 'bindAccount',
    props: ['cardstate'],
    data () {
        return {
            status: true,
            username: '',
            idcard: ''
        }
    },
    methods: {
        onBindCard() {
            this.$emit('onBindCard', {close: false, state: this.cardstate})
        },
        getIDcardData () {
            let $this = this;
            if ($this.username == '' || $this.idcard == '') return false
            $this.$api.article.setIdCord({
                uid: getCookie('ZHANLONGHY_DATA').info.uid,
                idcard: $this.idcard,
                name: $this.username
            }).then(res=> {
                Toast('认证成功');
                // 写入认证成功信息
                if (res.data.data.isAdult == 1) {
                   let idcardStatus = $this.$store.getters.getUserInformation;
                    idcardStatus.is_auth = true;
                    // 写入vuex
                    $this.$store.commit('setUserInformation', idcardStatus); 
                }
                $this.$emit('onBindCard', {close: false, state: res.data.data.isAdult == 1 ? 1 : 2})
            }).catch(err => {
                console.log(err)
            })
        }
    },
    created () {},
    mounted () {}
}
</script>

<style lang="less" scoped>
#bindCardFixed{
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
        }
    }
    .postBind{
        display: block;
        line-height: 40px;
        color: #fff;
        margin: 0 10px;
        font-size: 14px;
        background-color: #f4a460;
        border-radius: 40px;
    }
    .tips{
        display: block;
        font-size: 10px;
        padding: 10px 0;
        color: #999;
        text-align: left;
    }
}
/deep/.van-cell{background: #eee !important;border-radius: 8px;}
</style>
