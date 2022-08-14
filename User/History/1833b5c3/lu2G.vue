<template>
  <view class="cates">
    <uni-row>
      <uni-col :span="6">
        <left-cates @handleGoodsItem="handleGoodsItem" />
      </uni-col>
      <uni-col :span="18" :class="bindClass">
        <right-goods-list :current-cate-id="currentCateId" />
      </uni-col>
    </uni-row>
  </view>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import LeftCates from './components/left-cates.vue'
import RightGoodsList from './components/right-goods-list.vue'

const bindClass = ['m-1', 'border-solid', 'border-gray-200', 'border-b']

const currentCateId = ref<string>('')

function handleGoodsItem(id: string) {
  currentCateId.value = id
  console.log('current id', currentCateId.value)
}
</script>
<style lang="scss">
.parent {
  .a {
  }
  .b {
  }
}
</style>
