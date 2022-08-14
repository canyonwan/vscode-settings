<template>
  <div class="images-wall">images-wall</div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs } from 'vue'

export default defineComponent({
  name: 'ImagesWall',
  props: {
    images: {
      type: Array as PropType<string>,
      default: () => []
    }
  },
  setup() {
    const state = reactive({})
    return {
      ...toRefs(state)
    }
  }
})
</script>
<style lang="less" scoped>
.images-wall {
  width: 100%;
}
</style>
