<template>
  <view class="cates">
    <uni-row>
      <uni-col :span="6">
        <left-cates @handleGoodsItem="handleGoodsItem" />
      </uni-col>
      <uni-col :span="18">
        <right-goods-list :current-cate-id="currentCateId" />
      </uni-col>
    </uni-row>
  </view>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import LeftCates from './components/left-cates.vue'
import RightGoodsList from './components/right-goods-list.vue'

const currentCateId = ref<string>('')

function handleGoodsItem(id: string) {
  //
  console.log('object', id)
  currentCateId.value = id
}
</script>
<style lang="scss" scoped></style>
