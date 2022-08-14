<template>
  <div class="images-wall">
    <div v-for="item in images" :key="item">
      <img :src="item" alt="" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs } from 'vue'

export default defineComponent({
  name: 'ImagesWall',
  props: {
    images: {
      type: Array as PropType<string[]>,
      default: () => []
    }
  }
})
</script>
<style lang="less" scoped>
.images-wall {
  width: 100%;
}
</style>
