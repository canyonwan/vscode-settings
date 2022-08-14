<template>
  <div class="tree-select">
    <n-tree-select filterable :options="goodsCates" clearable />
  </div>
</template>

<script setup lang="ts">
  import { queryGoodsCateTree } from '@/api/goods/goods'
  import { TreeSelectOption } from 'naive-ui'

  interface IGoodsState {
    goodsCates: TreeSelectOption[]
  }

  const state = reactive<IGoodsState>({
    goodsCates: []
  })

  async function getGoodsCateTree() {
    const cates = await queryGoodsCateTree()
    state.goodsCates = cates.map((item) => {
      return {
        label: item.name,
        value: item.id
      }
    })
  }
  onMounted(() => {
    getGoodsCateTree()
  })
</script>

<style scoped></style>
