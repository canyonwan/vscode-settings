<script setup lang="ts">
import { queryGoodsCates } from '@/api/goods/goods'
import type { IGoodsCateItem } from '@/api/goods/types'
import { onMounted, reactive } from 'vue'

interface IState {
  cates: IGoodsCateItem[]
  currentItem: IGoodsCateItem
}
const state = reactive({
  cates: [],
  currentItem: {},
})

function onClickItem(id: number) {
  //
  state.currentItem = id
}

// 获取全部分类
async function getGoodsCates() {
  await queryGoodsCates()
}

onMounted(() => {
  getGoodsCates()
})
</script>
<template>
  <scroll-view enable-flex="true" scroll-y class="left">
    <view
      v-for="item in leftCates"
      :key="item.id"
      class="item"
      :class="{ active: state.currentItem === item.id }"
      @click="onClickItem(item.id)"
      >{{ item.name }}</view
    >
  </scroll-view>
</template>

<style scoped lang="scss">
.left {
  height: 100vh;
  background-color: #f7f8fa;
  .item {
    padding: 20upx;
    font-size: 28upx;
    line-height: 36upx;
    text-align: center;
    color: #000;
    // margin-bottom: 10px;
    &.active {
      background-color: #fff;
      color: #000;
      border-left: 3px solid red;
    }
  }
}
</style>
