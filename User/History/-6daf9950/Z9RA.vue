<script setup lang="ts">
  import { queryEvidenceListForUnlawfulAct } from '@/api/evidence/evidence-name'

  const props = defineProps<{ groupId: string }>()

  function getEvidences(params: any) {
    queryEvidenceListForUnlawfulAct(props.groupId)
  }
  getEvidences()
</script>
<template>
  <div class="evidence-list"> evidence-list </div>
</template>
