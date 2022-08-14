<template>
  <n-config-provider :theme="null" :theme-overrides="getTheme">
    <AppProvider>
      <router-view class="router-view" />
    </AppProvider>
  </n-config-provider>
</template>

<script lang="ts" setup>
  // import { zhCN, dateZhCN } from 'naive-ui'
  import { AppProvider } from '@/components/application'
  import { enforceLightTheme } from '../../enforce-theme'
  const getTheme = {
    // common: enforceLightTheme
  }
</script>

<style lang="less">
  @import '@/styles/index.less';

  .router-view {
    background-color: #fff;
    // max-width: 760px;
  }
</style>
