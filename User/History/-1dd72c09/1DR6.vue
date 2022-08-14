<template>
  <div class="menu-table-list">
    <basic-table :row-key="(row: any) => row.id" :request="props.loadTableData" ref="tableRef" :pagination="false" :columns="tableColumns" :action-column="{}" :scroll-x="1800">
      <template #toolbar><slot name="toolbar"></slot> </template>
    </basic-table>
  </div>
</template>

<script setup lang="ts">
  import { tableColumns } from '@/views/cause-library/discretion/menu/columns'

  const props = defineProps({
    loadTableData: {
      type: Function as PropType<(...arg: any[]) => Promise<any>>,
      default: null
    }
  })
  const attrs = useAttrs()

  const tableRef = ref()

  const reloadTable = () => {
    tableRef.value.reload()
  }

  defineExpose({ reloadTable })
</script>
