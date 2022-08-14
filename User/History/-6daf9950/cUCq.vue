<script setup lang="ts">
  import { queryEvidenceListForUnlawfulAct } from '@/api/evidence/evidence-name'

  const props = defineProps<{ groupId: string }>()

  function getEvidences() {
    queryEvidenceListForUnlawfulAct(props.groupId)
  }

  getEvidences()
</script>
<template>
  <div class="evidence-list">
    <n-alert title="已绑定的证据分组" type="info" closable class="mb-6"> 点击下方按钮查看详情 </n-alert>
    <n-list bordered />
  </div>
</template>
