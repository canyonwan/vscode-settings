<script setup lang="ts">
  import type { IEvidenceMenuType } from '@/api/cause-manage/types'
  import { evidenceColumns } from '@/views/cause-browse/components/columns'
  import { queryEvidenceGroupsFromUnlawfulAct } from '@/api/evidence/evidence-name'

  const props = defineProps<{ groupId: string }>()

  const evidences = ref<IEvidenceMenuType[]>([])

  async function getEvidences() {
    const res = await queryEvidenceGroupsFromUnlawfulAct(props.groupId)
    // res.forEach((item) => {
    //   evidences.value.push(item.baseEvidenceOutputList)
    // })
    evidences.value = res.map((item) => item.baseEvidenceOutputList)
  }

  getEvidences()
</script>
<template>
  <basic-table :row-key="(row: IEvidenceMenuType) => row.id" :dataSource="evidences" :pagination="false" :columns="evidenceColumns" scroll-x="1800" />
</template>
