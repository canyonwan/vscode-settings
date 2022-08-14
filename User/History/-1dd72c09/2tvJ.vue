<template>
  <basic-table
    :row-key="(row: IDiscretionMenuType) => row.id"
    :request="props.loadTableData || loadTableData"
    ref="tableRef"
    v-model:checkedRowKeys="state.boundKeys"
    :columns="tableColumns"
    :action-column="!props.useSelection ? props.actionColumn || actionColumn : {}"
    v-bind="attrs"
    :scroll-x="1800"
  >
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
  import { useModal } from '@/components/modal'
  import { TableAction } from '@/components/table'
  import { useDialog } from 'naive-ui'
  import useDynamicComp from '../../manage/options'
  import { tableColumns } from './columns'
  const props = defineProps({
    loadTableData: {
      type: Function as PropType<(...arg: any[]) => Promise<any>>,
      default: null
    }
  })
</script>

<style scoped></style>
