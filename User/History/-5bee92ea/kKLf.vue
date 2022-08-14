<script setup lang="ts">
  import { useForm } from '@/components/form'
  import { schemas } from './schemas'

  import type { IAppPackageItem } from '@/api/setting/app-package-manage/types'
  import { publishLatestApp } from '@/api/setting/app-package-manage'
  import { IFileItem } from '@/api/program/types'
  import { useMessage } from 'naive-ui'

  const props = defineProps<{ rowData: IAppPackageItem }>()
  const emit = defineEmits(['handleSubmit'])

  const [formRegister, { setFieldsValue }] = useForm({
    gridProps: { cols: 2 },
    labelWidth: 90,
    layout: 'horizontal',
    submitButtonText: '发布',
    schemas
  })

  const fileId = ref('')
  const fileInfos = ref<IFileItem[]>([])
  const message = useMessage()

  async function onSubmit(values: IAppPackageItem) {
    if (!fileId.value && !values.fileId) {
      message.error('请上传文件')
      return
    }
    console.log('%c [ values.fileId ]-33', 'font-size:13px; background:#0095FF; color:white;', values.fileId)
    let params: IAppPackageItem = {
      ...values,
      fileId: fileId.value || values.fileId,
      appSize: fileInfos.value!.length > 0 ? fileInfos.value![0].fileSize : values.appSize
    }
    delete params.uploadingUser
    await publishLatestApp(params)
    emit('handleSubmit')
  }

  function handleUploaded(list: IFileItem[]) {
    fileInfos.value = list
    fileId.value = list.map((item) => item.fileId)[0]
  }

  watch(
    () => props.rowData,
    () => {
      props.rowData &&
        nextTick(() => {
          setFieldsValue(props.rowData)
        })
    },
    {
      immediate: true
    }
  )
</script>
<template>
  <basic-form @register="formRegister" @submit="onSubmit">
    <template #uploadSlot>
      <label class="ml-10 n-form-item-label">文件<span class="n-form-item-label__asterisk">&nbsp;*</span></label>
      <basic-upload @update:value="handleUploaded" :value="fileInfos" />
    </template>
  </basic-form>
</template>
