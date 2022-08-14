<script setup lang="ts">
  defineProps<{ programId: string }>()

  interface IMenuOptions {
    key: number
    value: string
  }

  const menus = ref<IMenuOptions[]>([
    {
      key: 1,
      value: '任务'
    },
    {
      key: 2,
      value: '出示执法证'
    },
    {
      key: 3,
      value: '证据材料'
    }
  ])
</script>
<template>
  <n-grid cols="8" class="bg-darkBackground my-4 p-3">
    <n-grid-item span="2">
      <!--  -->
    </n-grid-item>
    <n-grid-item span="6" class="bg-mainHeader-gradientTo">
      <div class="green"> content </div>
    </n-grid-item>
  </n-grid>
</template>
