<script setup lang="ts">
  import { IEvidenceMenuType } from '@/api/cause-manage/types'

  const props = defineProps({
    data: {
      type: Array as PropType<IEvidenceMenuType[]>,
      default: () => []
    }
  })
</script>
<template>
  <div class="evidence-list"> evidence-list </div>
</template>
