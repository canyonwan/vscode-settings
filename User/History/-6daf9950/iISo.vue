<script setup lang="ts">
  import { queryEvidenceListForUnlawfulAct } from '@/api/evidence/evidence-name'

  function getEvidences(params: any) {
    queryEvidenceListForUnlawfulAct()
  }
  getEvidences()
</script>
<template>
  <div class="evidence-list"> evidence-list </div>
</template>
