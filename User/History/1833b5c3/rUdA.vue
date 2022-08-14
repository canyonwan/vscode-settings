<template>
  <view class="cates">
    <uni-row>
      <uni-col :span="6">
        <left-cates @handleGoodsItem="handleGoodsItem" />
      </uni-col>
      <uni-col :span="18">
        <right-goods-list />
      </uni-col>
    </uni-row>
  </view>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import LeftCates from './components/left-cates.vue'
import RightGoodsList from './components/right-goods-list.vue'

function handleGoodsItem(id: string) {
  //
}
</script>
<style lang="scss" scoped></style>
