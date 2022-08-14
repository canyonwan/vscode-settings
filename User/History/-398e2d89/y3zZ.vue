<template>
  <div class="images-wall">
    images-wall
    <!-- <div v-for="item in $route.query.files" :key="item">
      <img :src="item" alt="" />
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ImagesWall',
  setup() {
    const files = sessionStorage.getItem('files')
    const parseFiles = JSON.parse(files!)
    return { parseFiles }
  }
})
</script>
<style lang="less" scoped>
.images-wall {
  background-color: black;
  width: 100%;
  height: 100%;
  color: white;
}
</style>
