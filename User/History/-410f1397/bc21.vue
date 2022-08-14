<template>
  <div class="manager">
    <n-card :bordered="false">
      <personnel-list orgId="''" :isUser="false" />
    </n-card>
  </div>
</template>

<script lang="ts">
  import PersonnelList from './components/personnel-list.vue'
  export default defineComponent({
    name: 'OrgSelect',
    components: {
      PersonnelList
    },
    emits: ['closeModal', 'onCheck'],
    setup(_props, context) {
      const treeData = ref([])
      const resetInit = async () => {}
      const submitOrgCheck = (keys) => {
        context.emit('onCheck', keys)
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
