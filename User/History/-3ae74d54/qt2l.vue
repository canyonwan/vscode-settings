<script setup lang="ts">
  import { setupMap } from '@/utils/amap'

  const { mapInstance, aMap } = setupMap()
</script>
<template>
  <div id="container" class="w-full h-80 mb-5"></div>
</template>
