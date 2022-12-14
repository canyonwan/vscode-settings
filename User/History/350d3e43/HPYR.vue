<template>
  <n-config-provider v-if="!isLock" :locale="zhCN" :theme="getDarkTheme" :theme-overrides="designStore.enforceTheme ? getThemeOverrides2 : getThemeOverrides" :date-locale="dateZhCN">
    <AppProvider>
      <header-main />
      <router-view class="router-view" />
    </AppProvider>
  </n-config-provider>

  <transition v-if="isLock && $route.name !== 'login'" name="slide-up">
    <lock-screen />
  </transition>
</template>

<script lang="ts" setup>
  import { zhCN, dateZhCN, darkTheme } from 'naive-ui'
  import { LockScreen } from '@/components/lock-screen'
  import { AppProvider } from '@/components/application'
  import { useLockscreenStore } from '@/store/modules/lockscreen'
  import { useDesignSettingStore } from '@/store/modules/design-setting'
  import { lighten } from '@/utils/index'
  import HeaderMain from '@/layout/components/header-main/index.vue'

  const route = useRoute()
  const useLockscreen = useLockscreenStore()
  const designStore = useDesignSettingStore()
  const isLock = computed(() => useLockscreen.isLock)
  const lockTime = computed(() => useLockscreen.lockTime)

  /**
   * @type import('naive-ui').GlobalThemeOverrides
   */
  const getThemeOverrides = computed(() => {
    const appTheme = designStore.appTheme
    const lightenStr = lighten(designStore.appTheme, 6)
    return {
      common: {
        primaryColor: appTheme,
        primaryColorHover: lightenStr,
        primaryColorPressed: lightenStr
      },
      LoadingBar: {
        colorLoading: appTheme
      }
    }
  })

  const getDarkTheme = computed(() => (designStore.darkTheme ? darkTheme : undefined))

  let timer

  const timekeeping = () => {
    clearInterval(timer)
    if (route.name == 'login' || isLock.value) return
    // 设置不锁屏
    useLockscreen.setLock(false)
    // 重置锁屏时间
    useLockscreen.setLockTime()
    timer = setInterval(() => {
      // 锁屏倒计时递减
      useLockscreen.setLockTime(lockTime.value - 1)
      if (lockTime.value <= 0) {
        // 设置锁屏
        useLockscreen.setLock(true)
        return clearInterval(timer)
      }
    }, 1000)
  }

  onMounted(() => {
    document.addEventListener('mousedown', timekeeping)
  })

  onUnmounted(() => {
    document.removeEventListener('mousedown', timekeeping)
  })
</script>

<style lang="less">
  @import 'styles/index.less';
  .router-view {
    background-color: #041c35;
  }
</style>
