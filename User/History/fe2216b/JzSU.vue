<script setup lang="ts">
  import { ITimeLineTreeLeaf } from '@/api/program/types'
  import { CheckmarkCircle, EllipseOutline } from '@vicons/ionicons5'

  defineProps<{ children: ITimeLineTreeLeaf[] }>()
</script>
<template>
  <div class="flex items-center" v-for="child in children" :key="child.id">
    <div>{{ child }}</div>
  </div>
</template>
