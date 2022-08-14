<script setup lang="ts">
  import { relateProgramOrTask } from '@/api/workflow/cause'

  async function onRelateProgram() {
    let params: IRelateProgramOrTask = {}
    await relateProgramOrTask()
  }
</script>
<template>
  <div class="relate-program"> relate-program </div>
</template>
