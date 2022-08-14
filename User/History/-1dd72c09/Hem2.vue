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

<script setup lang="ts"></script>

<style scoped></style>
