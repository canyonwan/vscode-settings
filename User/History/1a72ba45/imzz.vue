<script setup lang="ts">
  import { queryDataPackage } from '@/api/workflow/cause'

  const props = defineProps<{ programId: string }>()

  async function getDataPackage() {
    await queryDataPackage(props.programId)
  }
  getDataPackage()
</script>
<template>
  <n-grid cols="4" item-responsive class="bg-darkBackground">
    <n-grid-item span="1">
      <div class="light-green">
        0～400px：不显示<br />
        400～600px：占据空间 1<br />
        600～800px：占据空间 2<br />
        800px 以上：占据空间 3
      </div>
    </n-grid-item>
    <n-grid-item>
      <div class="green"> content </div>
    </n-grid-item>
  </n-grid>
</template>
