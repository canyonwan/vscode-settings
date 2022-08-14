<template>
  <div class="images-wall">
    <div v-for="item in $route.query.files" :key="item">
      <img :src="item" alt="" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'ImagesWall',
  props: {
    images: {
      type: Array as PropType<string[]>,
      default: () => []
    }
  },
  setup() {
    const route = useRoute()
  }
})
</script>
<style lang="less" scoped>
.images-wall {
  width: 100%;
}
</style>
