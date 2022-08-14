<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import OrgSelect from '@/views/publicity-platform/components/org-select.vue'

const route = useRoute()
const router = useRouter()
// const tabs = reactive(['事前公开', '事后公开'])
const tabs = reactive([
  {
    value: 'before',
    label: '事前公开'
  },
  {
    value: 'after',
    label: '事后公开'
  }
])
const currentTab = ref('before')
const orgInfo = ref<any>({ orgId: '', isSameLevel: false, isSubordinate: false, isJustice: true })

function onSwitch(item: { label: string; value: string }) {
  currentTab.value = item.value
  router.replace({
    path: item.value
  })
}
function onSelect(info: { orgId: string; isSameLevel: boolean; isSubordinate: boolean }) {
  orgInfo.value = info
}
</script>
<template>
  <div class="home">
    <div class="header">
      <img width="44" src="@/assets/publicity-platform/layout/logo.png" alt="" />
      保定市人民政府
    </div>
    <div class="logo">
      <img class="logoTitle" width="600" src="@/assets/publicity-platform/layout/logo_title.png" alt="" />
    </div>
    <div class="content">
      <div class="tabs">
        <div class="switchBtn before" :class="{ isCurrent: currentTab === item.value }" v-for="item in tabs" :key="item.value" @click="onSwitch(item)">{{ item.label }}</div>
      </div>
      <div class="pos">
        当前位置: 执法主页 >
        <template v-if="route.name === 'publicityDetail'">
          <span @click="router.go(-1)" style="cursor: pointer">
            {{ route.params.type === '0' ? '事前公开 >' : '事后公开 >' }}
          </span>
          {{ route.meta.title }}
        </template>
        <template v-else>
          {{ route.meta.title }}
        </template>
      </div>
      <div class="tabContent">
        <org-select v-if="route.name !== 'publicityDetail'" @onSelect="onSelect"></org-select>
        <router-view style="margin-left: 16px" :orgInfo="orgInfo"></router-view>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.home {
  height: 100vh;
  overflow-y: scroll;
  background-image: url('./../../../assets/publicity-platform/layout/layout_bg.png');
  background-repeat: no-repeat;
  background-size: 100%;
  background-color: #f1f7ff;
  .header {
    width: 1200px;
    margin: 0 auto;
    padding-top: 34px;
    font-size: 24px;
    font-weight: bold;
    color: white;
    img {
      padding-right: 13px;
    }
  }
  .logo {
    padding: 38px 0 72px 0;
    display: flex;
    justify-content: center;
  }
  .content {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    background-color: white;
    display: flex;
    flex-direction: column;
    padding: 15px;
    .tabs {
      display: flex;
      justify-content: space-between;
      .switchBtn {
        flex: 1;
        cursor: pointer;
        font-size: 16px;
        background-color: #e2eeff;
        color: #547493;
        padding: 10px 260px;

        &.isCurrent {
          color: white;
          background: linear-gradient(180deg, #428be0 0%, #3e6ec9 100%);
          transition: 200ms ease-in;
        }
      }
    }
    .pos {
      color: #666666;
      font-size: 12px;
      text-align: left;
      padding: 16px 0 4px 0;
      border-bottom: 1px solid #c9defe;
      margin-bottom: 17px;
    }
    .tabContent {
      flex: auto;
      display: flex;
    }
  }
}
</style>
