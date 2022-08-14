<template>
  <div class="org-select">
    <single-and-all-select :labelName="'orgName'" :treeData="treeData" v-bind="$attrs" @on-check="submitOrgCheck" @close-modal="closeModal" />
  </div>
</template>

<script lang="ts">
  import type { IOrgTreeInfo } from '@/api/user/types'
  import SingleAndAllSelect from '@/components/tree-select/single-and-all-select.vue'
  import { orgTreeData } from '../org-tree-data'

  export default defineComponent({
    name: 'OrgSelect',
    components: { SingleAndAllSelect },
    emits: ['closeModal', 'onCheck'],
    setup(_props, context) {
      const treeData = ref([])
      const resetInit = async () => {
        treeData.value = await orgTreeData({})
      }
      const submitOrgCheck = (keys: string[], option: IOrgTreeInfo[]) => {
        context.emit('onCheck', keys, option)
      }
      const closeModal = () => {
        context.emit('closeModal')
      }
      resetInit()
      return {
        treeData,
        submitOrgCheck,
        closeModal
      }
    }
  })
</script>
