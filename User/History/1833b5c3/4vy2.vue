<template>
  <view class="cates">
    <uni-row>
      <uni-col :span="6">
        <left-cates />
      </uni-col>
      <uni-col :span="18">
        <scroll-view enable-flex="true" scroll-y class="left-category">
          <view class="right">右边</view>
        </scroll-view>
      </uni-col>
    </uni-row>
  </view>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import LeftCates from './components/left-cates.vue'
</script>
<style lang="scss" scoped>
.cates {
  .right {
    height: 100vh;
    background-color: purple;
  }
}
</style>
