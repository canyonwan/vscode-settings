<script setup lang="ts">
  import type { IEvidenceMenuType, IEvidenceGroupType } from '@/api/cause-manage/types'
  import { tableColumns } from '@/views/cause-library/evidence/menu/table-options'

  defineProps({
    data: {
      type: Array as PropType<IEvidenceMenuType[]>,
      default: () => []
    }
  })

  const groups = ref<IEvidenceGroupType[]>([])
  const evidences = ref<IEvidenceMenuType[]>([])

  async function getEvidences() {
    const res = await queryEvidenceGroupsFromUnlawfulAct(props.groupId)
    groups.value = res
  }

  function onViewEvidenceList(list: IEvidenceMenuType[]) {
    evidences.value = list
    openModal()
  }
</script>
<template>
  <basic-table :row-key="(row: any) => row.id" :dataSource="data" ref="tableRef" :pagination="false" :columns="tableColumns" scroll-x="1800" />
</template>
