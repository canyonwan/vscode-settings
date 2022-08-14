<script setup lang="ts">
import { querySwiperList } from '@/api/banner/banner'
import { ref } from 'vue'
const swiperList = ref([])

async function getSwiper() {
  await querySwiperList()
}
</script>

<template>
  <view>
    <swiper circular indicator-dots="circle" :autoplay="true" :duration="300">
      <swiper-item>
        <view class="swiper-item uni-bg-red">A</view>
      </swiper-item>
    </swiper>
  </view>
</template>

<style scoped></style>
