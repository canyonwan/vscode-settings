<template>
  <view class="container">
    <view
      class="header"
      :style="'padding-top:' + state.navTop + 'px;height:' + state.navHeight + 'px'"
      :class="state.showBg ? 'bg' : 'no-show-bg'"
    >
      <view :style="{ color: state.showBg ? 'white' : 'black' }">
        <view class="header-search" :style="{ display: state.display }">
          <HeaderSearch></HeaderSearch>
        </view>
      </view>
    </view>
    <view class="content">
      <!--搜索 start-->

      <!--搜索 end-->
      <v-swiper />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onPageScroll, onLoad, onShow, onReachBottom } from '@dcloudio/uni-app'
import { ref, getCurrentInstance, reactive } from 'vue'
import HeaderSearch from './components/HeaderSearch.vue'
import VSwiper from './components/v-swiper.vue'
import { IMAGE_URL, APP_NAME } from '@/config/app'

const state = reactive({
  imageUrl: IMAGE_URL,
  showBg: false,
  display: 'block',
  navTop: 0,
  navHeight: 40,
  current: 0,
  mode: 'round',
})

const title = ref(APP_NAME)

const { proxy } = getCurrentInstance() as any
const scroll = function (e) {
  const scrollY = e.scrollTop
  state.showBg = scrollY > 40 ? true : false
  state.display = scrollY > 40 ? 'none' : 'block'
}
console.log('onPageScroll', onPageScroll)
onPageScroll((e) => {
  scroll(e)
})
onReachBottom(() => {
  //   console.log('onReachBottom')
})
onShow(() => {
  console.log('index onShow')
})
onLoad(() => {
  state.navTop = proxy.$StatusBar
  // #ifdef MP-WEIXIN
  state.navHeight = proxy.$CustomBar
  // #endif
})
</script>

<style lang="scss">
@import '@/static/css/variable.scss';
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: $background-color;
  .header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 32rpx;

    &.bg {
      background-color: $top-background-color;
    }

    &.no-show-bg {
      background-color: $background-color;
    }

    .city {
      font-size: 24rpx;
      position: absolute;
      left: 30rpx;
      .icon-map-coordinates {
        color: #fff;
      }
    }
  }
  .content {
    width: 100%;
  }
}
</style>
