<script setup>
  import { Campsite } from '@vicons/carbon'
  defineProps({
    collapsed: {
      type: Boolean
    }
  })
</script>
<template>
  <n-space align="center" class="leading-4">
    <!-- <img src="~@/assets/images/logo.png" alt="" :class="{ 'mr-2': !collapsed }" /> -->
    <n-icon :component="Campsite" size="30" />
    <h2 v-show="!collapsed" class="title">云上商城管理系统</h2>
  </n-space>
</template>
