<script setup lang="ts">
import { queryGoodsPageWithCate } from '@/api/goods/goods'
import { IGoodsContent } from '@/api/goods/types'
import type { IPage } from '@/types'
import { onMounted, PropType, reactive, watch } from 'vue'

interface IState {
  goodsList: IGoodsContent[]
  pageParams: IPage
  cateId: string
}

const props = defineProps({
  currentCateId: {
    type: String as PropType<string>,
    default: '',
  },
})

const state = reactive<IState>({
  goodsList: [],
  pageParams: {
    page: 1,
    size: 10,
    total: 0,
  },
  cateId: '',
})

// 获取全部分类
async function getGoodsPageWithCate() {
  console.log('执法了吗')
  const res = await queryGoodsPageWithCate({ goodsTypeId: props.currentCateId })
  state.goodsList = res.contents
  state.pageParams.page = res.page
  state.pageParams.size = res.size
  state.pageParams.total = res.total
}

watch(
  () => props.currentCateId,
  () => {
    state.cateId = props.currentCateId
  }
)
</script>
<template>
  <scroll-view enable-flex="true" scroll-y class="right-goods">
    <view class="right">右边</view>
    <view class="right">右边</view>
    <view class="right">右边</view>
    <view class="right">右边 last</view>
  </scroll-view>
</template>

<style scoped lang="scss">
.right-goods {
  height: 100vh;
  .right {
    height: 300px;
    background-color: blue;
  }
}
</style>
