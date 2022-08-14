<script setup lang="ts">
import { useRoute } from 'vue-router'
import Fine from './fine.vue'
import Other from './other.vue'
import Matters from './matters.vue'

const route = useRoute()
</script>
<template>
  <div class="detail-index">
    <div>详情信息</div>
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
  font-size: 24px;
  text-align: left;
}
</style>
