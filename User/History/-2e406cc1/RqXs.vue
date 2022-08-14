<template>
  <div class="org-select" v-if="orgTreeData && orgTreeData.length">
    <a-menu v-model:selectedKeys="selectedKeys" :mode="mode" @select="onSelect" style="width: 250px">
      <template v-for="item in orgTreeData">
        <org-sub-menu :key="item.id" :child-data="item" v-if="item.childrenOrganizationInfoOutputs && item.childrenOrganizationInfoOutputs.length"></org-sub-menu>
        <a-menu-item v-else :key="item">{{ item.organizationName }}</a-menu-item>
      </template>
    </a-menu>
  </div>
</template>

<script lang="ts">
import { getOrgData, UnitType } from '@/api/subject/org-manage'
import { defineComponent, reactive, toRefs } from 'vue'
import handleOrgTree from './handleOrgTree'
import OrgSubMenu from './org-sub-menu.vue'
export default defineComponent({
  name: 'OrgSelect',
  components: {
    OrgSubMenu
  },
  setup(_props, context) {
    const state = reactive({
      orgTreeData: [] as UnitType[],
      selectedKeys: [],
      mode: 'inline'
    })
    const getData = async () => {
      // 保定市的机关数据
      const data = await getOrgData({ organizationType: 1 })
      const parentOrg = data.data.filter((item: any) => item.id === '253584469238218752')
      state.orgTreeData = handleOrgTree(data.data, parentOrg[0])
      console.log(state.orgTreeData, 'state.orgTreeData')
    }
    getData()

    const onSelect = ({ item, key, selectedKeys }: any) => {
      console.log(item, key, selectedKeys, ' _item, key, _selectedKeys')
      context.emit('onSelect', key)
    }
    return {
      ...toRefs(state),
      onSelect
    }
  }
})
</script>
