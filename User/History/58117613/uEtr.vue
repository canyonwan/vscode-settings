<script setup lang="ts">
  import { relateProgramOrTask } from '@/api/workflow/cause'

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function onRelateProgram() {
    let params: IRelateProgramOrTask = {}
    await relateProgramOrTask()
  }
</script>
<template>
  <div class="relate-program"> relate-program </div>
</template>
