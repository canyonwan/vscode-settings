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
    alert(sessionStorage.getItem('files'))
    const files = sessionStorage.getItem('files')
    const parseFiles = JSON.parse(files!)
    console.log('%c [ files ]-19', 'font-size:13px; background:#0095FF; color:white;', parseFiles)
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
