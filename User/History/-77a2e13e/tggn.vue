<script setup lang="ts">
  import { ICauseType } from '@/api/law/types'

  defineProps<{ target: ICauseType }>()
  const emit = defineEmits(['submit-handler'])

  function onSubmit() {
    emit('submit-handler')
  }
</script>
<template>
  <div class="save-cause-type">
    <n-form-item label="违法行为名称">
      <n-input v-model:value="target.name" />
    </n-form-item>
    <n-button type="primary" size="medium" @click="onSubmit" class="float-right">确定</n-button>
  </div>
</template>
