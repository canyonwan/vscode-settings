<script setup lang="ts">
  import { saveCustomDiscretion } from '@/api/program/program'
  import { ICustomDiscretion,  IDiscretionMenuItem } from '@/api/program/types'
  import { useForm } from '@/components/form'
  import { customSchemas } from './custom-schemas'

  const props = defineProps({
    programCauseId: {
      type: String as PropType<string>,
      default: ''
    }
  })

  const emits = defineEmits(['handleSubmit'])

  const [register] = useForm({
    gridProps: { cols: 2 },
    labelWidth: 100,
    layout: 'horizontal',
    submitButtonText: '保存',
    schemas: customSchemas
  })

  // TODO: remove ICustomDiscretionFormalParameter
  async function onSubmit(values: IDiscretionMenuItem) {
    let params = {
      ...values,
      proceduresCauseId: props.programCauseId
    }
    let res: ICustomDiscretion = await saveCustomDiscretion(params)
    emits('handleSubmit', res)
  }
</script>
<template>
  <div class="custom-discretion">
    <basic-form @register="register" @submit="onSubmit" />
  </div>
</template>
