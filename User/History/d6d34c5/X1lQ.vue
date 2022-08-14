<template>
  <div>
    <n-form labelPlacement="left" labelWidth="80px">
      <n-form-item label="分组类型"> <NSelect :options="groupTypeSources" v-model:value="state.targetGroupType" /></n-form-item>

      <n-form-item label="绑定ID">
        <n-button @click="selectCaseType" :disabled="state.targetGroupType === '1'" type="primary">
          {state.targetGroupType === '2' ? '选择部门' : state.targetGroupType === '3' ? '选择机关' : '通用分组不可选择'}
        </n-button>
      </n-form-item>

      <n-form-item label="分组名称">
        <NInput placeholder="请输入分组名称" v-model:value="state.groupName" />
      </n-form-item>
    </n-form>

    <div class="pt-4 text-right">
      <n-button class="ml-2" @click="() => emit('cancelEdit')"> 取消 </n-button>
      <n-button class="ml-2" @click="onSubmit" type="primary"> 确定 </n-button>
    </div>
    <basic-modal @register="modalRegister" style="width: 70%">
      <!-- {h(currentComp.value, {
            // 机关
            onCloseModal: () => closeModal(),
            onOnCheck: onOrgSelectHandler,
            bindKeys: state.boundIds,
            // 部门
            useSelection: true,
            loadTableData: () => getDepartmentTreeData(),
            onSelectedRowHandler: submitCheckedDeptTrees,
            onCancelModalHandler: () => closeModal(),
            boundKeys: state.boundIds
          })} -->
    </basic-modal>
  </div>
</template>

<script setup lang="ts"></script>
