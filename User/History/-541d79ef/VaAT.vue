<template>
  <view class="container">
    <view
      class="header"
      :style="'padding-top:' + state.navTop + 'px;height:' + state.navHeight + 'px'"
      :class="state.showBg ? 'bg' : 'no-show-bg'"
    >
      <text :style="{ color: state.showBg ? 'white' : 'black' }">{{ title }}</text>
    </view>
    <view class="content">
      <!--轮播图 start-->
      <!-- <ad-swiper :img-urls="indexBanner"></ad-swiper> -->
      <swiper class="swiper-box">
        <swiper-item v-for="(item, index) in state.info" :key="index">
          <view class="swiper-item">
            {{ item.content }}
          </view>
        </swiper-item>
      </swiper>
      <!--轮播图 end-->
      <!--搜索 start-->
      <view class="header-search" :style="{ display: state.display }">
        <HeaderSearch></HeaderSearch>
      </view>
      <!--搜索 end-->

      <!--消息 start-->
      <MessageComp v-if="isShowMessage" @closeMessage="closeMessage"> </MessageComp>
      <!--消息 end-->

      <view style="padding: 0 20rpx 20rpx 20rpx"><MenusTwo /></view>
      <!--精选课程 start-->
      <RecommendGoods />
      <EventReservation />
      <!--专家答疑 start-->
      <QuestionsAndAnswers />
      <!--专家答疑 end-->
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onPageScroll, onLoad, onShow, onReachBottom } from '@dcloudio/uni-app'
import { ref, getCurrentInstance, reactive, computed, defineComponent } from 'vue'
import { AppActionTypes } from '@/store/modules/app/action-types'
import { useStore, mapActions } from 'vuex'
import { BannerActionTypes } from '@/store/modules/banner/action-types'
import { useMapState } from '@/hooks/useMapState'
import AdSwiper from '@/components/ad-swiper/index.vue'
import HeaderSearch from './components/HeaderSearch.vue'
import MessageComp from './components/MessageComp.vue'
import MenusComp from './components/MenusComp.vue'
import MenusTwo from './components/MenusTwo.vue'
import RecommendGoods from './components/RecommendGoods.vue'
import EventReservation from './components/EventReservation.vue'
import QuestionsAndAnswers from './components/QuestionsAndAnswers.vue'
import { IMAGE_URL, APP_NAME } from '@/config/app'

const state = reactive({
  imageUrl: IMAGE_URL,
  showBg: false,
  display: 'block',
  navTop: 0,
  navHeight: 40,
  info: [
    {
      content: '内容 A',
    },
    {
      content: '内容 B',
    },
    {
      content: '内容 C',
    },
  ],
  current: 0,
  mode: 'round',
})

const title = ref(APP_NAME)

let isShowMessage = ref(true)
const closeMessage = () => {
  isShowMessage.value = false
}

const store = useStore()

const fetchBanner = mapActions(['banner', BannerActionTypes.ACTION_GET_BANNER]).ACTION_GET_BANNER.bind({
  $store: store,
})
fetchBanner()

const indexBanner = computed(() => store.state.banner.indexBanner)

const setToken = () => {
  store.dispatch(AppActionTypes.ACTION_LOGIN, 'token')
  title.value = store.state.app.token
}
const { proxy } = getCurrentInstance() as any
// console.log('ctx', proxy, proxy.$StatusBar, proxy.$test)
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
