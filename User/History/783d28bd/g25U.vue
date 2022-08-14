<template>
  <div class="org-select">
    <spin :spinning="loading">
      <div :class="currentOrgId ? 'title' : 'title-active'" @click="onSelect({ id: '', isJustice: false })">保定市</div>
      <!-- 滚动高度 -->
      <div class="menu-list">
        <org-menu :treeData="orgTreeData" @onClick="onSelect" :key="isResetSelect"></org-menu>
      </div>
      <!-- <template v-else>暂无数据</template> -->
    </spin>
  </div>
</template>

<script lang="ts">
import { getOrgData, UnitType } from '@/api/subject/org-manage'
import { Spin } from 'ant-design-vue'
import { defineComponent, reactive, toRefs } from 'vue'
import handleOrgTree from './handleOrgTree'
import OrgMenu from './org-menu.vue'
export default defineComponent({
  name: 'OrgSelect',
  components: {
    OrgMenu,
    Spin
  },
  emits: ['onSelect'],
  setup(_props, context) {
    const state = reactive({
      orgTreeData: [] as UnitType[],
      currentOrgId: '',
      selectedKeys: [],
      mode: 'inline',
      loading: false,
      isResetSelect: 0
    })
    const getData = () => {
      // 保定市的机关数据
      state.loading = true
      getOrgData({ organizationType: 1 }).then(
        (data) => {
          const parentOrgList = data.data.filter((item: any) => item.belongJusticeOrgId === null && item.districtType !== 1 && !item.organizationName.includes('测试')).reverse()
          state.orgTreeData = handleOrgTree(data.data, parentOrgList)
          state.loading = false
        },
        () => {
          state.loading = false
        }
      )
    }
    getData()

    const onSelect = (orgData: UnitType) => {
      console.log('%c [ orgData ]-53', 'font-size:13px; background:#0095FF; color:white;', orgData)
      if (!orgData.id) {
        state.isResetSelect = state.isResetSelect + 1
      }
      state.currentOrgId = orgData.id
      let isJustice = orgData.isJustice
      let isSameLevel = false //是否查询同级 默认false
      let isSubordinate = false //是否查询下级 默认false
      if (orgData.id.indexOf('self') > 0) {
        isJustice = false
        state.currentOrgId = orgData.id.replace('self', '')
      }
      // 司法局 市值查同级，县市区查下级
      if (isJustice) {
        if (orgData.organizationName.includes('市直机关')) {
          isSameLevel = true
        } else {
          isSubordinate = true
        }
      }
      context.emit('onSelect', { orgId: state.currentOrgId, isSameLevel: isSameLevel, isSubordinate: isSubordinate, isJustice: isJustice })
    }

    return {
      ...toRefs(state),
      onSelect
    }
  }
})
</script>
<style lang="less" scoped>
.org-select {
  margin-right: 20px;
  .title {
    width: 230px;
    height: 50px;
    background: #f0f2f5;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .title-active {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 230px;
    height: 50px;
    color: #ffffff;
    background: #428be0;
  }

  .menu-list {
    width: 230px;
    height: 600px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
}
</style>
