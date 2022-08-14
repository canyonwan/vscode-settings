<script setup lang="ts">
  import { saveCustomDiscretion } from '@/api/program/program'
  import { ICustomDiscretionFormalParameter, IFileItem } from '@/api/program/types'
  import { useForm } from '@/components/form'
  import { customSchemas } from './custom-schemas'

  const props = defineProps({
    programCauseId: {
      type: String as PropType<string>,
      default: ''
    },
    mediaList: {
      type: Object as PropType<IFileItem>,
      default: () => {}
    }
  })

  const emits = defineEmits(['handleSubmitCustomDiscretion'])

  const [register] = useForm({
    gridProps: { cols: 2 },
    labelWidth: 100,
    layout: 'horizontal',
    submitButtonText: '保存',
    schemas: customSchemas
  })

  async function onSubmit(values: ICustomDiscretionFormalParameter) {
    let params = {
      ...values,
      proceduresCauseId: props.programCauseId
    }
    let res = await saveCustomDiscretion(params)
    // TODO: 保存成功 清空表单
    emits('handleSubmitCustomDiscretion', res)
  }
</script>
<template>
  <div class="custom-discretion">
    <basic-form @register="register" @submit="onSubmit" />
  </div>
</template>
