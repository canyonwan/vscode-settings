<template>
  <div class="tree-select">
    <n-tree-select filterable :options="options" default-value="Drive My Car" clearable />
  </div>
</template>

<script setup lang="ts">
  import { queryGoodsCateTree } from '@/api/goods/goods'

  interface IGoodsCate {
    id: string
    name: string
    children: IGoodsCates[]
  }

  async function getGoodsCateTree() {
    await queryGoodsCateTree()
  }
</script>

<style scoped></style>
