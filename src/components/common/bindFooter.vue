<template>
    <div id="zhanlongHy-app-footer">
        <p>联系我们：hzzlhy_vip@163.com</p>
        <p @click="beian"> <img src="@/assets/images/aqi.png" alt=""> <span>浙ICP备20022889号-4</span></p>
        <p>健康游戏公告: 抵制不良游戏 拒绝盗版游戏 注意自我保护 谨防受骗上当</p>
        <p>适度游戏益脑 沉迷游戏伤身 合理安排时间 享受健康生活</p>
    </div>
</template>

<script>
export default {
    name: 'bindFooter',
    data () {
        return {
            value: ''
        }
    },
    methods: {
        beian () {
            location.href = 'https://beian.miit.gov.cn'
        }
    },
    created () {},
    mounted () {}
}
</script>

<style lang="less" scoped>
#zhanlongHy-app-footer{
    padding: 20px 20px;
    font-size: 12px;
    color: #333;
    text-align: center;
    a{display: flex;align-items: center;justify-content: center;color: #333;}
    img,span{vertical-align: middle;}
    span{color: blue;text-decoration: underline;}
}
</style>
