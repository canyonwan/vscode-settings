<template>
  <view class="cates">
    <uni-row>
      <uni-col :span="6">
        <scroll-view enable-flex="true" scroll-y class="left-category">
          <view class="left">
            <view v-for="item in leftCates" :key="item.id" class="item">{{ item.name }}</view>
          </view>
        </scroll-view>
      </uni-col>
      <uni-col :span="18">
        <view class="right">右边</view>
      </uni-col>
    </uni-row>
  </view>
</template>
<script setup lang="ts">
import { ref } from 'vue'

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
<style lang="scss" scoped>
.cates {
  .left {
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
