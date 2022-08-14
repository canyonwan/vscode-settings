<script setup>
  import { Campsite } from '@vicons/carbon'
  defineProps({
    collapsed: {
      type: Boolean
    }
  })
</script>
<template>
  <div class="logo">
    <!-- <img src="~@/assets/images/logo.png" alt="" :class="{ 'mr-2': !collapsed }" /> -->
    <n-icon :component="Campsite" size="30" color="#000" />
    <h2 v-show="!collapsed" class="title">云上商城管理系统</h2>
  </div>
</template>

<style lang="less" scoped>
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    line-height: 64px;
    overflow: hidden;
    white-space: nowrap;

    img {
      width: auto;
      height: 32px;
    }

    .title {
      margin-bottom: 0;
    }
  }
</style>
