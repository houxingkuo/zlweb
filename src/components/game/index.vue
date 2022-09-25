<template>
    <div id="zlhy-app-game-iframe">
        <iframe :src="gameurl" name="vue-game-iframe" frameborder="0" id="vue-game-iframe" :class="{'loading': is_applet}"></iframe>
        <game-ball />
        <game-info />
        <game-sdk />
    </div>
</template>

<script>
import gameBall from  '@/components/common/suspension'
import gameInfo from  '@/components/common/gameInfo'
import gameSdk from  '@/components/common/gamesdk'
export default {
    data () {
        return {
            gameurl: '',
            is_applet: false
        }
    },
    components: {
        gameBall,
        gameInfo,
        gameSdk
    },
    computed: {
        getUserInformation () {
            return this.$store.getters.getUserInformation
        }
    },
    methods: {
        clientType() {
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
                return 2
            } else if (/(Android)/i.test(navigator.userAgent)) { //判断Android
                return 1
            } else { //pc
                return 3
            };
        },
        iframeFunc (){
            let data = {
                uid: this.getUserInformation.uid,
                id: this.$route.params.id,
                client: 2,
                clientType: this.clientType(),
                tune: this.$store.getters.getTune,
                gtype: 1,
                isxcx: 0
            }
            if (this.$route.query.st == 1) {
                data.isapp = 1;
                data.isrole = this.$route.query.isrole
            }
            this.$api.article.getgameinfo(data).then(res=> {
                console.log(res)
                //获取实名认证
                document.title = res.data.data.gamename
                let newinfo = this.$store.getters.getUserInformation;
                newinfo.is_auth = res.data.data.isAdult == 1 ? true : false;
                // 写入vuex
                this.$store.commit('setUserInformation', newinfo);
                this.gameurl = res.data.data.url
            }).catch(err => {
                console.log(err)
            })
        }
    },
    created () {
        this.iframeFunc();
    },
    mounted () {}
}
</script>

<style lang="less" scoped>
#zlhy-app-game-iframe{
    margin: 0 auto;
    #vue-game-iframe{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
    }
    .loading{
        background-image: url('/static/app/Public/img/game_bg.png');
        background-repeat: no-repeat;
        background-size: cover;
    }
}
</style>
