<script setup lang="ts">
  // Import Swiper Vue.js components
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import 'swiper/css'
  import 'swiper/css/free-mode'
  import 'swiper/css/navigation'
  import 'swiper/css/lazy'
  import 'swiper/css/thumbs'
  import { Lazy, FreeMode, Navigation, Thumbs } from 'swiper'
  import type { IFileItem } from '@/api/program/types'

  import { FileTypeEnum } from '@/enums/file-enum'
  import { FileFilled } from '@vicons/antd'

  const props = defineProps<{ files: IFileItem[] }>()

  const thumbsSwiper = ref(null)
  const modules = [Lazy, FreeMode, Navigation, Thumbs]

  const setThumbsSwiper = (swiper: any) => {
    thumbsSwiper.value = swiper
  }

  onMounted(() => {
    console.log('%c [ props.files ]-26', 'font-size:13px; background:#0095FF; color:white;', props.files)
  })
</script>
<template>
  <div class="file-browser">
    <swiper
      :style="{
        '--swiper-navigation-color': '#121C2E',
        '--swiper-pagination-color': '#121C2E'
      }"
      :lazy="true"
      :loop="true"
      :spaceBetween="10"
      :navigation="true"
      :thumbs="{ swiper: thumbsSwiper }"
      :modules="modules"
      class="mySwiper2"
    >
      <swiper-slide v-for="file in files" :key="file.fileId">
        <img v-if="[FileTypeEnum.Picture, FileTypeEnum.Pdf, FileTypeEnum.Word, FileTypeEnum.Video].includes(file.fileType) && file.fileUrl" :src="file.fileUrl" class="w-20 h-20" />
        <div v-else class="w-20 h-20 truncate text-center" style="line-height: 5rem">
          <n-icon class="text-gray-600" :component="FileFilled" size="24" />
        </div>
      </swiper-slide>
    </swiper>

    <!-- 缩略图 -->
    <swiper @swiper="setThumbsSwiper" :spaceBetween="10" :slidesPerView="4" :freeMode="true" :watchSlidesProgress="true" :modules="modules" class="mySwiper">
      <swiper-slide v-for="file in files" :key="file.fileId">
        <img v-if="[FileTypeEnum.Picture, FileTypeEnum.Pdf, FileTypeEnum.Word, FileTypeEnum.Video].includes(file.fileType) && file.thumbnailFileUrl" :src="file.thumbnailFileUrl" class="w-20 h-20" />
        <div v-else class="w-20 h-20 truncate text-center" style="line-height: 5rem">
          <n-icon class="text-gray-600" :component="FileFilled" size="24" />
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>
<style scoped lang="less">
  .swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;

    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }

  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .swiper {
    width: 100%;
    height: 540px;
    margin-left: auto;
    margin-right: auto;
  }

  .mySwiper2 {
    // height: 60%;
    width: 100%;
  }

  .mySwiper {
    height: 140px;
    box-sizing: border-box;
    padding: 10px 0;
  }

  .mySwiper .swiper-slide {
    width: 25%;
    height: 100%;
    opacity: 0.4;
  }

  .mySwiper .swiper-slide-thumb-active {
    opacity: 1;
  }

  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
