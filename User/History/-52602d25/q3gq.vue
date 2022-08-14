<template>
  <div class="layout">
    <n-layout has-sider position="absolute" style="top: 90px; bottom: 20px">
      <!-- 左边 -->
      <n-layout-sider
        v-if="isMixMenuNoneSub && (navMode === 'vertical' || navMode === 'horizontal-mix')"
        :native-scrollbar="false"
        show-trigger="arrow-circle"
        @collapse="collapsed = true"
        @expand="collapsed = false"
        :collapsed="collapsed"
        collapse-mode="width"
        :collapsed-width="64"
        :width="leftMenuWidth"
        :inverted="inverted"
        bordered
        class="layout-sider ml-6"
        :class="{ 'enforce-theme-bg': designStore.getEnforceTheme }"
      >
        <aside-menu v-model:collapsed="collapsed" v-model:location="getMenuLocation" />
      </n-layout-sider>

      <!-- 右边 -->
      <n-layout :inverted="inverted" :native-scrollbar="false" :class="{ 'layout-default-background': getDarkTheme === false }">
        <div
          class="layout-content-main"
          :class="{
            'fluid-header': fixedHeader === 'static'
          }"
        >
          <main-view />
        </div>
        <n-back-top :right="100" />
      </n-layout>
    </n-layout>
  </div>
</template>

<script lang="ts" setup>
  import { MainView } from './components/Main'
  import { AsideMenu } from './components/Menu'
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
      transition: all 0.2s ease-in-out;
    }
    .enforce-theme-bg {
      background-image: url('../assets/images/home/sider-bg.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }

    .layout-sider-fix {
      position: fixed;
      top: 0;
      left: 0;
    }

    .ant-layout {
      overflow: hidden;
    }

    .layout-right-fix {
      overflow-x: hidden;
      padding-left: 200px;
      min-height: 100vh;
      transition: all 0.2s ease-in-out;
    }

    // .layout-content {
    //   flex: auto;
    //   min-height: 100vh;
    // }

    .n-layout-header.n-layout-header--absolute-positioned {
      z-index: 11;
    }

    .n-layout-footer {
      background: none;
    }
  }

  .layout-content-main {
    padding: 0 10px;
  }

  .fluid-header {
    padding-top: 0;
  }

  .main-view-fix {
    padding-top: 44px;
  }

  .noMultiTabs {
    padding-top: 0;
  }
</style>
