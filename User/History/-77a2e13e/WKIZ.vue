<script setup lang="ts">
  import { ICauseType } from '@/api/law/types'

  defineProps<{ target: ICauseType }>()
</script>
<template>
  <div class="save-cause-type">
    <n-form-item label="" path="">
      <n-input v-model:value="form." />
    </n-form-item>
  </div>
</template>
