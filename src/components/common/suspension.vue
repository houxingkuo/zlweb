<template>
  <div class="customer">
    <!-- 悬浮div -->
    <!-- <div
      id="moveDiv"
      ref="movediv"
      class="xuanfu"
      @mousedown="down"
      @touchstart="down"
      @mousemove="move"
      @touchmove="move"
      @mouseup="pcEnd"
      @touchend="end"
    > -->
    <div
      id="moveDiv"
      ref="movediv"
      class="xuanfu"
      @touchstart="down"
      @touchmove="move"
      @touchend="end"
    >
      <div
        :style="menu_style"
        class="menu"
        @click="showMenu()"
      />
    </div>
  </div>
</template>
<script>
import { isSysName, getBrowserInfo } from '@/utils/component'
export default {
  data() {
    return {
      menu_style: `background-image: url('${require('@/assets/images/favicon.png')}')`,
      flags: false,
      position: {
        x: 0,
        y: 0
      },
      nx: '',
      ny: '',
      dx: '',
      dy: '',
      xPum: '',
      yPum: '',
      closeStatus: false,
      setTime: {},
      setTimes: {},
      menuStyle: '',
      menuHeight: undefined,
      timed: undefined
    }
  },
  computed: {
    getgameinfopage () {
        return this.$store.getters.getgameinfopage;
    }
  },
  watch: {
    getgameinfopage: {
        handler(newData, oldDAta) {
          if(!newData && oldDAta != undefined) this.closeActivity()
        },
        immediate: true,
        deep: true
    }
  },
  mounted() {
    var WH = window.innerHeight / 2
    this.$refs.movediv.style.top = WH + WH / 2 + 'px'
    this.autoMove(true) // 三秒自动靠边
    window.addEventListener('resize', this.susOnSize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.susOnSize)
  },
  methods: {
    susOnSize() {
      clearTimeout(this.timed)
      this.timed = setTimeout(() => {
        this.autoMove(true)
      }, 1000)
    },
    getmenu(val) {
      this.menuHeight = val
      this.menuStyle = this.around()
    },
    isSysName,
    // 实现移动端拖拽
    down() {
      this.flags = true
      var touch
      if (event.touches) {
        touch = event.touches[0]
      } else {
        touch = event
      }
      this.position.x = touch.clientX
      this.position.y = touch.clientY
      this.dx = this.$refs.movediv.offsetLeft
      this.dy = this.$refs.movediv.offsetTop
    },
    move() {
      window.clearTimeout(this.setTime)
      this.$refs.movediv.style.transition = ''
      if (this.flags) {
        this.$refs.movediv.style.opacity = 1
        var touch
        if (event.touches) {
          touch = event.touches[0]
        } else {
          touch = event
        }
        this.nx = touch.clientX - this.position.x
        this.ny = touch.clientY - this.position.y
        this.xPum = this.dx + this.nx
        this.yPum = this.dy + this.ny
        if (this.xPum < 0) {
          this.xPum = 0
        } else if (this.xPum > window.innerWidth - this.$refs.movediv.offsetWidth) {
          this.xPum = window.innerWidth - this.$refs.movediv.offsetWidth
        }
        if (this.yPum < 0) {
          this.yPum = 0
        } else if (this.yPum > window.innerHeight - this.$refs.movediv.offsetHeight) {
          this.yPum = window.innerHeight - this.$refs.movediv.offsetHeight
        }
        this.$refs.movediv.style.left = this.xPum + 'px'
        this.$refs.movediv.style.top = this.yPum + 'px'
        // this.$store.commit('mobile/HELPER_POP', false)
        // 阻止页面的滑动默认事件
        this.addEvent()
      }
    },
    // 鼠标释放时候的函数
    end() {
      this.flags = false
      var moveX = this.$refs.movediv.offsetLeft
      var moveY = this.$refs.movediv.offsetTop
      if (moveX === this.dx && moveY === this.dy) {
        // 判断是否是click
        // this.showMenu()
      } else {
        this.autoMove(true) // 三秒自动靠边
      }
      // 解除阻止页面的滑动默认事件
      this.removeEvent()
    },
    pcEnd() { // pc释放鼠标后
      if (isSysName() === 'ios' || isSysName() === 'android') return
      this.flags = false
      var moveX = this.$refs.movediv.offsetLeft
      var moveY = this.$refs.movediv.offsetTop
      if (moveX === this.dx && moveY === this.dy) {
        // 判断是否是click
        // this.showMenu()
      } else {
        this.autoMove(true) // 三秒自动靠边
      }
      // 解除阻止页面的滑动默认事件
      this.removeEvent()
    },
    showMenu() { // 展开
      if (this.$refs.movediv.offsetLeft < 0) {
        this.$refs.movediv.style.left = '0px'
      } else if (this.$refs.movediv.offsetLeft > window.innerWidth - this.$refs.movediv.offsetWidth) {
        this.$refs.movediv.style.left = window.innerWidth - this.$refs.movediv.offsetWidth + 'px'
      }
      this.$store.commit('setgameinfopage', true)
      // this.$store.commit('mobile/MASK_VIEW', true)
      // this.$store.commit('mobile/H5_PERSONAL_VIEW', true)
      // this.autoMove(true) // 移除三秒自动靠边
      this.autoMoveStatus()
      // }
    },
    around() { // 菜单在球形左边展开或者右边展开
      const DX = this.$refs.movediv.offsetLeft
      const WW = window.innerWidth / 2
      const WH = window.innerHeight
      const DW = this.$refs.movediv.offsetWidth
      const DY = this.$refs.movediv.offsetTop
      let style = ''
      if (WH - DY < this.menuHeight) {
        style = `top:-${this.menuHeight - (WH - DY)}px;`
      } else {
        style = 'top:0;'
      }
      if ((DX + (DW / 2)) < WW) {
        return `${style}left:${80 / 32.2325}rem`
      } else {
        return `${style}right:${80 / 32.2325}rem`
      }
    },
    closeActivity() { // 关闭菜单显示悬浮球 父组件调用此方法
      this.autoMove(true) // 三秒自动靠边
    },
    autoMoveStatus() { // 展开菜单隐藏悬浮球 父组件调用此方法
      window.clearTimeout(this.setTime)
      window.clearTimeout(this.setTimes)
      this.autoMove(false) // 移除三秒自动靠边
    },
    addEvent() { // 添加阻止浏览器滑动事件
      // prettier-ignore
      var getBrowserInfos = getBrowserInfo().split('.')[0]
      if (getBrowserInfos) {
        var browserName = getBrowserInfos.split('/')[0]
        var browserVersion = getBrowserInfos.split('/')[1]
        if ((browserName === 'chrome' && browserVersion >= 51) || (browserName === 'firefox' && browserVersion >= 49) ||
          browserName === 'safari' || browserName === 'applewebkit') {
          document.addEventListener('touchmove', this.preventDefault, {
            passive: false
          })
        } else {
          document.addEventListener('touchmove', this.preventDefault, false)
        }
      } else {
        document.addEventListener('touchmove', this.preventDefault, false)
      }
    },
    removeEvent() { // 移除阻止浏览器滑动事件
      // prettier-ignore
      var getBrowserInfos = getBrowserInfo().split('.')[0]
      if (getBrowserInfos) {
        var browserName = getBrowserInfos.split('/')[0]
        var browserVersion = getBrowserInfos.split('/')[1]
        if ((browserName === 'chrome' && browserVersion >= 51) || (browserName === 'firefox' && browserVersion >= 49)) {
          document.removeEventListener('touchmove', this.preventDefault, {
            passive: false
          })
        } else {
          document.removeEventListener('touchmove', this.preventDefault, false)
        }
      } else {
        document.removeEventListener('touchmove', this.preventDefault, false)
      }
    },
    autoMove(status) {
      const self = this
      if (status) {
        this.$refs.movediv.style.opacity = 1
        if (this.setTime) window.clearTimeout(self.setTime)
        this.setTime = window.setTimeout(function() {
          try {
            const DX = self.$refs.movediv.offsetLeft
            // const DY = self.$refs.movediv.offsetTop
            const WW = window.innerWidth / 2
            // const WH = window.innerHeight / 2
            const DW = self.$refs.movediv.offsetWidth
            if (DX < WW) { // 左
              self.moveDivLeft(DW)
            } else { // 右
              self.moveDivRight(DW)
            }
            // if (DX < WW && DY < WH - DW / 2) { // 左上
            //   self.moveDivLeft(DW)
            //   self.$refs.movediv.style.top = WH / 6 + 'px'
            // } else if (DX <= WW && DY >= WH - DW / 2) { // 左下
            //   self.moveDivLeft(DW)
            //   self.$refs.movediv.style.top = WH + WH / 2 + 'px'
            // } else if (DX > WW && DY < WH - DW / 2) { // 右上
            //   self.moveDivRight(DW)
            //   self.$refs.movediv.style.top = WH / 6 + 'px'
            // } else { // 右下
            //   self.moveDivRight(DW)
            //   self.$refs.movediv.style.top = WH + WH / 2 + 'px'
            // }
          } catch (error) {
            console.log(error)
          }
        }, 0)
      } else {
        this.$refs.movediv.style.opacity = 0
        window.clearTimeout(self.setTime)
      }
      this.$refs.movediv.style.transition = 'all 0.5s'
    },
    moveDivLeft(DW) { // 左边停靠
      this.$refs.movediv.style.transition = 'all 0.5s'
      this.$refs.movediv.style.left = 0
      const styleData = -DW / 2 + 'px'
      this.setTimeObj(DW, styleData)
    },
    moveDivRight(DW) { // 右边停靠
      this.$refs.movediv.style.transition = 'all 0.5s'
      this.$refs.movediv.style.left = window.innerWidth - DW + 'px'
      const styleData = window.innerWidth - DW / 2 + 'px'
      this.setTimeObj(DW, styleData)
    },
    setTimeObj(DW, styleData) {
      if (this.setTimes) window.clearTimeout(this.setTimes)
      this.setTimes = window.setTimeout(() => {
        if (!this.$refs.movediv) return false // 如元素未找到则停止往下执行
        this.$refs.movediv.style.left = styleData
        this.$refs.movediv.style.opacity = 0.5
      }, 2500)
    },
    preventDefault(e) { // 阻止浏览器滑动事件
      e.preventDefault()
    }
  }
}
</script>

<style lang="less" scoped>
.customer {
  overflow: visible;

  .xuanfu {
    overflow: visible;
    height: 1.2rem;
    width: 1.2rem;
    z-index: 2;
    position: fixed;
    bottom: 0.9rem;
    right: 0;

    .menu {
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-size: 100%;
    }
  }
}
</style>
