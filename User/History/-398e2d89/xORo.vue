<template>
  <div class="images-wall">
    images-wall
    {{ $route.params.files }}
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
    const files = JSON.parse(sessionStorage.getItem('files'))
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
