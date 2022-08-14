<script setup lang="ts">
  import { IBaseType } from '@/api/setting/types'
  import { useModal } from '@/components/modal'
  import useDynamicComp from './options'
  import { queryDepartmentTypes } from '@/api/setting/base-types'
  import { IFileItem } from '@/api/program/types'
  import { importCause } from '@/api/law/cause'
  import { blobToString, downloadFile } from '@/utils/download-file'
  import { useMessage } from 'naive-ui'

  const [modalRegister, { openModal, closeModal, setProps }] = useModal({})
  const { currentComp, onSwitchComp } = useDynamicComp()

  const formRef = ref()
  const deptRef = ref()
  const fileRef = ref()

  const boundDept = ref<IBaseType[]>()
  const loading = ref(false)

  interface IState {
    deptList: string
    fileTemp: File[]
    fileSize: string
  }

  const searchState: IState = reactive({
    deptList: '',
    fileSize: '',
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
    searchState.fileTemp = file ? [file] : []
    searchState.fileSize = file && file.size.toString()
  }

  const message = useMessage()
  const emit = defineEmits(['submit-handler'])

  function handleSubmit() {
    formRef.value.validate(async (err) => {
      if (!err) {
        loading.value = true
        const res = await importCause({ file: searchState.fileTemp[0], deptList: searchState.deptList })
        if (res.type === 'application/json') {
          const res2 = await blobToString(res)
          const jsonResult = JSON.parse(res2)
          if (jsonResult.code === 2000) {
            emit('submit-handler')
            message.success('导入成功 🎉')
          } else {
            message.error(jsonResult.message ?? '导入失败')
          }
        } else {
          message.error('导入失败,请查看下方的问题表格')
          downloadFile(res, '问题表格.xls')
        }

        loading.value = false
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
    fileSize: {
      required: true,
      message: '请上传文件',
      trigger: ['blur', 'change']
    }
  }

  watch(
    () => [searchState.fileSize, searchState.deptList.length],
    () => {
      searchState.fileSize && fileRef.value?.restoreValidation()
      searchState.deptList.length > 0 && deptRef.value?.restoreValidation()
    }
  )
</script>

<template>
  <n-spin :show="loading" description="正在导入，请稍候.." class="import-cause">
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
      <n-form-item ref="fileRef" label="上传文件" label-placement="left" path="fileSize">
        <BasicUpload :max="1" @update:value="handleUpload" accept=".xls,.xlsx" />
      </n-form-item>
      <div class="float-right">
        <e-button type="blue" @click="handleSubmit"> 确定</e-button>
      </div>
    </n-form>

    <!--  -->
    <basic-modal @register="modalRegister" style="width: 70%">
      <component :is="currentComp" use-selection @on-close-modal="closeModal" :load-table-data="getDepartmentData" @selected-row-handler="selectDeptHandler" @cancel-modal-handler="closeModal" />
    </basic-modal>
  </n-spin>
</template>
