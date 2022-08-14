<script setup lang="ts">
  import type { IEvidenceMenuType } from '@/api/cause-manage/types'
  import { tableColumns } from '@/views/cause-library/evidence/menu/table-options'

  const props = defineProps({
    data: {
      type: Array as PropType<IEvidenceMenuType[]>,
      default: () => []
    }
  })
</script>
<template>
  <basic-table :row-key="(row: any) => row.id" :dataSource="props.data" ref="tableRef" :pagination="false" :columns="tableColumns" scroll-x="1800" />
</template>
