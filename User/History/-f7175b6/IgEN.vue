<template>
  <div class="name">name</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: 'name',
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
.name {
  width: 100%;
}
</style>
