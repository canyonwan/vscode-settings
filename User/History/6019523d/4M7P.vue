<template>
  <div class="Detail">Detail</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: 'Detail',
  props: {
    orgId: {
      type: String,
      default: ''
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
.Detail {
  width: 100%;
}
</style>
