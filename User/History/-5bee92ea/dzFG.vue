<script setup lang="ts">
  import { useForm } from '@/components/form'
  import { schemas } from './schemas'

  import type { IAppPackageItem } from '@/api/setting/app-package-manage/types'
  import { publishLatestApp } from '@/api/setting/app-package-manage'
  import { IFileItem } from '@/api/program/types'

  const props = defineProps<{ rowData: IAppPackageItem }>()
  const emit = defineEmits(['handleSubmit'])

  const [formRegister, { setFieldsValue }] = useForm({
    gridProps: { cols: 2 },
    labelWidth: 90,
    layout: 'horizontal',
    submitButtonText: '发布',
    schemas
  })

  const fileInfos = ref<IFileItem[]>([])

  async function onSubmit(values: IAppPackageItem) {
    let params: IAppPackageItem = {
      ...values,
      fileId: values.files![0].fileId,
      appSize: fileInfos.value!.length > 0 ? fileInfos.value![0].fileSize : values.appSize
    }
    delete params.uploadingUser
    await publishLatestApp(params)
    emit('handleSubmit')
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
  <basic-form @register="formRegister" @submit="onSubmit" />
</template>
