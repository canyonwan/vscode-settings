<template>
  <div class="tree-select">
    <n-tree-select filterable :options="options" default-value="Drive My Car" clearable />
  </div>
</template>

<script setup lang="ts">
  import { queryGoodsCateTree } from '@/api/goods/goods'
  import { IGoodsCates } from '@/api/goods/types'

  interface IGoodsState {
    goodsCates: IGoodsCates[]
  }

  const state = reactive<IGoodsState>({
    goodsCates: []
  })

  async function getGoodsCateTree() {
    state.goodsCates = await queryGoodsCateTree()
  }
</script>

<style scoped></style>
