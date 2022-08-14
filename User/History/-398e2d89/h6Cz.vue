<template>
  <div class="images-wall">
    <div v-for="item in parseFiles" :key="item" class="item">
      <img :src="item" alt="" />
    </div>
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
  height: 100%;
  .item {
    max-width: 900px;
    margin: 0 auto;
    img {
      width: 100%;
      padding-top: 10px;
    }
  }
}
</style>
