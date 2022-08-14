<script setup lang="ts">
  import { ITimeLineTreeLeaf } from '@/api/program/types'

  const props = defineProps<{ children: ITimeLineTreeLeaf[] }>()
</script>
<template>
  <div class="evidence-leaf"> evidence-leaf </div>
</template>
