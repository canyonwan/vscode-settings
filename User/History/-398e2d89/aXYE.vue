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
  background-color: black;
  height: 100%;
  margin: 0 auto;
  .item {
    max-width: 900px;
    overflow-y: auto;
    img {
      width: 100%;
      padding-top: 10px;
    }
  }
}
</style>
