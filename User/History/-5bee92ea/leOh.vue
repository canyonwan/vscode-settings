<script setup lang="ts">
  import { useForm } from '@/components/form'
  import { schemas } from './schemas'
  import type { IAppPackageItem, IAppVersionDetail } from '@/api/setting/app-package-manage/types'
  import { getAppVersionDetail, publishLatestApp } from '@/api/setting/app-package-manage'

  const props = defineProps<{ rowId: string }>()
  const emit = defineEmits(['handleSubmit'])

  const [formRegister, { setFieldsValue }] = useForm({
    gridProps: { cols: 2 },
    labelWidth: 90,
    layout: 'horizontal',
    submitButtonText: '发布',
    schemas
  })

  const detail = ref<IAppVersionDetail>()

  async function onSubmit(values: IAppPackageItem) {
    let params: IAppPackageItem = {
      ...values,
      fileId: values.files![0].fileId || props.rowData.fileId,
      appSize: values.files![0].fileSize || values.appSize
    }
    delete params.uploadingUser
    delete params.files
    await publishLatestApp(params)
    emit('handleSubmit')
  }

  async function getDetail() {
    const res = await getAppVersionDetail(props.rowId)
    // detail.value = res
    nextTick(() => {
      setFieldsValue({ res })
    })
  }

  watch(
    () => props.rowId,
    () => {
      props.rowId && getDetail()
    },
    {
      immediate: true
    }
  )
</script>
<template>
  <basic-form @register="formRegister" @submit="onSubmit" />
</template>
