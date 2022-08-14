<template>
  <div class="publicity-before">
    <actions :data="typeList" @onSwitch="switchHandler" />
    <enforcement-process :orgInfo="$props.orgInfo" v-if="showType === 5"></enforcement-process>
    <law-enforcement-table :orgInfo="$props.orgInfo" :key="showType" :type="showType" :columns="columns" v-else></law-enforcement-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs } from 'vue'
import LawEnforcementTable from './components/law-enforcement-table.vue'
import EnforcementProcess from './components/enforcement-process.vue'
import Actions from '../components/actions.vue'
import { typeList, lawEnforcerColumn } from './components/columns'
import { IAction } from '../after/options'
import type { ISelectOrgParams } from '@/api/publicity-platform/types'

export default defineComponent({
  components: { Actions, LawEnforcementTable, EnforcementProcess },
  name: 'PublicityBefore',
  props: {
    orgInfo: {
      type: Object as PropType<ISelectOrgParams>,
      default: () => {
        return {}
      }
    }
  },
  setup() {
    const state = reactive({
      showType: 1, // 数据显示类型
      columns: lawEnforcerColumn as any
    })

    const switchHandler = (item: IAction) => {
      state.columns = item.column as any
      state.showType = item.type
    }
    return {
      typeList,
      ...toRefs(state),
      switchHandler
    }
  }
})
</script>
<style lang="less" scoped>
.publicity-before {
  width: 100%;
}
</style>
