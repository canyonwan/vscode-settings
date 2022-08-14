<template>
  <div class="images-wall">
    <div v-for="item in parseFiles" :key="item" class="item">
      <img :src="item" alt="" width="200" />
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
  width: 100%;
  height: 100%;
  color: white;
  .item {
    // width: 400px;
    margin: 0 auto;
    // display: flex;
    // flex-direction: column;
  }
}
</style>
