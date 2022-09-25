<template>
  <van-empty image="search" description="未找到游戏" />
</template>

<script>
import Vue from 'vue'
import { Empty } from 'vant'

Vue.use(Empty)
export default {
  data () {
    return {
      name: '未找到游戏'
    }
  }
}
</script>
