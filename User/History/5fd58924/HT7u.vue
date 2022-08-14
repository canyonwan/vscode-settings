<template>
  <div class="tree-select">
    <n-tree-select filterable :options="goodsCates" key-field="id" label-field="name" children-field="childrenList" clearable />
  </div>
</template>

<script setup lang="ts">
  import { queryGoodsCateTree } from '@/api/goods/goods'
  import type { TreeSelectOption } from 'naive-ui'

  interface IGoodsState {
    goodsCates: any[]
  }

  const state = reactive<IGoodsState>({
    goodsCates: []
  })

  async function getGoodsCateTree() {
    const cates = await queryGoodsCateTree()
    state.goodsCates = cates
  }
  onMounted(() => {
    getGoodsCateTree()
  })
</script>

<style scoped></style>
