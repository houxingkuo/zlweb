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
</style>
