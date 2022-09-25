<template>
    <div id="zlhy-app-home" ref="zlhyAppHome">
        <div class="zlhy-top-warp">
            <!-- 搜索框 -->
            <div class="search-warp">
                <van-search
                v-model="searchname"
                show-action
                shape="round"
                placeholder="请输入游戏名称"
                @search="onSearch"
                class="inputSearch"
                >
                    <template #action>
                        <div @click="onSearch">搜索</div>
                    </template>
                </van-search>
            </div>
            <div class="swipe-box" v-if="pageData.banner !== undefined && pageData.banner.length > 0">
                <swiper ref="zlhy_swipe" :options="swiperOption" class="zlhy-swiper">
                    <swiper-slide v-for="(item, index) in pageData.banner" :key="index">
                        <img :data-src="item.img" class="swiper-lazy" width="100%" height="100%" @click="playgame(item.url)">
                    </swiper-slide>
                    <div class="swiper-pagination" slot="pagination"></div>
                </swiper>
            </div>
        </div>
        <div class="played-game" v-if="pageData.played_game !== undefined && pageData.played_game.length > 0">
            <van-divider>最近玩过</van-divider>
            <div class="touchBox">
                <ul :style="{'width': `${pageData.played_game.length*100/37.5}rem`}">
                    <li v-for="(item, index) in pageData.played_game" :key="index" @click="playgame(item.id)">
                        <img :src="item.icon" :alt="item.name" width="100%" />
                        <p class="name">{{ item.name }}</p>
                        <span class="btns">开始游戏</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="newupGame">
            <ul class="gameItem" v-if="JSON.stringify(gameShelvesData) != '{}'">
                <li v-for="(item, index) in gameShelvesData.data.list" :key="index">
                    <div class="gamePic" @click="gamesdetails(item.id)">
                        <img v-lazy="item.icon" :alt="item.name">
                    </div>
                    <div class="gameInfo" @click="gamesdetails(item.id)">
                        <div class="title">
                            <label class="name">{{ item.name }}</label>
                            <van-tag v-for="(tags, ix) in item.label" :key="ix" :color="tags.color" type="primary">{{ tags.name }}</van-tag>
                        </div>
                        <p class="desc">{{ item.publicity }}</p>
                    </div>
                    <a href="javascript:void(0);" target="_self" class="playGameBtn" @click="playgame(item.id)">开玩</a>
                </li>
            </ul>
        </div>
        <bind-footer />
    </div>
</template>

<script>
import Vue from 'vue';
import { Lazyload, Tab, Tabs, Tag, List, Search, Divider } from 'vant';

Vue.use(Lazyload);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Tag);
Vue.use(List);
Vue.use(Search);
Vue.use(Divider);
export default {
    name: 'home',
    data() {
        return {
            searchname: '',
            pageData: {},
            gameShelvesData: {},
            gameServiceData: {
                npi: 1,
                ids: '',
                data:[]
            },
            swiperOption: {
                effect: "coverflow",
                grabCursor: !0,
                centeredSlides: !0,
                slidesPerView: "auto",
                loop: !0,
                coverflow: {
                    rotate: 45,
                    stretch: 0,
                    depth: 145,
                    modifier: 1,
                    slideShadows: !0
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false
                },
                lazy: {
                    loadPrevNext: true,
                },
                on: {
                    resize: (e) => {
                        setTimeout(() => {
                            this.$refs.zlhy_swipe.update()
                        }, 300)
                    }
                }
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
            handler(newData, oldDAta) {
                this.postHomeData();
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        onSearch () {
            this.$router.push({
                path: '/gift',
                query: {name: this.searchname}
            })
        },
        // 前往游戏详情页
        gamesdetails (id) {
            this.$router.push(`/detail/${id}`)
        },
        // 开玩
        playgame (id) {
            this.$router.push(`/game/${id}`);
        },
        // 轮播和热门游戏
        postHomeData () {
            this.$api.article.home({
                uid: this.getUserInformation.uid
            }).then(res=> {
                this.pageData = res.data.data;
            }).catch(err => {
                console.log(err)
            })
        },
        // 最新上架
        getShelvesData () {
            this.$api.article.gameShelves({
                page: 1
            }).then(res=> {
                this.gameShelvesData = res.data;
            }).catch(err => {
                console.log(err)
            })
        },
    },
    created() {
        this.getShelvesData();
    },
    mounted() {}
}

</script>

<style lang="less" scoped>
#zlhy-app-home {
    overflow: hidden;
    /deep/.van-tabs__line{background-color: #f4a460 !important;}
    /deep/.van-divider{font-size: 16px;color: #333;}
    .zlhy-top-warp {
        width: 100%;
        height: 200px;
        position: relative;
        .search-warp {
            /deep/.van-search__action{
                background-color: #60a9f4;
                color: #fff;
                border: 0;
                border-radius: 8px;
                margin: 0 0 0 5px;
            }
            /deep/.van-search--show-action, /deep/.van-search{
                padding: 10px;
            }
        }
        /deep/.swiper-pagination{
            display: none;
        }
        .swipe-box {
            width: 100%;
            height: 150px;
            overflow: hidden;
            /deep/.zlhy-swiper {
                .swiper-slide {
                    background-position: center;
                    background-size: cover;
                    width: 88%;
                    height: 130px;
                    border-radius: 4px;
                    display: block;
                    box-shadow: none;
                    background-color: #dedede;
                    margin: 0 -10px;
                    overflow: hidden;
                }
            }
        }
  }
  .played-game{
    width: 100%;
    background: #fff;
    padding: 0 10px;
    overflow: hidden;
    /deep/.van-divider{margin: 0;}
    .touchBox{
      padding: 13px 0;
      overflow-y: hidden;
      overflow-x: auto;
      ul{
        overflow: hidden;
        li{
          float: left;
          width: 90px;
          border: 1px solid #dedede;
          margin: 0 10px 0 0;
          padding: 5px 0;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
          img{
            width: 60px;
            height: 60px;
            margin: 0 auto;
            border-radius: 15px;
          }
          .name{
            display: block;
            margin: 0 5px;
            font-size: 10px;
            color: #333;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .btns{
            font-size: 10px;
            margin: 0 10px;
            color: #fff;
            display: block;
            border-radius: 4px;
            line-height: 20px;
            background-color: #30c1fd;
          }
        }
      }
    }
  }
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
      .gamePic {
        width: 60px;
        height: 60px;
        border-radius: 10px;
        overflow: hidden;
        img {
          width: 60px;
        }
      }

      .gameInfo {
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
}
/deep/.van-swipe {
    height: 140px;
    border-radius: 8px;
}
/deep/.van-tag {
    margin: 0 3px 0 0;
}
</style>
