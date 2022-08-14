<script setup lang="ts">
  import { saveCauseType } from '@/api/cause-manage/cause-manage'
  import type { ICauseType } from '@/api/law/types'

  const props = defineProps<{ target: ICauseType }>()
  const emit = defineEmits(['submit-handler'])
  const causeName = ref('')

  function onSubmit() {
    saveCauseType({ id: props.target.id })
    emit('submit-handler')
  }
</script>
<template>
  <div class="save-cause-type">
    <n-form-item label="违法行为名称">
      <n-input v-model:value="causeName" />
    </n-form-item>
    <n-button type="primary" size="medium" @click="onSubmit" class="float-right">确定</n-button>
  </div>
</template>
