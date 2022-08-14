<template>
  <div class="layout">
    <n-layout has-sider position="absolute" style="top: 90px; bottom: 20px">
      <!-- 左边 -->
      <n-layout-sider
        :native-scrollbar="false"
        show-trigger="arrow-circle"
        @collapse="collapsed = true"
        @expand="collapsed = false"
        :collapsed="collapsed"
        collapse-mode="width"
        :collapsed-width="60"
        :width="leftMenuWidth"
        :inverted="inverted"
        class="layout-sider"
        :trigger-style="{ right: '9px' }"
        :class="{ 'enforce-theme-bg': designStore.getEnforceTheme }"
      >
        <aside-menu v-model:collapsed="collapsed" v-model:location="getMenuLocation" />
      </n-layout-sider>

      <!-- 右边 -->
      <n-layout :inverted="inverted" :native-scrollbar="false" :class="{ 'layout-default-background': getDarkTheme === false }">
        <div class="pr-5 main-view rounded-tl-3xl flex-1">
          <main-view class="" />
        </div>
        <!-- <n-back-top :right="100" /> -->
      </n-layout>
    </n-layout>
  </div>
</template>

<script lang="ts" setup>
  import { MainView } from './components/main'
  import { AsideMenu } from './components/menu'
  import { useProjectSetting } from '@/hooks/setting/use-project-setting'
  import { useDesignSetting } from '@/hooks/setting/use-design-setting'
  import { useLoadingBar } from 'naive-ui'
  import { useProjectSettingStore } from '@/store/modules/project-setting'
  import { useDesignSettingStore } from '@/store/modules/design-setting'
  const { getDarkTheme } = useDesignSetting()
  const { getNavMode, getNavTheme, getHeaderSetting, getMenuSetting, getMultiTabsSetting } = useProjectSetting()

  const settingStore = useProjectSettingStore()
  const designStore = useDesignSettingStore()

  const navMode = getNavMode

  const collapsed = ref<boolean>(false)

  const fixedHeader = computed(() => {
    const { fixed } = unref(getHeaderSetting)
    return fixed ? 'absolute' : 'static'
  })

  const isMixMenuNoneSub = computed(() => {
    const mixMenu = settingStore.menuSetting.mixMenu
    const currentRoute = useRoute()
    if (unref(navMode) != 'horizontal-mix') return true
    if (unref(navMode) === 'horizontal-mix' && mixMenu && currentRoute.meta.isRoot) {
      return false
    }
    return true
  })

  const fixedMenu = computed(() => {
    const { fixed } = unref(getHeaderSetting)
    return fixed ? 'absolute' : 'static'
  })

  const isMultiTabs = computed(() => {
    return unref(getMultiTabsSetting).show
  })

  const fixedMulti = computed(() => {
    return unref(getMultiTabsSetting).fixed
  })

  const inverted = computed(() => {
    return ['dark', 'header-dark'].includes(unref(getNavTheme))
  })

  const getHeaderInverted = computed(() => {
    const navTheme = unref(getNavTheme)
    return ['light', 'header-dark'].includes(navTheme) ? unref(inverted) : !unref(inverted)
  })

  const leftMenuWidth = computed(() => {
    const { minMenuWidth, menuWidth } = unref(getMenuSetting)
    return collapsed.value ? minMenuWidth : menuWidth
  })

  const getChangeStyle = computed(() => {
    const { minMenuWidth, menuWidth } = unref(getMenuSetting)
    return {
      'padding-left': collapsed.value ? `${minMenuWidth}px` : `${menuWidth}px`
    }
  })

  const getMenuLocation = computed(() => {
    return 'left'
  })

  const watchWidth = () => {
    const Width = document.body.clientWidth
    if (Width <= 950) {
      collapsed.value = true
    } else collapsed.value = false
  }

  onMounted(() => {
    window.addEventListener('resize', watchWidth)
    //挂载在 window 方便与在js中使用
    window['$loading'] = useLoadingBar()
    window['$loading'].finish()
  })
</script>

<style lang="less" scoped>
  .layout {
    width: 100%;
    height: 100vh;
    position: relative;
    // &-default-background {
    //   background: #f5f7f9;
    // }

    .layout-sider {
      padding: 20px 0;
      box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
      z-index: 13;
      margin-left: 20px;
      transition: all 0.2s ease-in-out;
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
    }
    .main-view {
      height: calc(100vh - 110px);
      overflow-y: auto;
    }

    .enforce-theme-bg {
      background-image: url('../assets/images/home/sider-bg.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-color: #041c35;
      border: none;
    }
  }

  // .fluid-header {
  //   padding-top: 0;
  // }
</style>
