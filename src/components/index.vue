<template>
    <div>
        <router-view></router-view>
        <van-tabbar v-model="active" :placeholder="true" :route="true">
            <van-tabbar-item :to="{path:'/index'}">
                <span>首页</span>
                <template #icon="props">
                    <img src="@/assets/images/icon/home_icon_active.png" alt="" v-if="props.active">
                    <img src="@/assets/images/icon/home_icon.png" alt="" v-else>
                </template>
            </van-tabbar-item>
            <van-tabbar-item :to="{path:'/gift'}">
                <span>礼包</span>
                <template #icon="props">
                    <img src="@/assets/images/icon/gift_icon_active.png" alt="" v-if="props.active">
                    <img src="@/assets/images/icon/gift_icon.png" alt="" v-else>
                </template>
            </van-tabbar-item>
            <van-tabbar-item :to="{path:'/logs'}" :dot="getTaskdot">
                <span>资讯</span>
                <template #icon="props">
                    <img src="@/assets/images/icon/log_icon_active.png" alt="" v-if="props.active">
                    <img src="@/assets/images/icon/log_icon.png" alt="" v-else>
                </template>
            </van-tabbar-item>
            <van-tabbar-item :to="{path:'/user'}">
                <span>我的</span>
                <template #icon="props">
                    <img src="@/assets/images/icon/member_icon_active.png" alt="" v-if="props.active">
                    <img src="@/assets/images/icon/member_icon.png" alt="" v-else>
                </template>
            </van-tabbar-item>
        </van-tabbar>
        <div v-bind:class="{'zlhy-top': true, 'fixshow':ClassObj.fixshow}" @click="scrollTop">
            <img src="@/assets/images/icon/top.png" alt="TOP">
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { Toast, Tabbar, TabbarItem, Icon, PullRefresh } from 'vant';

Vue.use(Toast);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(Icon)
Vue.use(PullRefresh)
export default {
    data () {
        return {
            ClassObj: {
                fixshow: false
            },
            dot: false,
            active: 0
        }
    },
    computed: {
        getTaskdot () {
            return this.$store.getters.getTaskdot
        }
    },
    methods: {
        onSearch(val) {
            Toast(val);
        },
        scrollTop () {
            let scrollToptimer = setInterval(function () {
                let top = document.body.scrollTop || document.documentElement.scrollTop;
                let speed = top / 4;
                if (document.body.scrollTop!=0) {
                    document.body.scrollTop -= speed;
                }else {
                    document.documentElement.scrollTop -= speed;
                }
                if (top == 0) {
                    clearInterval(scrollToptimer);
                }
            }, 30);
        }
    },
    mounted () {
        let $this = this;
        window.onscroll = function () {
            const t = document.documentElement.scrollTop || document.body.scrollTop;
            if (t>500) {
                $this.ClassObj.fixshow = true;
            } else {
                $this.ClassObj.fixshow = false;
            }
        };
    }
}
</script>

<style lang="less" scoped>
.zlhy-top.fixshow{
    transform: rotate(0);
    right: 10px;
}
.zlhy-top{
    width: 45px;
    height: 45px;
    overflow: hidden;
    position: fixed;
    z-index: 29;
    bottom: 80px;
    right: -90px;
    transition: all 0.5s;
    transform: rotate(180deg);
    background-color: #ccc;
    border-radius: 100vh;
    padding: 10px;
    cursor: pointer;
    img{
        width: 100%;
    }
}
.icon-home{ background-image: url('../assets/images/icon/home_icon.png'); background-repeat: no-repeat; background-size: 100% 100%; width: 25px; height: 25px; display: block; margin: 0 auto; }
/deep/.van-tabbar-item--active .icon-home{background-image: url('../assets/images/icon/home_icon_active.png'); background-repeat: no-repeat; background-size: 100% 100%;}

.icon-gift{ background-image: url('../assets/images/icon/gift_icon.png'); background-repeat: no-repeat; background-size: 100% 100%; width: 25px; height: 25px; display: block; margin: 0 auto; }
/deep/.van-tabbar-item--active .icon-gift{background-image: url('../assets/images/icon/gift_icon_active.png'); background-repeat: no-repeat; background-size: 100% 100%;}

.icon-shop{ background-image: url('../assets/images/icon/shoping_icon.png'); background-repeat: no-repeat; background-size: 100% 100%; width: 25px; height: 25px; display: block; margin: 0 auto; }
/deep/.van-tabbar-item--active .icon-shop{background-image: url('../assets/images/icon/shoping_icon_active.png'); background-repeat: no-repeat; background-size: 100% 100%;}

.icon-user{ background-image: url('../assets/images/icon/member_icon.png'); background-repeat: no-repeat; background-size: 100% 100%; width: 25px; height: 25px; display: block; margin: 0 auto; }
/deep/.van-tabbar-item--active .icon-user{background-image: url('../assets/images/icon/member_icon_active.png'); background-repeat: no-repeat; background-size: 100% 100%;}
.fa{transform: scale(0.8);}
/deep/.van-tabbar-item--active{color: #f4a460;}
/deep/.van-tabbar--fixed{
    left: 50%;
    width: 375px;
    margin-left: -187.5px;
}
/deep/.van-tabs__content{
    background-color: #ffffff;
    overflow: hidden;
}
</style>
