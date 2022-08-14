<template>
  <div class="text-purple-400">
    use button
    <e-button type="orange">
      <n-icon :component="Search" />
      查询
    </e-button>
  </div>
</template>

<script setup lang="ts">
  import { UseButton as EButton } from '@/components/e-button/use-button'
  import { Search } from '@vicons/carbon'
</script>
