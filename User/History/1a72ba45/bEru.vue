<script setup lang="ts">
  defineProps<{ programId: string }>()

  interface IMenuOptions {
    key: number
    value: string
  }

  const currentMenuKey = ref<number>()

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
    <n-grid-item span="1">
      <div v-for="item in menus" :key="item.key" class="pb-5" :class="[item.key === currentMenuKey ? 'bg-mainHeader-gradientTo' : '']">
        {{ item.value }}
      </div>
    </n-grid-item>
    <n-grid-item span="7" class="bg-mainHeader-gradientTo">
      <div class="green"> content </div>
    </n-grid-item>
  </n-grid>
</template>
