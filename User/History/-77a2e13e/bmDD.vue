<script setup lang="ts">
  import { ICauseType } from '@/api/law/types'

  defineProps<{ target: ICauseType }>()
</script>
<template>
  <div class="save-cause-type">
    <n-form-item label="" path="">
      <n-input v-model:value="target.name" />
    </n-form-item>
  </div>
</template>
