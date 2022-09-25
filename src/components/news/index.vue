<template>
    <div id="zhanlongHy-app-news" >
        <h2 class="title">{{ pageData.title }}</h2>
        <p class="time">{{ pageData.create_time }}</p>
        <div class="contents" v-html="pageData.content"></div>
    </div>
</template>

<script>
import Vue from 'vue'
import { Toast, Lazyload, Popup } from 'vant'
import { copy, getCookie } from '@/utils/component';

Vue.use(Toast);
Vue.use(Lazyload);
Vue.use(Popup);
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
        playgame (id) {
            this.$router.push(`/game/${id}`);
        },
        // 页面数据
        postPageData () {
            this.$api.article.newsDetails({
                id: this.$route.params.id
            }).then(res=> {
                this.pageData = res.data.data;
                document.title = res.data.data.title;
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
#zhanlongHy-app-news{
    .title{
        font-size: 16px;
        color: #333;
        margin: 30px 0 0 0;
    }
    .time{
        font-size: 12px;
        color: #999;
    }
    .contents{
        font-size: 12px;
        margin: 20px;
        text-align: left;
    }
}
</style>