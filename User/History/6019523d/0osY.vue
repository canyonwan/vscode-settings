<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import Other from './other.vue'
import Matters from './matters.vue'

export default defineComponent({
  components: { Other, Matters },
  setup() {
    const route = useRoute()
    return {
      route
    }
  }
})
</script>
<template>
  <div class="detail-index">
    <div class="title-box">
      <div class="title">详情信息</div>
      <div class="light-line"></div>
    </div>
    <template v-if="route.params.type === '0'">
      <matters />
    </template>
    <template v-else>
      <other />
    </template>
  </div>
</template>
<style lang="less" scoped>
.detail-index {
  width: 100%;
  .title-box {
    display: flex;
    flex: 1;
    margin-bottom: 30px;
    .title {
      width: 100px;
      font-size: 20px;
      text-align: left;
      padding: 10px 0;
      border-bottom: 3px solid #3888cf;
    }
    .light-line {
      width: 100%;
      border-bottom: 2px solid #cae4fb;
    }
  }
}
</style>
