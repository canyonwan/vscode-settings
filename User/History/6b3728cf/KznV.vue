<template>
  <div class="flex w-full base-types">
    <n-grid cols="1 s:1 m:1 l:4 xl:4 2xl:4" responsive="screen" :x-gap="12">
      <n-grid-item span="4">
        <n-card>
          <base-types
            :load-table-data="getDepartmentData"
            :table-title="'部门'"
            ref="departmentRef"
            :create-actions="createDepartmentActions"
            @submit-handler="departmentSubmitHandler"
            :frontEndIdentification="['b04_02_01']"
          />
        </n-card>
      </n-grid-item>
    </n-grid>
    <basic-modal @register="modalRegister" style="width: 40%">
      <select-bind-tag @handle-update-value="handleTreeUpdateValue" :selectKeys="state.labelSelectKeys" :data-type="state.bindType" :key="state.bindType" @close-modal="closeModal" />
    </basic-modal>

    <basic-modal @register="causeTypeModalRegister" style="width: 40%">
      <CauseType use-check @checkedKeysHandler="checkedKeysHandler" />
    </basic-modal>
  </div>
</template>

<script lang="ts" setup>
  import { boundCauseTag, boundLawTag, deleteDepartmentType, getBoundCauseTag, getBoundLawTag, queryDepartmentTypes, saveBaseType } from '@/api/setting/base-types'
  import type { IBaseType } from '@/api/setting/types'
  import { useDialog } from 'naive-ui'
  import { useModal } from '@/components/modal'
  import { LawEnum } from '@/enums/law-enum'
  import SelectBindTag from './components/select-bind-tag.vue'
  import CauseType from '@/views/law/components/cause-type.vue'

  const state = reactive({
    bindType: 0, // 是绑定法标签还是法违法行为
    departmentTypeId: '', // 部门id
    labelSelectKeys: [] as string[] // 选择的标签id集合
  })

  const departmentRef = ref()

  const dialog = useDialog()

  // 创建部门操作
  function createDepartmentActions(record: IBaseType) {
    return [
      {
        frontEndIdentification: ['b04_02_03'],
        type: 'info',
        label: '绑定法标签',
        onClick: selectBindLabel.bind(null, record, LawEnum.TAG)
      },
      {
        frontEndIdentification: ['b04_02_04'],
        type: 'info',
        label: '绑定违法行为标签',
        onClick: selectBindLabel.bind(null, record, LawEnum.CAUSE)
      },
      {
        frontEndIdentification: ['b04_02_04'],
        type: 'info',
        label: '绑定违法行为类型',
        onClick: bindCauseType.bind(null, record)
      },
      {
        frontEndIdentification: ['b04_02_02'],
        type: 'error',
        label: '删除',
        onClick: handleDepartmentDelete.bind(null, record)
      }
    ]
  }

  // 部门删除
  function handleDepartmentDelete(record: IBaseType) {
    dialog.error({
      title: '警告',
      content: '你确定删除？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await deleteDepartmentType(record.id)
        departmentRef.value.reloadTable()
      }
    })
  }

  // 获取部门类型数据
  async function getDepartmentData() {
    return await queryDepartmentTypes()
  }

  // 保存部门类型
  async function departmentSubmitHandler(values: IBaseType) {
    await saveBaseType(values)
    departmentRef.value.reloadTable()
    departmentRef.value.closeModal()
  }

  const [modalRegister, { openModal, closeModal }] = useModal({})
  const [causeTypeModalRegister, { openModal: openCauseTypeModal, closeModal: closeCauseTypeModal }] = useModal({ title: '选择违法行为类型' })

  // 选择绑定标签
  function selectBindLabel(record, type) {
    state.departmentTypeId = record.id
    state.bindType = type
    type === LawEnum.TAG ? getBindLawLabel(record.id) : getBindCauseLabel(record.id)
    openModal()
  }

  // 选择违法行为类型
  function bindCauseType(record) {
    state.departmentTypeId = record.id
    openCauseTypeModal()
  }

  // 选择违法行为类型
  function checkedKeysHandler(ids: string[]) {
    //
  }

  // 获取已绑定法标签
  async function getBindLawLabel(departmentTypeId: string) {
    const data = await getBoundLawTag(departmentTypeId)
    state.labelSelectKeys = data.infoList.map((item) => item.LawTagId) || []
  }
  // 获取已绑定违法行为标签
  async function getBindCauseLabel(departmentTypeId: string) {
    const data = await getBoundCauseTag(departmentTypeId)
    state.labelSelectKeys = data.infoList.map((item) => item.causeTagId) || []
  }

  // 法标签Tree选择
  function handleTreeUpdateValue(keys: string[]) {
    state.labelSelectKeys = keys
    state.bindType === LawEnum.TAG ? bindLawLabel() : bindCauseLabel()
    closeModal()
  }

  // 绑定法标签
  async function bindLawLabel() {
    const params = {
      departmentTypeId: state.departmentTypeId,
      lawTagIdList: state.labelSelectKeys
    }
    await boundLawTag(params)
  }

  // 绑定违法行为标签
  async function bindCauseLabel() {
    const params = {
      departmentTypeId: state.departmentTypeId,
      causeTagIdList: state.labelSelectKeys
    }
    await boundCauseTag(params)
  }
</script>
