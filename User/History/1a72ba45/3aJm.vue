<script setup lang="ts">
  defineProps<{ programId: string }>()

  interface IMenuOptions {
    key: number
    value: string
  }

  const currentMenuKey = ref<number>(1)

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

  function onSelectMenu(value: IMenuOptions) {
    currentMenuKey.value = value.key
  }
</script>
<template>
  <n-grid cols="8" class="bg-darkBackground my-4 p-3 rounded" :style="{ height: 'calc(100vh - ' + 200 + 'px)' }">
    <n-grid-item span="1">
      <div
        v-for="item in menus"
        :key="item.key"
        @click="onSelectMenu(item)"
        class="text-sm py-3 px-2 transition duration-300 ease-in-out cursor-pointer"
        :class="[item.key === currentMenuKey ? 'bg-mainHeader-gradientTo' : '', item.key === currentMenuKey ? 'text-white' : 'text-gray-400']"
      >
        {{ item.value }}
      </div>
    </n-grid-item>
    <n-grid-item span="7" class="bg-mainHeader-gradientTo py-2 px-3">
      <div class="green"> content </div>
    </n-grid-item>
  </n-grid>
</template>
