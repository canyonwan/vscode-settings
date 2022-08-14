<script setup lang="ts">
import { querySwiperList } from '@/api/banner/banner'
import type { IBannerItem } from '@/api/banner/types'
import { onMounted, ref } from 'vue'
const swiperList = ref<IBannerItem[]>([])

async function getSwiper() {
  let res = await querySwiperList()
  swiperList.value = res
}

onMounted(() => {
  getSwiper()
})
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
