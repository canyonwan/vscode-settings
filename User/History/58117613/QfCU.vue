<script setup lang="ts">
  import { type IRelateProgramOrTask, relateProgramOrTask } from '@/api/workflow/cause'

  async function onRelateProgram() {
    let params: IRelateProgramOrTask = {}
    await relateProgramOrTask(params)
  }
</script>
<template>
  <div class="relate-program"> relate-program </div>
</template>
