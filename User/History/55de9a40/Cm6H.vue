<template>
  <a-layout class="layout">
    <a-layout-header class="header-top">
      <header-bar></header-bar>
    </a-layout-header>
    <a-layout class="main">
      <a-layout-sider width="210" class="side-menu" v-model:collapsed="collapsed" :trigger="null" collapsible :collapsedWidth="60">
        <a-menu :openKeys="openKeys" :selectedKeys="computedSelectedKeys" :mode="mode" :inlineIndent="inlineIndent" :theme="theme" @select="selectMenu" @openChange="onOpenChange">
          <template v-for="item in menuList">
            <template v-if="item.meta && !item.meta.hidden">
              <template v-if="item.children && ((item.children.length === 1 && item.meta && !item.meta.showAlways) || (item.children.length !== 1 && item.meta && item.meta.hiddenChildren))">
                <side-menu-item v-if="showChildren(item)" :key="getNameOrHref(item, true)" :parent-item="item"></side-menu-item>
                <a-menu-item v-else :key="getNameOrHref(item, true)" :title="showTitle(item, true)">
                  <img :src="require(`../../assets/layout/${item.meta.icon}.png`)" alt="" v-if="item.meta && item.meta.icon" class="iconimg" />
                  <span class="title">{{ showTitle(item.children[0]) }}</span>
                </a-menu-item>
              </template>
              <template v-else>
                <side-menu-item v-if="showChildren(item)" :key="getNameOrHref(item)" :parent-item="item"></side-menu-item>
                <a-menu-item v-else :key="getNameOrHref(item)" :title="showTitle(item)">
                  <img :src="require(`../../assets/layout/${item.meta.icon}.png`)" alt="" v-if="item.meta && item.meta.icon" class="iconimg" />
                  <span class="title">{{ showTitle(item) }}</span>
                </a-menu-item>
              </template>
            </template>
          </template>
        </a-menu>
      </a-layout-sider>
      <a-layout class="content-main">
        <a-layout-header class="main-header" v-if="route.meta && route.meta.isShowNavigation">
          <div class="flex-row">
            <header-navigation :isButtonShow="1"></header-navigation>
          </div>
        </a-layout-header>
        <a-layout-content class="content">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import { defineComponent, computed, toRefs, reactive } from 'vue'
import HeaderBar from './components/header-bar.vue'
import SideMenuItem from './components/side-menu-item.vue'
import menuHandle from './components/menuHandle'
import { useRoute, useRouter } from 'vue-router'
import HeaderNavigation from './components/header-navigation.vue'
import { useStore } from 'vuex'
import { StateType } from '@/@types'
export default defineComponent({
  name: 'Layout',
  components: {
    HeaderBar,
    SideMenuItem,
    HeaderNavigation
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore<StateType>()
    const menuList = computed(() => {
      return router.options.routes
    })
    const state = reactive({
      mode: 'inline',
      theme: 'dark',
      inlineIndent: 15,
      selectedKeys: [route.meta.selectMenuName || route.name],
      openKeys: route.matched.map((item) => item.name)
    })
    const selectMenu = (select: any) => {
      if (select.key) {
        if (select.key === 'publiclatform') {
          window.open('public/publicityPlatform.html')
          return
        }
        router.push({ name: select.key })
      }
    }
    const computedSelectedKeys = computed(() => {
      return [route.meta.selectMenuName || route.name]
    })

    const matched = computed(() => {
      return route.matched
    })
    const onOpenChange = (openKeys: string[]) => {
      if (openKeys?.length) {
        state.openKeys = [openKeys[openKeys.length - 1]]
      } else {
        state.openKeys = []
      }
    }
    const collapsed = computed(() => {
      return store.getters.collapsed
    })
    const { showTitle, showChildren, getNameOrHref } = menuHandle()
    return {
      matched,
      collapsed,
      route,
      showTitle,
      showChildren,
      getNameOrHref,
      menuList,
      selectMenu,
      onOpenChange,
      computedSelectedKeys,
      ...toRefs(state)
    }
  }
})
</script>
<style lang="less" scoped>
.layout {
  height: 100vh;
  .header-top {
    padding: 0;
    height: 50px;
    line-height: 50px;
    background: linear-gradient(180deg, #313a4e 0%, #161b26 100%);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
  }
  .main {
    padding-top: 3px;
    .side-menu {
      background-color: #2b2f3b;
    }
    .content-main {
      background-color: #f0f2f6;
      .main-header {
        height: 40px;
        line-height: 40px;
        padding: 0 15px;
        font-size: 14px;
        color: @color-title;
        background-color: #f0f2f6;
        font-weight: 500;
      }
      .content {
        padding: 0px 15px;
        overflow-y: auto;
      }
    }
  }
}
</style>
