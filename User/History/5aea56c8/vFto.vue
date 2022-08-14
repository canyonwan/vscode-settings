<script setup lang="ts">
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
</script>
<template>
  <scroll-view enable-flex="true" scroll-y class="left-category">
    <view class="left">
      <view v-for="item in leftCates" :key="item.id" class="item">{{ item.name }}</view>
    </view>
  </scroll-view>
</template>

<style scoped></style>
