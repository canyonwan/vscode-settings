<template>
  <div class="images-wall">
    images-wall
    <!-- <div v-for="item in $route.query.files" :key="item">
      <img :src="item" alt="" />
    </div> -->
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
    console.log('%c [ route ]-24', 'font-size:13px; background:#0095FF; color:white;', route.query.files)
  }
})
</script>
<style lang="less" scoped>
.images-wall {
  background-color: black;
  width: 100%;
  height: 100%;
}
</style>
