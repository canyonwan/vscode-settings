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
  <swiper circular indicator-dots="circle" :autoplay="true" :duration="300">
    <swiper-item v-for="banner in swiperList" :key="banner.fileId">
      <img :src="banner.fileInfo.fileUrl" />
    </swiper-item>
  </swiper>
</template>

<style scoped></style>
