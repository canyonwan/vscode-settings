<template>
  <div>
<NForm labelPlacement="left" labelWidth="80px">
          <NFormItem label="分组类型">
            <NSelect options={groupTypeSources} v-model:value={state.targetGroupType}///////////></NFormItem>

          <NFormItem label="绑定ID">
            <NButton onClick={selectCaseType} disabled={state.targetGroupType === '1'} type="primary">
              {state.targetGroupType === '2' ? '选择部门' : state.targetGroupType === '3' ? '选择机关' : '通用分组不可选择'}
            </NButton>
          </NFormItem>

          <NFormItem label="分组名称">
            <NInput placeholder="请输入分组名称" v-model:value={state.groupName} />
          </NFormItem>
        </NForm>

        <div class="pt-4 text-right">
          <NButton class="ml-2" onClick={() => emit('cancelEdit')}>
            取消
          </NButton>
          <NButton class="ml-2" onClick={onSubmit} type="primary">
            确定
          </NButton>
        </div>
        <BasicModal onRegister={modalRegister} style={{ with: '70%' }}>
          {h(currentComp.value, {
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
          })}
        </BasicModal>
  </div>
</template>

<script setup lang="ts">

</script>
