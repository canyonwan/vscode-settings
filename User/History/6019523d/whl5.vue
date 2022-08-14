<script setup lang="ts">
import { useRoute } from 'vue-router'
import Fine from './fine.vue'
import Other from './other.vue'
import Matters from './matters.vue'

const route = useRoute()
</script>
<template>
  <div class="detail-index">
    <div class="title-box">
      <div class="title">详情信息</div>
    </div>
    <template v-if="route.params.type === '0'">
      <matters />
    </template>
    <template v-else-if="route.params.type === '1'">
      <fine />
    </template>
    <template v-else>
      <Other />
    </template>
  </div>
</template>
<style lang="less" scoped>
.detail-index {
  .title-box {
    max-width: 1200px;
    border-bottom: 3px solid #3888cf;
    .title {
      width: 100px;
      font-size: 20px;
      text-align: left;
      padding: 10px 0;
      margin-bottom: 18px;
      border-bottom: 3px solid #3888cf;
    }
  }
}
</style>
