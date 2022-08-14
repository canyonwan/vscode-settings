<template>
  <basic-table :row-key="(row: IDiscretionMenuType) => row.id" :request="props.loadTableData || loadTableData" ref="tableRef" :columns="tableColumns" :action-column="{}" :scroll-x="1800">
    <template #toolbar v-if="!slots.toolbar && !props.useSelection">
      <n-button type="primary" @click="addMenu"> 新增裁量清单 </n-button>
    </template>
    <template #toolbar v-else>
      <slot name="toolbar"></slot>
    </template>
  </basic-table>
</template>

<script setup lang="ts">
  import { deleteDiscretionMenu, queryAllDiscretionMenu } from '@/api/cause-manage/discretion'
  import type { IDiscretionMenuType } from '@/api/cause-manage/types'
  import { tableColumns } from '@/views/cause-library/discretion/menu/columns'

  const props = defineProps({
    loadTableData: {
      type: Function as PropType<(...arg: any[]) => Promise<any>>,
      default: null
    }
  })
</script>
