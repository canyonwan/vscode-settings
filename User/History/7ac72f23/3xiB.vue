<template>
  <div class="flex flex-col home">
    <div class="flex-1"></div>
    <swiper
      class="flex-auto w-full my-swiper"
      :modules="modules"
      navigation
      ref="swiperRef"
      effect="coverflow"
      :grabCursor="true"
      :centeredSlides="true"
      slidesPerView="auto"
      :slideToClickedSlide="true"
      :coverflow-effect="{
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: false
      }"
    >
      <swiper-slide v-for="(item, index) in imgs" :key="index" @click="onJumpTo(item.path!)">
        <inner-comp :item="item" @swiper-slide="handleSwiperSlide" />
      </swiper-slide>
      <!-- <div :class="['swiper-button-prev', 'left-10']" @click="onPrev">
        <img src="@/assets/images/home/swiper_button_prev.svg" />
      </div>
      <div class="swiper-button-next" @click="onNext">
        <img src="@/assets/images/home/swiper_button_next.svg" />
      </div> -->
    </swiper>
  </div>
</template>
<script lang="ts" setup>
  import { Ref } from 'vue'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { EffectCoverflow, Navigation } from 'swiper'
  import 'swiper/css/effect-coverflow'
  import 'swiper/css/navigation'
  import 'swiper/css'
  import LvZhiImg from '@/assets/images/home/lvzhi.svg'
  import ZhiFaImg from '@/assets/images/home/zhifa.svg'
  import RenWuImg from '@/assets/images/home/renwu.svg'
  import JianDuImg from '@/assets/images/home/jiandu.svg'
  import ShuJuHuLian from '@/assets/images/home/shujuhulian.svg'
  import { useRouter } from 'vue-router'
  import InnerComp from './inner-comp.vue'

  interface ImgType {
    url: string
    name: string
    path?: string
  }
  const imgs: ImgType[] = [
    {
      url: LvZhiImg,
      name: '履职中心',
      path: '/dashboard/workplace'
    },
    {
      url: ZhiFaImg,
      name: '执法中心',
      path: '/dashboard/workplace'
    },
    {
      url: RenWuImg,
      name: '任务中心',
      path: '/dashboard/workplace'
    },
    {
      url: JianDuImg,
      name: '监督中心',
      path: '/dashboard/workplace'
    },
    {
      url: ShuJuHuLian,
      name: '数据互联',
      path: '/dashboard/workplace'
    }
  ]
  const modules = [EffectCoverflow, Navigation]
  const swiperRef = ref()
  const router = useRouter()
  const swiperSlideRef = ref()

  const handleSwiperSlide = (swiperSlide: Ref) => {
    swiperSlideRef.value = swiperSlide.value
  }

  const onJumpTo = (path: string) => {
    router.push(path)
  }
</script>
<style lang="less" scoped>
  .home {
    height: 100vh;
    background-image: url('../../assets/images/home/home_swiper_bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .my-swiper {
      .swiper-slide {
        width: 25%;
      }
    }
  }

  .swiper-button-prev {
    left: 5%;
  }

  .swiper-button-next {
    right: 5%;
  }

  .swiper-button-next,
  .swiper-button-prev {
    top: 30%;

    img {
      max-width: 5rem;
    }
  }

  .swiper-button-prev::after,
  .swiper-rtl.swiper-button-next::after {
    content: '';
  }

  .swiper-button-next::after,
  .swiper-rtl .swiper-button-prev::after {
    content: '';
  }
</style>
