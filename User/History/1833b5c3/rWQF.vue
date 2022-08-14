<template>
  <view class="cates">
    <uni-row>
      <uni-col :span="6">
        <left-cates @handleGoodsItem="handleGoodsItem" />
      </uni-col>
      <uni-col :span="18">
        <right-goods-list ref="rightRef" :current-cate-id="currentCateId" />
      </uni-col>
    </uni-row>
  </view>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import LeftCates from './components/left-cates.vue'
import RightGoodsList from './components/right-goods-list.vue'

const currentCateId = ref<string>('')
const rightRef = ref<any>()

function handleGoodsItem(id: string) {
  currentCateId.value = id
  rightRef.value.getGoodsCates()
}
</script>
