<template>
  <div class="tree-select">
    <n-tree-select filterable :options="state.goodsCates" key-field="id" label-field="name" children-field="childrenList" clearable />
  </div>
</template>

<script setup lang="ts">
  import { queryGoodsCateTree } from '@/api/goods/goods'

  const state = reactive({
    goodsCates: [] as any[]
  })

  async function getGoodsCateTree() {
    const cates = await queryGoodsCateTree()
    state.goodsCates = cates
  }
  onMounted(() => {
    getGoodsCateTree()
  })
</script>
