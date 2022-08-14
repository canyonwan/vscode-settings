<script setup lang="ts">
  import type { IEvidenceMenuType } from '@/api/cause-manage/types'
  import { tableColumns } from '@/views/cause-library/evidence/menu/table-options'
  import { queryEvidenceGroupsFromUnlawfulAct } from '@/api/evidence/evidence-name'

  const props = defineProps<{ groupId: string }>()

  const evidences = ref<IEvidenceMenuType[]>([])

  async function getEvidences() {
    const res = await queryEvidenceGroupsFromUnlawfulAct(props.groupId)
    res.forEach((item) => {
      evidences.value.push(item.baseEvidenceOutputList!)
    })
    // groups.value = res
  }

  getEvidences()
</script>
<template>
  <basic-table :row-key="(row: any) => row.id" :dataSource="evidences" ref="tableRef" :pagination="false" :columns="tableColumns" scroll-x="1800" />
</template>
