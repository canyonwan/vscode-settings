<template>
  <div class="tree-select">
    <n-tree-select filterable :options="goodsCates" clearable />
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
    const cates = await queryGoodsCateTree()
    cates.map((item) => {
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
