<template>
    <div id="zhly-logs-page">
        <div class="logs-tab-warp">
            <div class="tab-bg">
                <a href="javascript:void(0);" target="_self" v-for="(item, index) in informationTab.item" :key="index"
                    @click="logsTab(index)">
                    <span class="on" v-if="index === informationTab.index">{{ item }}</span>
                    <span v-else>{{ item }}</span>
                </a>
            </div>
        </div>
        <div class="logs-content" v-if="informationTab.index == 0">
            <ul class="logsItem" v-if="gameNewlistData.data.length != 0">
                <li v-for="(item, index) in gameNewlistData.data" :key="index" @click="newsdetails(item.id)">
                    <label class="title">{{ item.title }}</label>
                    <span>{{ item.time }}</span>
                </li>
                <p @click="getNewlistData" v-if="gameNewlistData.npi != 0" style="padding:30px 0;font-size:14px;">点击加载更多</p>
            </ul>
            <div class="noKaifuGame" v-else>
                <img src="@/assets/images/icon/no-information.png" alt="无数据" width="50%">
            </div>
        </div>
        <div class="logs-content" v-else-if="informationTab.index == 1">
            <ul class="logsItem" v-if="gameNewlistData.data.length != 0">
                <li v-for="(item, index) in gameNewlistData.data" :key="index" @click="newsdetails(item.id)">
                    <label class="title">{{ item.title }}</label>
                    <span>{{ item.time }}</span>
                </li>
                <p @click="getNewlistData" v-if="gameNewlistData.npi != 0" style="padding:30px 0;font-size:14px;">点击加载更多</p>
            </ul>
            <div class="noKaifuGame" v-else>
                <img src="@/assets/images/icon/no-information.png" alt="无数据" width="50%">
            </div>
        </div>
        <div class="logs-content" v-else-if="informationTab.index == 2">
            <ul class="gameItem" v-if="gameNewlistData.data.length != 0">
                <li v-for="(item, index) in gameNewlistData.data" :key="index" @click="newsdetails(item.id)">
                    <div class="pic">
                        <img v-lazy="item.icon" :alt="item.name">
                    </div>
                    <div class="info">
                        <div class="title">
                            <label class="name">{{ item.title }}</label>
                        </div>
                        <p class="desc">{{ item.time }}</p>
                    </div>
                    <a href="javascript:void(0);" target="_self" class="playGameBtn">查看</a>
                </li>
                <p @click="getNewlistData" v-if="gameNewlistData.npi != 0" style="padding:30px 0;font-size:14px;">点击加载更多</p>
            </ul>
            <div class="noKaifuGame" v-else>
                <img src="@/assets/images/icon/no-information.png" alt="无数据" width="50%">
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { Lazyload } from 'vant';

Vue.use(Lazyload);
export default {
    name: 'shop',
    data() {
        return {
            informationTab: {
                index: 1,
                item: ['活动', '公告', '攻略']
            },
            gameNewlistData: {
                npi: 1,
                ids: '',
                data:[]
            }
        }
    },
    computed: {
        getUserInformation () {
            return this.$store.getters.getUserInformation;
        },
        getTaskdot () {
            return this.$store.getters.getTaskdot;
        }
    },
    methods: {
        newsdetails (id) {
            this.$router.push({
                path: `/logsinfo/${id}`
            })
        },
        logsTab(index) {
            this.informationTab.index = index;
            this.gameNewlistData = {
                npi: 1,
                ids: '',
                data:[]
            }
            this.getNewlistData();
        },
        getNewlistData () {
            this.$api.article.gameNewList({
                page: this.gameNewlistData.npi,
                type: this.informationTab.index+1,
                ids: this.gameNewlistData.ids
            }).then(res=> {
                this.gameNewlistData.npi = res.data.npi;
                let ids = [];
                for (const iterator of res.data.data.list) {
                    ids.push(iterator.id);
                    this.gameNewlistData.data.push(iterator)
                }
                this.gameNewlistData.ids = ids.join(',');
            }).catch(err => {
                console.log(err)
            })
        }
    },
    created() {
        this.getNewlistData();
    },
    mounted() {}
}
</script>

<style lang="less" scoped>
#zhly-logs-page{
    width: 100%;
    overflow: hidden;
    .gameItem {
    padding: 0 10px;

    li:before {
      content: "";
      width: 100%;
      height: 1px;
      background: #eee;
      position: absolute;
      left: 0;
      bottom: 0;
      transform: scale(1, 0.5);
    }

    li {
      display: flex;
      padding: 15px 0;
      align-items: center;
      position: relative;
        cursor: pointer;
      .pic {
        width: 60px;
        height: 60px;
        border-radius: 10px;
        overflow: hidden;
        img {
          width: 60px;
        }
      }

      .info {
        text-align: left;
        flex: 1;
        padding: 0 10px;

        .title {
          color: #333;
          line-height: 20px;

          .name {
            font-size: 14px;
            margin: 0 5px 0 0;
            cursor: pointer;
          }
        }

        .desc {
          font-size: 10px;
          padding: 5px 0 0 0;
          color: #666;
        }
      }

      .playGameBtn {
        line-height: 30px;
        padding: 0 15px;
        border-radius: 30px;
        color: #fff;
        background-color: #f4a460;
      }
    }
  }
    .logs-tab-warp {
        width: 100%;
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        background-color: #fff;
        z-index: 1;
        .tab-bg{
            width: 300px;
            margin: 0 auto;
            background: rgba(244, 164, 96, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 30px;
            line-height: 30px;
            margin: 15px auto;
        }
        a {
            display: block;
            flex: 1;
            font-size: 14px;
            color: #f29494;

            span {
                width: 100%;
                display: block;
                background: transparent;
                border-radius: 30px;
            }

            span.on {
                color: #fff;
                background-color: rgba(244, 164, 96, 1);
            }
        }
    }
    .logs-content{
        padding: 60px 0 0 0;
    }
    .logsItem {
        padding: 0 10px;

        li:before {
            content: "";
            width: 100%;
            height: 1px;
            background: #eee;
            position: absolute;
            left: 0;
            bottom: 0;
            transform: scale(1, 0.5);
        }

        li {
            display: flex;
            padding: 15px 0;
            align-items: center;
            position: relative;
            cursor: pointer;
            label {
                flex: 1;
                text-align: left;
                margin: 0 10px 0 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                cursor: pointer;
            }

            span {
                font-size: 12px;
            }
        }
    }
}
</style>
