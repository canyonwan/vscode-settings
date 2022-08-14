<script setup lang="ts">
  import { IBaseType } from '@/api/setting/types'
  import { useModal } from '@/components/modal'
  import useDynamicComp from './options'
  import { queryDepartmentTypes } from '@/api/setting/base-types'
  import { IFileItem } from '@/api/program/types'
  import { importCause } from '@/api/law/cause'

  const [modalRegister, { openModal, closeModal, setProps }] = useModal({})
  const { currentComp, onSwitchComp } = useDynamicComp()

  const formRef = ref()
  const deptRef = ref()
  const fileRef = ref()

  const boundDept = ref<IBaseType[]>()

  const searchState = reactive({
    deptList: '',
    fileTemp: []
  })

  // 获取部门类型数据
  async function getDepartmentData() {
    return await queryDepartmentTypes()
  }

  // 打开部门类型Modal
  function onSelectDepartmentTypes() {
    setProps({ title: '选择部门类型' })
    openModal()
    onSwitchComp(2)
  }

  // 选中部门回调
  function selectDeptHandler(keys: string[], rows: IBaseType[]) {
    searchState.deptList = keys.join(',')
    boundDept.value = rows
    closeModal()
  }

  function handleUpload(_: IFileItem[], file: File) {
    searchState.fileTemp = [file]
    console.log('%c [ searchState.fileTemp ]-44', 'font-size:13px; background:#0095FF; color:white;', searchState.fileTemp)
  }

  // handleSubmit
  function handleSubmit() {
    formRef.value.validate(async (err) => {
      console.log('%c [ err ]-49', 'font-size:13px; background:#0095FF; color:white;', err)
      if (!err) {
        await importCause({ file: JSON.parse(searchState.fileTemp), deptList: searchState.deptList })
        closeModal()
      }
    })
  }

  const rules = {
    deptList: {
      required: true,
      message: '请选择部门类型',
      trigger: ['blur', 'change']
    },
    fileTemp: {
      required: true,
      message: '请上传文件',
      trigger: ['blur', 'change']
    }
  }

  watch(
    () => [searchState.fileTemp, searchState.deptList.length],
    () => {
      searchState.fileTemp && fileRef.value?.restoreValidation()
      searchState.deptList.length > 0 && deptRef.value?.restoreValidation()
    }
  )
</script>

<template>
  <div class="import-cause">
    <n-form :model="searchState" ref="formRef" :rules="rules" :inline="false">
      <n-form-item ref="deptRef" label="部门类型" label-placement="left" path="deptList">
        <n-space vertical>
          <n-button ghost type="primary" @click="onSelectDepartmentTypes">选择部门类型</n-button>
          <n-space>
            <n-tag type="success" v-for="item in boundDept" :key="item.id">
              <n-ellipsis style="max-width: 240px">
                {{ item.name }}
              </n-ellipsis>
            </n-tag>
          </n-space>
        </n-space>
      </n-form-item>
      <n-form-item ref="fileRef" label="上传文件" label-placement="left" path="fileTemp">
        <BasicUpload @update:value="handleUpload" accept=".xls,.xlsx" />
      </n-form-item>
      <div class="float-right">
        <e-button type="blue" @click="handleSubmit"> 确定</e-button>
      </div>
    </n-form>

    <!--  -->
    <basic-modal @register="modalRegister" style="width: 70%">
      <component :is="currentComp" use-selection @on-close-modal="closeModal" :load-table-data="getDepartmentData" @selected-row-handler="selectDeptHandler" @cancel-modal-handler="closeModal" />
    </basic-modal>
  </div>
</template>
