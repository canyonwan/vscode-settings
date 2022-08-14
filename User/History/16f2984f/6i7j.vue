<template>
  <div class="org-sub-menu">
    <a-sub-menu>
      <template #title>{{ childData.organizationName }}</template>
      <template v-for="item in childData.childrenOrganizationInfoOutputs" :key="item.id">
        <org-sub-menu :child-data="item" v-if="item.childrenOrganizationInfoOutputs && item.childrenOrganizationInfoOutputs.length"></org-sub-menu>
        <a-menu-item v-else>{{ item.organizationName }}</a-menu-item>
      </template>
    </a-sub-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { UnitType } from '@/api/subject/org-manage'
export default defineComponent({
  name: 'OrgSubMenu',
  components: {},
  props: {
    childData: {
      type: Object as PropType<UnitType>,
      default: () => {}
    }
  },
  setup() {
    return {}
  }
})
</script>
