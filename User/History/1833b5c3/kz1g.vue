<template>
  <view class="cates">
    <uni-row>
      <uni-col :span="6"> </uni-col>
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
</script>
<style lang="scss" scoped>
.cates {
  .left {
    height: 100vh;
    background-color: #f7f8fa;
    .item {
      padding: 20upx;
      font-size: 28upx;
      line-height: 36upx;
      text-align: center;
      &:before {
        content: '';
        border: 1px solid red;
        width: 0;
        height: 0;
      }
    }
  }
  .right {
    height: 100vh;
    background-color: purple;
  }
}
</style>
