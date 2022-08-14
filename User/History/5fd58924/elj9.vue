<template>
  <div class="tree-select">
    <n-tree-select v-model:value="selectId" filterable :options="state.goodsCates" key-field="id" label-field="name" children-field="childrenList" clearable @update:value="onUpdateValue" />
  </div>
</template>

<script setup lang="ts">
  import { queryGoodsCateTree } from '@/api/goods/goods'

  const state = reactive({
    goodsCates: [] as any[],
    selectId: ''
  })

  const emits = defineEmits(['handleSelectId'])

  async function getGoodsCateTree() {
    const cates = await queryGoodsCateTree()
    state.goodsCates = cates
  }

  function onUpdateValue(id: string) {
    state.selectId = id
    emits('handleSelectId', id)
  }

  onMounted(() => {
    getGoodsCateTree()
  })
</script>
