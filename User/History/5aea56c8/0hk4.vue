<script setup lang="ts">
import { reactive } from 'vue'

const leftCates = [
  {
    id: 1,
    name: '热销商品',
  },
  {
    id: 2,
    name: '新品上架',
  },
  {
    id: 3,
    name: '精品推荐',
  },
  {
    id: 4,
    name: '热门分类',
  },
  {
    id: 5,
    name: '驱虫药',
  },
  {
    id: 6,
    name: '保健药',
  },
  {
    id: 1,
    name: '热销商品',
  },
  {
    id: 2,
    name: '新品上架',
  },
  {
    id: 3,
    name: '精品推荐',
  },
  {
    id: 4,
    name: '热门分类',
  },
  {
    id: 5,
    name: '驱虫药',
  },
  {
    id: 6,
    name: '保健药',
  },
  {
    id: 1,
    name: '热销商品',
  },
  {
    id: 2,
    name: '新品上架',
  },
  {
    id: 3,
    name: '精品推荐',
  },
  {
    id: 4,
    name: '热门分类',
  },
  {
    id: 5,
    name: '驱虫药',
  },
  {
    id: 6,
    name: '保健药',
  },
]

const state = reactive({
  currentItem: 0,
})

function onClickItem(id: number) {
  //
  state.currentItem = id
}
</script>
<template>
  <scroll-view enable-flex="true" scroll-y class="left">
    <view
      v-for="item in leftCates"
      :key="item.id"
      class="item"
      :class="{ selected: state.currentItem === item.id }"
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
    &.selected {
      content: '';
      border: 1px solid red;
      width: 0;
      height: 0;
    }
  }
}
</style>
