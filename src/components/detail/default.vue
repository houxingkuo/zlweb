<template>
  <van-empty image="search" description="未找到游戏详情页" />
</template>

<script>
import Vue from 'vue'
import { Empty } from 'vant'

Vue.use(Empty)
export default {
  data () {
    return {
      name: '未找到游戏详情页'
    }
  }
}
</script>
