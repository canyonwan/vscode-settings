<script setup lang="ts">
  import { useMapLoader } from './src/composables/useMapLoader'

  const { mapInstance, aMap, mapLoading } = useMapLoader()
</script>
<template>
  <n-spin size="medium" :show="mapLoading">
    <div id="container" class="w-full h-80 mb-5"></div>
  </n-spin>
</template>
