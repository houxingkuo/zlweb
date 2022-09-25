<template>
    <van-popup v-model="status" round @click-overlay='onBindAccount'>
        <div id="bindAccountFixed">
            <h2>绑定账号</h2>
            <div class="form">
                <div class="list">
                    <van-field v-model="tel" type="tel" placeholder="请输入手机号码" />
                </div>
                <div class="list">
                    <van-field
                    v-model="sms"
                    center
                    clearable
                    maxlength="6"
                    placeholder="请输入短信验证码"
                    ></van-field>
                    <a href="javascript:void(0);" target="_self" class="getCode" style="background-color:#f4a460;" v-if="time == 0" @click="timeOut(60)">获取验证码</a>
                    <a href="javascript:void(0);" target="_self" class="getCode" style="background-color:#cccccc;" v-else>{{ time }}s</a>
                </div>
                <div class="list">
                    <van-field v-model="password" type="password" placeholder="请输入密码" />
                </div>
            </div>
            <a href="javascript:void(0);" target="_self" class="postBind" @click="postPhoneData">确认绑定</a>
            <p class="tips">尊敬的客户：为了账户安全，建议您先绑定手机</p>
        </div>
    </van-popup>
</template>

<script>
import Vue from 'vue';
import { Popup, Field, Button, Toast } from 'vant';
import { getCookie } from '@/utils/component';

Vue.use(Toast);
Vue.use(Popup);
Vue.use(Field);
Vue.use(Button);
export default {
    name: 'bindAccount',
    data () {
        return {
            status: true,
            tel: '',
            sms: '',
            time: 0,
            password: ''
        }
    },
    methods: {
        onBindAccount() {
            this.$emit('onBindAccount', false)
        },
        // 60秒倒计时
        timeOut (wait) {
            let $this = this;
            // 绑定发送验证码
            if ($this.tel == '') return false
            this.$api.article.code({
                uid: getCookie('ZHANLONGHY_DATA').info.uid,
                type: 2,
                phone: $this.tel
            }).then(res=> {
                $this.time = wait;
                let timeClose = setInterval(() => {
                    $this.time--;
                    if ($this.time == 0) {
                        clearInterval(timeClose);
                    }
                }, 1000);
            }).catch(err => {
                console.log(err)
            })
        },
        postPhoneData () {
            let $this = this;
            if ($this.tel == '' || $this.sms == '' || $this.password == '') return false
            this.$api.article.bindPhone({
                uid: getCookie('ZHANLONGHY_DATA').info.uid,
                phone: $this.tel,
                code: $this.sms,
                pwd: $this.password
            }).then(res=> {
                Toast('绑定成功');
                // 写入绑定成功信息
                let bindPhoneStatus = $this.$store.getters.getUserInformation;
                bindPhoneStatus.mobile = $this.tel;
                // 写入vuex
                $this.$store.commit('setUserInformation', bindPhoneStatus);
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
#bindAccountFixed{
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
            background: #eee;
            border-radius: 8px;
            display: flex;
            align-items: center;
            .getCode{
                width: 120px;
                padding: 7px 0;
                font-size: 12px;
                border-radius: 4px;
                margin: 0 10px 0 10px;
                color: #fff;
            }
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
    }
}
/deep/.van-cell{background: transparent !important;}
</style>
