<script setup lang="ts">
  const tableRef = ref()
</script>
<template>
  <div class="base-home">
    <basic-form @register="register" @submit="onSearch" submit-button-text="查询">
      <template #goodsTypeSlot>
        <tree-select @handleSelectId="handleSelectId" />
      </template>
    </basic-form>
    <basic-table :row-key="(row: IGoodsItem) => row.id" :request="loadTableData" ref="tableRef" :columns="goodsColumns" :action-column="actionColumn" scroll-x="1090">
      <template #toolbar>
        <n-button type="primary" @click="addGoods"> 新增商品 <n-icon :component="Add" size="22" /></n-button>
      </template>
    </basic-table>
    <basic-modal @register="modalRegister" style="width: 70%">
      <save-detail :goods-id="goodsId" @handle-save="handleSave" />
    </basic-modal>
  </div>
</template>
