<template>
    <div id="app">
        <router-view></router-view>
        <bind-login v-if="getLogin.status" :pathto="getLogin.to" :pathfrom="getLogin.from" />
    </div>
</template>

<script>
export default {
    name: 'App',
    data () {
        return {
            name: ''
        }
    },
    computed: {
        getLogin () {
            return this.$store.getters.getlogin
        },
        getUserInformation () {
            return this.$store.getters.getUserInformation
        },
        getTaskdot () {
            return this.$store.getters.getTaskdot
        }
    },
    methods: {},
    created () {},
    mounted () {}
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 375px;
    margin: 0 auto;
}
.yindao-popup{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 999999999999999;
}
.yindao-popup img{
    position: relative;
    width: 250px;
    top: 20px;
}
</style>
