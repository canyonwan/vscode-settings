<script setup lang="ts">
  import { useMapLoader } from './src/composables/useMapLoader'

  const { mapInstance, aMap } = useMapLoader()
</script>
<template>
  <div id="container" class="w-full h-80 mb-5" v-loading="isShowLoading"></div>
</template>
